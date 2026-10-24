"use client";

import { useEffect, useRef, useState } from "react";
import voiceManifest from "./gd-voice.json";
import { GdCharacter } from "./gd-character";
import { clearReading, highlightWord, locatePassage, revealPassage, type PagePart } from "./page-reading";

type Cue = { segment: number; char: number; start: number; end: number };
type Section = { segment: number; start: number; end: number };
type VoiceAssets = { intro?: { src: string }; segments: Array<{ text: string; parts: PagePart[] }>; track?: { src: string; words: Cue[]; sections: Section[] } };
type Status = "idle" | "loading" | "playing" | "paused" | "done" | "error";
const assets = voiceManifest as unknown as VoiceAssets;
const ready = !!assets.track?.words.length && assets.segments.every(clip => clip.parts?.length);
const preferenceKey = "moredone:gd-tour-choice";

export function CompanionTour({ open, onOpen, onClose, onSpeaking }: { open: boolean; onOpen: () => void; onClose: () => void; onSpeaking: (value: boolean) => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [staleAudio, setStaleAudio] = useState(false);
  const [compact, setCompact] = useState(false);
  const [follow, setFollow] = useState(true);
  const current = useRef(0);
  const playhead = useRef(0);
  const generation = useRef(0);
  const player = useRef<HTMLAudioElement | null>(null);
  const isIntro = useRef(false);
  const frame = useRef(0);
  const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paused = useRef(false);
  const followPage = useRef(true);
  const meter = useRef<{ context: AudioContext; analyser: AnalyserNode; data: Uint8Array<ArrayBuffer> } | null>(null);
  const targets = useRef(new Map<number, NonNullable<ReturnType<typeof locatePassage>>>());

  function remember() { try { sessionStorage.setItem(preferenceKey, "chosen"); } catch { /* Optional preference. */ } }
  function clearTimer() { if (watchdog.current) clearTimeout(watchdog.current); watchdog.current = null; }
  function halt() {
    generation.current++; clearTimer(); cancelAnimationFrame(frame.current);
    if (player.current) {
      player.current.pause(); player.current.onended = null; player.current.onerror = null;
      player.current.onwaiting = null; player.current.onplaying = null;
    }
    isIntro.current = false; clearReading();
    document.documentElement.style.removeProperty("--md-mouth-open"); onSpeaking(false);
  }
  function close() {
    halt(); remember(); playhead.current = 0; setStatus("idle"); setCompact(false);
    clearReading(true); onClose();
  }
  function showCurrent() { const passage = targets.current.get(current.current); if (passage) revealPassage(passage, true); }
  function join() {
    close(); document.getElementById("join")?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  function pause() {
    paused.current = true; clearTimer(); player.current?.pause(); cancelAnimationFrame(frame.current);
    document.documentElement.style.removeProperty("--md-mouth-open");
    onSpeaking(true); setStatus("paused");
  }
  async function connectMeter(element: HTMLAudioElement) {
    try {
      if (meter.current) { await meter.current.context.resume(); return; }
      const Audio = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Audio) return;
      const context = new Audio(); await context.resume();
      if (context.state !== "running") { await context.close(); return; }
      const analyser = context.createAnalyser(); analyser.fftSize = 256;
      context.createMediaElementSource(element).connect(analyser); analyser.connect(context.destination);
      meter.current = { context, analyser, data: new Uint8Array(analyser.fftSize) };
      document.documentElement.dataset.mdMouthSync = "true";
    } catch { /* Audio still plays when level analysis is unsupported. */ }
  }
  function track(element: HTMLAudioElement) {
    cancelAnimationFrame(frame.current);
    let lastWord = -1; let lastSection = -1;
    const { sections, words } = assets.track!;
    const tick = () => {
      if (paused.current || element.paused || isIntro.current) return;
      const time = element.currentTime; playhead.current = time;
      const section = sections.find(item => time >= item.start && time < item.end + .12);
      if (section && section.segment !== lastSection) {
        const passage = targets.current.get(section.segment);
        if (!passage) {
          const next = sections.find(item => item.start > time && targets.current.has(item.segment));
          element.currentTime = next ? next.start : element.duration;
          frame.current = requestAnimationFrame(tick); return;
        }
        current.current = section.segment; lastSection = section.segment;
        revealPassage(passage, followPage.current);
      }
      let low = 0; let high = words.length - 1; let found = -1;
      while (low <= high) { const mid = (low + high) >>> 1; if (words[mid].start <= time) { found = mid; low = mid + 1; } else high = mid - 1; }
      if (found >= 0 && found !== lastWord && time <= words[found].end) {
        const word = words[found]; const passage = targets.current.get(word.segment);
        if (passage) { highlightWord(passage, word.char); lastWord = found; }
      }
      if (meter.current) {
        const { analyser, data } = meter.current; analyser.getByteTimeDomainData(data);
        let sum = 0; for (const value of data) sum += ((value - 128) / 128) ** 2;
        const opening = .55 + Math.min(1, Math.sqrt(sum / data.length) * 10) * .9;
        document.documentElement.style.setProperty("--md-mouth-open", opening.toFixed(3));
      }
      frame.current = requestAnimationFrame(tick);
    };
    tick();
  }
  async function start() {
    if (!ready) return;
    const restarting = status === "done" || status === "idle" || isIntro.current;
    halt(); paused.current = false; remember(); setStaleAudio(false); setCompact(true); setStatus("loading"); onSpeaking(true);
    if (restarting) playhead.current = 0;
    targets.current.clear();
    assets.segments.forEach((clip, index) => { const passage = locatePassage(clip.parts); if (passage) targets.current.set(index, passage); });
    if (targets.current.size !== assets.segments.length) {
      halt(); setStaleAudio(true); setStatus("error"); setCompact(false); return;
    }
    const token = generation.current;
    const element = player.current ?? new window.Audio(); player.current = element; isIntro.current = false;
    if (!element.src.endsWith(assets.track!.src)) { element.src = assets.track!.src; element.preload = "auto"; }
    element.currentTime = playhead.current;
    const fail = () => { if (token === generation.current && !paused.current) { halt(); setStatus("error"); setCompact(false); } };
    element.onerror = fail;
    element.onwaiting = () => { if (!paused.current && token === generation.current) { clearTimer(); setStatus("loading"); watchdog.current = setTimeout(fail, 25000); } };
    element.onplaying = () => { if (!paused.current && token === generation.current) { clearTimer(); setStatus("playing"); track(element); } };
    element.onended = () => { if (token === generation.current) {
      clearTimer(); cancelAnimationFrame(frame.current); clearReading();
      document.documentElement.style.removeProperty("--md-mouth-open");
      onSpeaking(false); setStatus("done");
    } };
    watchdog.current = setTimeout(fail, 25000);
    await connectMeter(element);
    if (token !== generation.current || paused.current) return;
    try { await element.play(); if (token !== generation.current || paused.current) element.pause(); }
    catch { fail(); }
  }

  useEffect(() => {
    const openTour = () => onOpen();
    const hidden = () => { if (document.hidden && player.current && !player.current.paused) { if (isIntro.current) halt(); else pause(); } };
    window.addEventListener("moredone:tour", openTour); document.addEventListener("visibilitychange", hidden);
    const timer = setTimeout(() => {
      if (!ready || document.hidden) return;
      try { if (sessionStorage.getItem(preferenceKey) || sessionStorage.getItem("moredone:companion-hidden")) return; } catch { /* Optional preference. */ }
      const form = document.getElementById("join")?.getBoundingClientRect();
      if ((form && form.top < innerHeight && form.bottom > 0) || document.activeElement?.matches("input,textarea,select")) return;
      onOpen();
      if (assets.intro) {
        const element = player.current ?? new window.Audio(); player.current = element; isIntro.current = true;
        const token = generation.current; element.src = assets.intro.src;
        element.onended = () => { if (token === generation.current) isIntro.current = false; };
        element.play().catch(() => { if (token === generation.current) isIntro.current = false; });
      }
    }, 150);
    return () => {
      clearTimeout(timer); halt(); clearReading(true); void meter.current?.context.close();
      delete document.documentElement.dataset.mdMouthSync;
      window.removeEventListener("moredone:tour", openTour); document.removeEventListener("visibilitychange", hidden);
    };
    // Playback state lives in refs so the arrival question only runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!open) { if (player.current && !player.current.paused) halt(); return; }
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", escape); return () => window.removeEventListener("keydown", escape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const active = status !== "idle";
  if (open && compact && active && status !== "error") return <aside className="md-voice-dock" aria-label="GD voice guide">
    <button className="md-voice-dock__avatar" type="button" onClick={showCurrent} aria-label="Show the page text being read"><GdCharacter talking={status === "playing"} /></button>
    <div className="md-voice-dock__controls">
      {status === "playing" || status === "loading" ? <button type="button" onClick={pause} aria-label="Pause narration">Pause</button> : status === "done" ? <button type="button" onClick={join}>Join</button> : <button type="button" onClick={() => void start()} aria-label="Resume narration">Play</button>}
      <button type="button" onClick={close} aria-label="Stop narration">Stop</button>
    </div>
    <span className="md-voice-dock__status" role="status">{status === "paused" ? "Paused" : status === "loading" ? "Loading audio…" : status === "done" ? "Ready to join?" : "GD · Reading"}</span>
  </aside>;
  return <aside className="md-tour" hidden={!open} aria-label="MoreDone audio tour">
    <button type="button" className="md-tour__close" onClick={close} aria-label="Close audio tour">×</button>
    <span className="md-tour__eyebrow">LISTEN WITH GD</span><h2>Would you like me to read this page to you?</h2>
    <p>I’ll read the page and highlight the words as we go.</p>
    {status === "error" && <p role="alert">{staleAudio ? "GD’s recording needs updating to match this page. Please continue reading while we finish the full-page audio." : "The audio connection stopped. Tap to continue, or carry on reading."}</p>}
    {!ready && <p>The voice guide is being updated. You can continue reading the page.</p>}
    <div className="md-tour__controls"><button type="button" className="md-tour__primary" onClick={() => void start()} disabled={!ready}>{status === "error" ? "Continue audio" : "Yes, read it to me"}</button><button type="button" onClick={close}>No, I’ll read</button></div>
    {ready && <label className="md-tour__follow"><input type="checkbox" checked={follow} onChange={event => { followPage.current = event.target.checked; setFollow(event.target.checked); }} /> Follow the page as I listen</label>}
    {ready && <small>GD’s voice · AI narration</small>}
  </aside>;
}
