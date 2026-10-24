"use client";

import { useEffect, useRef, useState } from "react";

const preferenceKey = "moredone:tour-choice";
const chapters = [
  { title: "What you can build", target: "projects", lines: [
    "Welcome to MoreDone. Have a tool in mind that would make your day easier? Bring that idea to the seven-day AI Business Challenge.",
    "You could build a booking app for your salon, a stock tracker for your shop, or a website where customers can order from you.",
    "You can join for your own idea, your job, or a client. You do not need coding experience.",
  ] },
  { title: "How we help you", target: "md-days-title", lines: [
    "You choose one project, and we help you build a working first version. We agree on its main job, then test that it works.",
    "Your place includes two live ninety-minute workshops, daily exercises, starter templates, group guidance and a final review with us.",
    "You will learn to make your tool look like your brand, work on a phone, and handle customer details with care.",
  ] },
  { title: "Put your skills to work", target: "md-ads-title", lines: [
    "Think about the work you could take off your plate, or the service you could offer a client once you know how to build it.",
    "The challenge also includes a ChatGPT Ads lesson. We help you prepare an offer and a campaign, and track whether enquiries become customers. Running ads depends on access in your country.",
  ] },
  { title: "Choose your place", target: "team-offer", lines: [
    "You can join on your own or bring colleagues and save on each place. Choose your package on this page to see the total in your selected currency.",
    "We guide you through setting up what you need. Your AI subscription, any hosting and any ads you run are paid separately from the challenge fee.",
    "Bring the idea you would love to see working. Choose your place, add your details, and follow the payment steps to join us.",
  ] },
];
const segments = chapters.flatMap((chapter, chapterIndex) => chapter.lines.map(text => ({ text, chapterIndex })));
type Status = "idle" | "loading" | "playing" | "paused" | "done" | "error";

export function CompanionTour({ open, onOpen, onClose, onSpeaking }: { open: boolean; onOpen: () => void; onClose: () => void; onSpeaking: (value: boolean) => void }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceId, setVoiceId] = useState("");
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [index, setIndex] = useState(0);
  const current = useRef(0);
  const generation = useRef(0);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancel() {
    generation.current++;
    if (startTimer.current) clearTimeout(startTimer.current);
    if (utterance.current) window.speechSynthesis?.cancel();
    utterance.current = null;
    onSpeaking(false);
  }
  function pause() { cancel(); setStatus("paused"); }
  function stop() { cancel(); current.current = 0; setIndex(0); setStatus("idle"); }
  function remember() { try { sessionStorage.setItem(preferenceKey, "chosen"); } catch { /* Optional preference. */ } }
  function close() { stop(); remember(); onClose(); }

  useEffect(() => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      queueMicrotask(() => setSupported(false));
      return;
    }
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices().filter(voice => /^en(?:-|_)/i.test(voice.lang)).sort((a, b) => Number(/natural|premium|enhanced/i.test(b.name)) - Number(/natural|premium|enhanced/i.test(a.name))));
    load();
    synth.addEventListener("voiceschanged", load);
    const hidden = () => { if (document.hidden && utterance.current) pause(); };
    document.addEventListener("visibilitychange", hidden);
    const timer = setTimeout(() => {
      try { if (sessionStorage.getItem(preferenceKey) || sessionStorage.getItem("moredone:companion-hidden")) return; } catch { /* Optional preference. */ }
      const form = document.getElementById("join")?.getBoundingClientRect();
      if (!document.hidden && !(form && form.top < innerHeight && form.bottom > 0) && !document.activeElement?.matches("input,textarea,select")) onOpen();
    }, 8000);
    return () => { clearTimeout(timer); cancel(); synth.removeEventListener("voiceschanged", load); document.removeEventListener("visibilitychange", hidden); };
    // Event handlers use refs; the invitation is scheduled once per visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) { if (utterance.current) stop(); return; }
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function play(from = current.current, chosen = voiceId) {
    if (!supported) return;
    cancel(); remember();
    const token = generation.current;
    const voice = voices.find(item => item.voiceURI === chosen) ?? voices.find(item => item.default) ?? voices[0];
    function speak(next: number) {
      if (token !== generation.current) return;
      if (next >= segments.length) { utterance.current = null; onSpeaking(false); setStatus("done"); return; }
      current.current = next; setIndex(next); setStatus("loading");
      const line = new SpeechSynthesisUtterance(segments[next].text);
      utterance.current = line;
      if (voice) line.voice = voice;
      line.lang = voice?.lang ?? "en-GB";
      line.rate = .97; line.pitch = 1;
      startTimer.current = setTimeout(() => { if (token === generation.current) { cancel(); setStatus("error"); } }, 10000);
      line.onstart = () => { if (token === generation.current) { if (startTimer.current) clearTimeout(startTimer.current); setStatus("playing"); onSpeaking(true); } };
      line.onend = () => { if (token === generation.current) { if (startTimer.current) clearTimeout(startTimer.current); speak(next + 1); } };
      line.onerror = () => { if (token === generation.current) { cancel(); setStatus("error"); } };
      window.speechSynthesis.speak(line);
    }
    speak(from >= segments.length || status === "done" ? 0 : from);
  }
  function chooseVoice(value: string) { setVoiceId(value); if (status === "playing" || status === "loading") play(current.current, value); }
  function showSection(target: string) {
    document.getElementById(target)?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  const female = voices.find(v => /female|samantha|karen|moira|tessa|susan|zira|aria|jenny|sonia|libby|hazel|ava|serena|salli|joanna/i.test(v.name));
  const male = voices.find(v => !/female/i.test(v.name) && /\bmale\b|daniel|david|mark|guy|ryan|george|alex\b|aaron|arthur|oliver|tom\b|fred\b/i.test(v.name));
  const active = status !== "idle";
  const chapter = chapters[segments[index].chapterIndex];

  return <aside className="md-tour" hidden={!open} aria-label="MoreDone audio tour">
    <button type="button" className="md-tour__close" onClick={close} aria-label="Close audio tour">×</button>
    <span className="md-tour__eyebrow">YOUR MOREDONE COMPANION</span>
    <h2>{active ? status === "done" ? "Your idea could be next." : chapter.title : "Read it yourself, or let me talk you through it?"}</h2>
    {!active && <p>A short tour of what you can build and how to join.</p>}
    {supported ? <>
      <div className="md-tour__voices" role="group" aria-label="Choose a voice">
        <button type="button" disabled={!female} aria-pressed={Boolean(female && voiceId === female.voiceURI)} onClick={() => female && chooseVoice(female.voiceURI)}>Female voice</button>
        <button type="button" disabled={!male} aria-pressed={Boolean(male && voiceId === male.voiceURI)} onClick={() => male && chooseVoice(male.voiceURI)}>Male voice</button>
      </div>
      <label className="md-tour__voice-label">Voice on this device<select value={voiceId} onChange={event => chooseVoice(event.target.value)}><option value="">Device default</option>{voices.map(voice => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>)}</select></label>
      {(!female || !male) && <small>Some voice options are unavailable on this device.</small>}
      <div className="md-tour__status" role="status">{status === "error" ? "Audio could not start. Try another voice, or read the tour below." : status === "paused" ? "Paused. Resume picks up at this sentence." : status === "loading" ? "Starting audio…" : status === "playing" ? "Reading aloud" : status === "done" ? "Tour complete" : "Audio starts only when you choose Listen."}</div>
      {active && status !== "done" && <p className="md-tour__caption">{segments[index].text}</p>}
      <div className="md-tour__controls">
        {status === "playing" || status === "loading" ? <button type="button" className="md-tour__primary" onClick={pause}>Pause audio</button> : <button type="button" className="md-tour__primary" onClick={() => play()}>{status === "paused" ? "Resume audio" : status === "done" ? "Listen again" : status === "error" ? "Try audio again" : "Listen to the tour"}</button>}
        {active ? <button type="button" onClick={stop}>Stop</button> : <button type="button" onClick={close}>I’ll read it</button>}
      </div>
      {active && status !== "done" && <button type="button" className="md-tour__section" onClick={() => showSection(chapter.target)}>Show this section ↓</button>}
    </> : <p>Audio is unavailable in this browser. You can read the tour below.</p>}
    <details className="md-tour__transcript"><summary>Read the tour</summary>{chapters.map(item => <section key={item.title}><h3>{item.title}</h3>{item.lines.map(line => <p key={line}>{line}</p>)}</section>)}</details>
    <button type="button" className="md-tour__join" onClick={() => { close(); showSection("join"); }}>Join the challenge <span aria-hidden="true">↗</span></button>
  </aside>;
}
