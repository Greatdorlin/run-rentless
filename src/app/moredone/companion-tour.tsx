"use client";

import { useEffect, useRef, useState } from "react";
import chapters from "./tour-script.json";
import voiceAssets from "./gd-voice.json";

const preferenceKey = "moredone:tour-choice";
const segments = chapters.flatMap((chapter, chapterIndex) => chapter.lines.map(text => ({ text, chapterIndex })));
type VoiceAsset = { src: string; text: string; words: Array<{ start: number; end: number; char: number }> };
const recorded = voiceAssets.segments as VoiceAsset[];
const hasGdVoice = recorded.length === segments.length && recorded.every((asset, i) => asset.text === segments[i].text && asset.words.length > 0);
type Status = "idle" | "loading" | "playing" | "paused" | "done" | "error";

export function CompanionTour({ open, onOpen, onClose, onSpeaking }: { open: boolean; onOpen: () => void; onClose: () => void; onSpeaking: (value: boolean) => void }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceId, setVoiceId] = useState(hasGdVoice ? "gd" : "");
  const [compact, setCompact] = useState(false);
  const [wordChar, setWordChar] = useState(0);
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [index, setIndex] = useState(0);
  const current = useRef(0);
  const generation = useRef(0);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const audioFrame = useRef(0);
  const following = useRef(false);
  const captionRoot = useRef<HTMLParagraphElement>(null);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancel() {
    generation.current++;
    if (startTimer.current) clearTimeout(startTimer.current);
    if (utterance.current) window.speechSynthesis?.cancel();
    cancelAnimationFrame(audioFrame.current);
    if (audio.current) { audio.current.pause(); audio.current.onended = null; audio.current.onerror = null; audio.current = null; }
    utterance.current = null;
    onSpeaking(false);
  }
  function pause() {
    if (startTimer.current) clearTimeout(startTimer.current);
    if (audio.current) { audio.current.pause(); cancelAnimationFrame(audioFrame.current); onSpeaking(false); }
    else cancel();
    setStatus("paused");
  }
  function stop() { cancel(); current.current = 0; setIndex(0); setWordChar(0); setCompact(false); setStatus("idle"); }
  function remember() { try { sessionStorage.setItem(preferenceKey, "chosen"); } catch { /* Optional preference. */ } }
  function close() { stop(); remember(); onClose(); }

  useEffect(() => {
    const openTour = () => onOpen();
    window.addEventListener("moredone:tour", openTour);
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      queueMicrotask(() => setSupported(false));
      if (!hasGdVoice) return () => window.removeEventListener("moredone:tour", openTour);
    }
    const synth = window.speechSynthesis;
    const load = () => setVoices((synth?.getVoices() ?? []).filter(voice => /^en(?:-|_)/i.test(voice.lang)).sort((a, b) => Number(/natural|premium|enhanced/i.test(b.name)) - Number(/natural|premium|enhanced/i.test(a.name))));
    load();
    synth?.addEventListener("voiceschanged", load);
    const hidden = () => { if (document.hidden && (utterance.current || audio.current)) pause(); };
    document.addEventListener("visibilitychange", hidden);
    const timer = setTimeout(() => {
      try { if (sessionStorage.getItem(preferenceKey) || sessionStorage.getItem("moredone:companion-hidden")) return; } catch { /* Optional preference. */ }
      const form = document.getElementById("join")?.getBoundingClientRect();
      if (!document.hidden && !(form && form.top < innerHeight && form.bottom > 0) && !document.activeElement?.matches("input,textarea,select")) onOpen();
    }, 8000);
    return () => { clearTimeout(timer); cancel(); synth?.removeEventListener("voiceschanged", load); document.removeEventListener("visibilitychange", hidden); window.removeEventListener("moredone:tour", openTour); };
    // Event handlers use refs; the invitation is scheduled once per visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) { if (utterance.current || audio.current) stop(); return; }
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const box = captionRoot.current;
    const word = box?.querySelector<HTMLElement>(".md-tour__word--current");
    if (!box || !word) return;
    const bounds = box.getBoundingClientRect();
    const line = word.getBoundingClientRect();
    if (line.bottom > bounds.bottom - 8) box.scrollTop += line.bottom - bounds.bottom + 12;
    else if (line.top < bounds.top + 24) box.scrollTop -= bounds.top + 24 - line.top;
  }, [index, wordChar, compact]);

  function play(from = current.current, chosen = voiceId) {
    if (!supported && !(hasGdVoice && chosen === "gd")) return;
    setCompact(true);
    if (chosen === "gd" && status === "paused" && audio.current) {
      const element = audio.current;
      element.play().then(() => { if (audio.current === element) { setStatus("playing"); onSpeaking(true); trackAudio(element, current.current); } }).catch(() => { cancel(); setStatus("error"); });
      return;
    }
    cancel(); remember();
    const token = generation.current;
    const voice = voices.find(item => item.voiceURI === chosen) ?? voices.find(item => item.default) ?? voices[0];
    function speak(next: number) {
      if (token !== generation.current) return;
      if (next >= segments.length) { utterance.current = null; onSpeaking(false); setStatus("done"); return; }
      current.current = next; setIndex(next); setWordChar(0); setStatus("loading");
      if (following.current && (next === 0 || segments[next - 1].chapterIndex !== segments[next].chapterIndex)) showSection(chapters[segments[next].chapterIndex].target);
      if (chosen === "gd" && hasGdVoice) {
        const element = new Audio(recorded[next].src);
        audio.current = element;
        element.preload = "auto";
        startTimer.current = setTimeout(() => { if (token === generation.current) { cancel(); setStatus("error"); } }, 12000);
        element.onended = () => { if (token === generation.current) { cancelAnimationFrame(audioFrame.current); audio.current = null; speak(next + 1); } };
        element.onerror = () => { if (token === generation.current) { cancel(); setStatus("error"); } };
        element.play().then(() => { if (token === generation.current) { if (startTimer.current) clearTimeout(startTimer.current); setStatus("playing"); onSpeaking(true); trackAudio(element, next); } }).catch(() => { if (token === generation.current) { cancel(); setStatus("error"); } });
        return;
      }
      const line = new SpeechSynthesisUtterance(segments[next].text);
      utterance.current = line;
      if (voice) line.voice = voice;
      line.lang = voice?.lang ?? "en-GB";
      line.rate = .97; line.pitch = 1;
      line.onboundary = event => { if (token === generation.current && event.name === "word") setWordChar(event.charIndex); };
      startTimer.current = setTimeout(() => { if (token === generation.current) { cancel(); setStatus("error"); } }, 10000);
      line.onstart = () => { if (token === generation.current) { if (startTimer.current) clearTimeout(startTimer.current); setStatus("playing"); onSpeaking(true); } };
      line.onend = () => { if (token === generation.current) { if (startTimer.current) clearTimeout(startTimer.current); speak(next + 1); } };
      line.onerror = () => { if (token === generation.current) { cancel(); setStatus("error"); } };
      window.speechSynthesis.speak(line);
    }
    speak(from >= segments.length || status === "done" ? 0 : from);
  }
  function trackAudio(element: HTMLAudioElement, segment: number) {
    cancelAnimationFrame(audioFrame.current);
    const tick = () => {
      if (audio.current !== element || element.paused) return;
      const cue = recorded[segment].words.find(item => element.currentTime >= item.start && element.currentTime <= item.end);
      if (cue) setWordChar(cue.char);
      audioFrame.current = requestAnimationFrame(tick);
    };
    tick();
  }
  function chooseVoice(value: string) { setVoiceId(value); if (status === "playing" || status === "loading") play(current.current, value); }
  function showSection(target: string) {
    document.getElementById(target)?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  const female = voices.find(v => /female|samantha|karen|moira|tessa|susan|zira|aria|jenny|sonia|libby|hazel|ava|serena|salli|joanna/i.test(v.name));
  const male = voices.find(v => !/female/i.test(v.name) && /\bmale\b|daniel|david|mark|guy|ryan|george|alex\b|aaron|arthur|oliver|tom\b|fred\b/i.test(v.name));
  const active = status !== "idle";
  const chapter = chapters[segments[index].chapterIndex];
  const words = Array.from(segments[index].text.matchAll(/\S+\s*/g));
  const caption = <p ref={captionRoot} className="md-tour__caption md-tour__readalong">{words.map((match, i) => {
    const selected = wordChar >= match.index! && (i === words.length - 1 || wordChar < words[i + 1].index!);
    return <span key={`${index}:${i}`} className={selected ? "md-tour__word md-tour__word--current" : "md-tour__word"}>{selected && <svg className="md-tour__word-pet" viewBox="0 0 32 24" aria-hidden="true"><rect x="2" y="2" width="28" height="20" rx="8" fill="#c6ff00" stroke="#123e30"/><rect x="7" y="6" width="18" height="12" rx="5" fill="#123e30"/><circle cx="12" cy="11" r="1.5" fill="#fff"/><circle cx="20" cy="11" r="1.5" fill="#fff"/><path d="M13 15q3 3 6 0" fill="none" stroke="#fff"/></svg>}{match[0]}</span>;
  })}</p>;

  if (open && compact && active && status !== "error") return <aside className="md-tour md-tour--compact" aria-label="MoreDone narration controls">
    <div className="md-tour__mini-top"><strong>{status === "done" ? "Ready to build yours?" : chapter.title}</strong><button type="button" onClick={() => setCompact(false)} aria-label="Expand audio settings">⋯</button></div>
    {status !== "done" && caption}
    <div className="md-tour__controls">
      {status === "playing" || status === "loading" ? <button type="button" className="md-tour__primary" onClick={pause}>Pause audio</button> : status === "done" ? <button type="button" className="md-tour__primary" onClick={() => { close(); showSection("join"); }}>Join the challenge</button> : <button type="button" className="md-tour__primary" onClick={() => play()}>Resume audio</button>}
      <button type="button" onClick={close}>Stop</button>
    </div>
    <span className="md-tour__mini-status" role="status">{status === "paused" ? "Audio paused" : status === "loading" ? "Starting audio…" : status === "done" ? "Tour complete" : hasGdVoice && voiceId === "gd" ? "GD’s voice · AI narration" : "Device voice"}</span>
  </aside>;

  return <aside className="md-tour" hidden={!open} aria-label="MoreDone audio tour">
    <button type="button" className="md-tour__close" onClick={close} aria-label="Close audio tour">×</button>
    <span className="md-tour__eyebrow">YOUR MOREDONE COMPANION</span>
    <h2>{active ? status === "done" ? "Your idea could be next." : chapter.title : "Read it yourself, or let me talk you through it?"}</h2>
    {!active && <p>A short tour of what you can build and how to join.</p>}
    {supported || hasGdVoice ? <>
      <div className="md-tour__status" role="status">{status === "error" ? "Audio could not start. Try another voice, or read the tour below." : status === "paused" ? "Paused. Resume picks up at this sentence." : status === "loading" ? "Starting audio…" : status === "playing" ? "Reading aloud" : status === "done" ? "Tour complete" : "Audio starts only when you choose Listen."}</div>
      <div className="md-tour__controls">
        {status === "playing" || status === "loading" ? <button type="button" className="md-tour__primary" onClick={pause}>Pause audio</button> : <button type="button" className="md-tour__primary" onClick={() => play()}>{status === "paused" ? "Resume audio" : status === "done" ? "Listen again" : status === "error" ? "Try audio again" : "Listen to the tour"}</button>}
        {active ? <button type="button" onClick={stop}>Stop</button> : <button type="button" onClick={close}>I’ll read it</button>}
      </div>
      <details className="md-tour__transcript"><summary>Choose a male or female voice</summary>
        <div className="md-tour__voices" role="group" aria-label="Choose a voice">
          {hasGdVoice && <button type="button" aria-pressed={voiceId === "gd"} onClick={() => chooseVoice("gd")}>GD’s voice</button>}
          <button type="button" disabled={!female} aria-pressed={Boolean(female && voiceId === female.voiceURI)} onClick={() => female && chooseVoice(female.voiceURI)}>Female voice</button>
          <button type="button" disabled={!male} aria-pressed={Boolean(male && voiceId === male.voiceURI)} onClick={() => male && chooseVoice(male.voiceURI)}>Male voice</button>
        </div>
        <label className="md-tour__voice-label">Choose a voice<select value={voiceId} onChange={event => chooseVoice(event.target.value)}>{hasGdVoice && <option value="gd">GD’s voice · AI narration</option>}<option value="">Device default</option>{voices.map(voice => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>)}</select></label>
        {(!female || !male) && <small>Some voice options are unavailable on this device.</small>}
      </details>
      <label className="md-tour__follow"><input type="checkbox" defaultChecked={following.current} onChange={event => { following.current = event.target.checked; }} /> Follow the page as I listen</label>
      {active && status !== "done" && caption}
      {active && status !== "done" && <button type="button" className="md-tour__section" onClick={() => showSection(chapter.target)}>Show this section ↓</button>}
    </> : <p>Audio is unavailable in this browser. You can read the tour below.</p>}
    <details className="md-tour__transcript"><summary>Read the tour</summary>{chapters.map(item => <section key={item.title}><h3>{item.title}</h3>{item.lines.map(line => <p key={line}>{line}</p>)}</section>)}</details>
    <button type="button" className="md-tour__join" onClick={() => { close(); showSection("join"); }}>Join the challenge <span aria-hidden="true">↗</span></button>
  </aside>;
}
