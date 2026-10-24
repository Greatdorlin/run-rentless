"use client";

import { useEffect, useRef, useState } from "react";
import chapters from "./tour-script.json";
import voiceManifest from "./gd-voice.json";
import { GdCharacter } from "./gd-character";
import { narrationEvent } from "./narrated-copy";

type Clip = { src: string; text: string; words: Array<{ start: number; end: number; char: number }> };
type Status = "idle" | "loading" | "playing" | "paused" | "done" | "error";
const assets = voiceManifest as { voiceName: string; intro?: Clip; segments: Clip[] };
const segments = chapters.flatMap((chapter, chapterIndex) => chapter.lines.map(text => ({ text, chapterIndex })));
const ready = assets.segments.length === segments.length && assets.segments.every((clip, i) => clip.text === segments[i].text && clip.words.length > 0);
const preferenceKey = "moredone:gd-tour-choice";

export function CompanionTour({ open, onOpen, onClose, onSpeaking }: { open: boolean; onOpen: () => void; onClose: () => void; onSpeaking: (value: boolean) => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [compact, setCompact] = useState(false);
  const [index, setIndex] = useState(0);
  const [follow, setFollow] = useState(true);
  const current = useRef(0);
  const generation = useRef(0);
  const player = useRef<HTMLAudioElement | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const isIntro = useRef(false);
  const frame = useRef(0);
  const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paused = useRef(false);
  function markWord(segment: number, char: number) { window.dispatchEvent(new CustomEvent(narrationEvent, { detail: { segment, char } })); }
  const followPage = useRef(true);

  function halt() {
    generation.current++;
    if (watchdog.current) clearTimeout(watchdog.current);
    cancelAnimationFrame(frame.current);
    if (player.current) {
      player.current.onended = null;
      player.current.onerror = null;
      player.current.pause();
    }
    audio.current = null;
    isIntro.current = false;
    markWord(-1, 0);
    onSpeaking(false);
  }
  function remember() { try { sessionStorage.setItem(preferenceKey, "chosen"); } catch { /* Preference is optional. */ } }
  function stop() { halt(); current.current = 0; setIndex(0); setStatus("idle"); setCompact(false); }
  function close() { stop(); remember(); onClose(); }
  function showSection(target: string) {
    document.getElementById(target)?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  function pause() {
    paused.current = true;
    if (watchdog.current) clearTimeout(watchdog.current);
    audio.current?.pause();
    cancelAnimationFrame(frame.current);
    onSpeaking(true); setStatus("paused");
  }
  function track(element: HTMLAudioElement, clipIndex: number) {
    cancelAnimationFrame(frame.current);
    let previousChar = -1;
    const tick = () => {
      if (audio.current !== element || element.paused) return;
      const cue = assets.segments[clipIndex].words.find(word => element.currentTime >= word.start && element.currentTime <= word.end);
      if (cue && cue.char !== previousChar) { previousChar = cue.char; markWord(clipIndex, cue.char); }
      frame.current = requestAnimationFrame(tick);
    };
    tick();
  }
  function start() {
    if (!ready) return;
    paused.current = false;
    remember(); setCompact(true);
    if (status === "paused" && audio.current && !isIntro.current) {
      const element = audio.current;
      const token = generation.current;
      setStatus("loading");
      element.play().then(() => {
        if (token !== generation.current || paused.current) { element.pause(); return; }
        setStatus("playing"); onSpeaking(true); track(element, current.current);
      }).catch(() => { if (token === generation.current && !paused.current) { halt(); setStatus("error"); setCompact(false); } });
      return;
    }
    halt();
    onSpeaking(true);
    const token = generation.current;
    function speak(next: number) {
      if (token !== generation.current) return;
      if (next >= segments.length) { audio.current = null; markWord(-1, 0); setStatus("done"); return; }
      current.current = next; setIndex(next); markWord(next, 0); setStatus("loading");
      if (followPage.current && (next === 0 || segments[next - 1].chapterIndex !== segments[next].chapterIndex)) showSection(chapters[segments[next].chapterIndex].target);
      const element = player.current ?? new Audio();
      player.current = element; audio.current = element;
      element.src = assets.segments[next].src;
      element.preload = "auto";
      watchdog.current = setTimeout(() => { if (token === generation.current) { halt(); setStatus("error"); setCompact(false); } }, 15000);
      element.onended = () => {
        if (token !== generation.current || paused.current) return;
        if (watchdog.current) clearTimeout(watchdog.current);
        cancelAnimationFrame(frame.current); audio.current = null; speak(next + 1);
      };
      element.onerror = () => { if (token === generation.current) { halt(); setStatus("error"); setCompact(false); } };
      element.play().then(() => {
        if (token !== generation.current || paused.current) { element.pause(); return; }
        if (watchdog.current) clearTimeout(watchdog.current);
        setStatus("playing"); onSpeaking(true); track(element, next);
      }).catch(() => { if (token === generation.current && !paused.current) { halt(); setStatus("error"); setCompact(false); } });
    }
    speak(status === "done" ? 0 : current.current);
  }

  useEffect(() => {
    const openTour = () => onOpen();
    const hidden = () => {
      if (document.hidden && audio.current) {
        if (isIntro.current) halt();
        else pause();
      }
    };
    window.addEventListener("moredone:tour", openTour);
    document.addEventListener("visibilitychange", hidden);
    const timer = setTimeout(() => {
      if (!ready || document.hidden) return;
      try { if (sessionStorage.getItem(preferenceKey) || sessionStorage.getItem("moredone:companion-hidden")) return; } catch { /* Optional preference. */ }
      const form = document.getElementById("join")?.getBoundingClientRect();
      if ((form && form.top < innerHeight && form.bottom > 0) || document.activeElement?.matches("input,textarea,select")) return;
      onOpen();
      if (assets.intro) {
        const element = player.current ?? new Audio();
        player.current = element; audio.current = element; isIntro.current = true;
        const token = generation.current;
        element.src = assets.intro.src;
        element.onended = () => { if (token === generation.current) { audio.current = null; isIntro.current = false; } };
        // Browsers may refuse the spoken invitation before the visitor's first tap.
        // The Yes/No question is always visible and the full tour requires consent.
        element.play().catch(() => { if (token === generation.current) { audio.current = null; isIntro.current = false; } });
      }
    }, 150);
    return () => { clearTimeout(timer); halt(); window.removeEventListener("moredone:tour", openTour); document.removeEventListener("visibilitychange", hidden); };
    // Refs keep playback callbacks current without restarting the arrival prompt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) { if (audio.current) stop(); return; }
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);


  const chapter = chapters[segments[index].chapterIndex];
  const active = status !== "idle";
  const controls = <div className="md-tour__controls">
    {status === "playing" || status === "loading" ? <button type="button" className="md-tour__primary" onClick={pause}>Pause audio</button>
      : status === "done" ? <button type="button" className="md-tour__primary" onClick={() => { close(); showSection("join"); }}>Join the challenge</button>
      : <button type="button" className="md-tour__primary" onClick={start} disabled={!ready}>{status === "paused" ? "Resume audio" : active ? "Try audio again" : "Yes, read it to me"}</button>}
    <button type="button" onClick={close}>{active ? "Stop" : "No, I’ll read"}</button>
  </div>;

  if (open && compact && active && status !== "error") return <aside className="md-voice-dock" aria-label="GD voice guide">
    <button className="md-voice-dock__avatar" type="button" onClick={() => showSection(chapter.target)} aria-label="Show the page text being read"><GdCharacter talking={status === "playing"} /></button>
    <div className="md-voice-dock__controls">
      {status === "playing" || status === "loading" ? <button type="button" onClick={pause} aria-label="Pause narration">Pause</button> : status === "done" ? <button type="button" onClick={() => { close(); showSection("join"); }}>Join</button> : <button type="button" onClick={start} aria-label="Resume narration">Play</button>}
      <button type="button" onClick={close} aria-label="Stop narration">Stop</button>
    </div>
    <span className="md-voice-dock__status" role="status">{status === "paused" ? "Paused" : status === "loading" ? "Starting…" : status === "done" ? "Ready to join?" : "GD · Reading"}</span>
  </aside>;

  return <aside className="md-tour" hidden={!open} aria-label="MoreDone audio tour">
    <button type="button" className="md-tour__close" onClick={close} aria-label="Close audio tour">×</button>
    <span className="md-tour__eyebrow">LISTEN WITH GD</span>
    <h2>{active ? chapter.title : "Would you like me to read this page to you?"}</h2>
    {!active && <p>I’ll read the highlighted text on this page.</p>}
    {status === "error" && <p role="alert">Audio could not start. Tap below to try again, or continue reading the page.</p>}
    {!ready && <p>The voice guide is being updated. You can continue reading the page.</p>}
    {controls}
    {ready && <label className="md-tour__follow"><input type="checkbox" checked={follow} onChange={event => { followPage.current = event.target.checked; setFollow(event.target.checked); }} /> Follow the page as I listen</label>}
    {ready && <small>GD’s voice · AI narration</small>}
  </aside>;
}
