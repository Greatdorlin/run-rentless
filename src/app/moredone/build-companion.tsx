"use client";

import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import { CompanionTour } from "./companion-tour";
import { GdCharacter } from "./gd-character";

type Point = { x: number; y: number };
type Sample = Point & { time: number };
const storageKey = "moredone:companion-hidden";

export function BuildCompanion() {
  const root = useRef<HTMLDivElement>(null);
  const position = useRef<Point>({ x: 0, y: 0 });
  const velocity = useRef<Point>({ x: 0, y: 0 });
  const frame = useRef(0);
  const pointer = useRef<{ id: number; offset: Point; start: Point; samples: Sample[]; moved: boolean } | null>(null);
  const reduced = useRef(false);
  const blocked = useRef(false);
  const [visible, setVisible] = useState(false);
  const [atForm, setAtForm] = useState(false);
  const [typing, setTyping] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  function bounds() {
    return { left: 32, right: Math.max(32, window.innerWidth - 120), top: 145, bottom: Math.max(145, window.innerHeight - 185) };
  }
  function clamp(point: Point) {
    const box = bounds();
    return { x: Math.max(box.left, Math.min(box.right, point.x)), y: Math.max(box.top, Math.min(box.bottom, point.y)) };
  }
  function paint(point: Point) {
    position.current = point;
    if (root.current) root.current.style.transform = `translate3d(clamp(32px,${point.x}px,calc(100vw - 120px)),clamp(12px,${point.y}px,calc(100dvh - 185px - env(safe-area-inset-bottom))),0)`;
  }
  function settle(target: Point, initialVelocity: Point = { x: 0, y: 0 }) {
    cancelAnimationFrame(frame.current);
    const end = clamp(target);
    if (reduced.current) { paint(end); return; }
    velocity.current = initialVelocity;
    let previous = performance.now();
    function tick(now: number) {
      const dt = Math.min(.032, Math.max(.001, (now - previous) / 1000));
      previous = now;
      const current = position.current;
      const v = velocity.current;
      // Near-critical spring: stiffness 200, damping 28, mass 1.
      v.x += ((end.x - current.x) * 200 - v.x * 28) * dt;
      v.y += ((end.y - current.y) * 200 - v.y * 28) * dt;
      paint({ x: current.x + v.x * dt, y: current.y + v.y * dt });
      if (Math.hypot(end.x - position.current.x, end.y - position.current.y) < .35 && Math.hypot(v.x, v.y) < 3) { paint(end); return; }
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    try { if (sessionStorage.getItem(storageKey)) return; } catch { /* The companion also works without browser storage. */ }
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const box = bounds();
    paint({ x: box.right, y: box.bottom - 20 });
    queueMicrotask(() => setVisible(true));
    const join = document.getElementById("join");
    const observer = new IntersectionObserver(([entry]) => setAtForm(entry.isIntersecting), { rootMargin: "80px 0px", threshold: 0 });
    if (join) observer.observe(join);
    const onFocus = (event: FocusEvent) => setTyping(event.target instanceof Element && event.target.matches("input,textarea,select"));
    const onResize = () => { cancelAnimationFrame(frame.current); paint(clamp(position.current)); };
    const onMotion = (event: MediaQueryListEvent) => { reduced.current = event.matches; if (event.matches) cancelAnimationFrame(frame.current); };
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    motion.addEventListener("change", onMotion);
    document.addEventListener("focusin", onFocus);
    window.addEventListener("resize", onResize);
    const wander = window.setInterval(() => {
      if (root.current?.hidden || reduced.current || blocked.current || document.hidden || pointer.current || window.innerWidth < 900) return;
      const current = position.current;
      const box = bounds();
      const destination = current.x > window.innerWidth / 2 ? box.right - 48 : box.left + 48;
      settle({ x: Math.abs(current.x - destination) < 8 ? (current.x > window.innerWidth / 2 ? box.right : box.left) : destination, y: current.y });
    }, 18000);
    return () => {
      cancelAnimationFrame(frame.current); window.clearInterval(wander); observer.disconnect();
      document.removeEventListener("focusin", onFocus); window.removeEventListener("resize", onResize); motion.removeEventListener("change", onMotion);
    };
    // These helpers use refs so pointer motion never rerenders the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { blocked.current = atForm || typing || tourOpen; }, [atForm, typing, tourOpen]);

  function down(event: PointerEvent<HTMLButtonElement>) {
    if (pointer.current || (event.pointerType === "mouse" && event.button !== 0)) return;
    cancelAnimationFrame(frame.current);
    const current = position.current;
    pointer.current = { id: event.pointerId, offset: { x: event.clientX - current.x, y: event.clientY - current.y }, start: { x: event.clientX, y: event.clientY }, samples: [{ ...current, time: event.timeStamp }], moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent<HTMLButtonElement>) {
    const drag = pointer.current;
    if (!drag || drag.id !== event.pointerId) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.start.x, event.clientY - drag.start.y) < 8) return;
    drag.moved = true;
    const raw = { x: event.clientX - drag.offset.x, y: event.clientY - drag.offset.y };
    const legal = clamp(raw);
    const resist = (over: number) => (over * 100 * .55) / (100 + .55 * Math.abs(over));
    const next = { x: legal.x + resist(raw.x - legal.x), y: legal.y + resist(raw.y - legal.y) };
    paint(next);
    drag.samples.push({ ...next, time: event.timeStamp });
    drag.samples = drag.samples.filter(sample => event.timeStamp - sample.time <= 100);
  }
  function release(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    const drag = pointer.current;
    if (!drag || drag.id !== event.pointerId) return;
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const first = drag.samples[0];
    const last = drag.samples[drag.samples.length - 1];
    const seconds = Math.max(.016, (event.timeStamp - first.time) / 1000);
    const v = cancelled ? { x: 0, y: 0 } : { x: (last.x - first.x) / seconds, y: (last.y - first.y) / seconds };
    const current = position.current;
    settle({ x: current.x + v.x * .12, y: current.y + v.y * .12 }, v);
    if (!cancelled && !drag.moved) openIdea();
  }
  function openIdea() {
    setTourOpen(true);
  }
  function joinChallenge() {
    setTourOpen(false);
    document.getElementById("join")?.scrollIntoView({ block: "start", behavior: reduced.current ? "instant" : "smooth" });
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, Point> = { ArrowLeft: { x: -32, y: 0 }, ArrowRight: { x: 32, y: 0 }, ArrowUp: { x: 0, y: -32 }, ArrowDown: { x: 0, y: 32 } };
    if (moves[event.key]) { event.preventDefault(); settle({ x: position.current.x + moves[event.key].x, y: position.current.y + moves[event.key].y }); }
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openIdea(); }
    if (event.key === "Escape") dismiss();
  }
  function dismiss() {
    cancelAnimationFrame(frame.current); setVisible(false); setTourOpen(false);
    try { sessionStorage.setItem(storageKey, "1"); } catch { /* Dismissal still applies to this page. */ }
  }

  return <><CompanionTour open={tourOpen} onOpen={() => setTourOpen(true)} onClose={() => setTourOpen(false)} onSpeaking={setSpeaking} /><div ref={root} className={`md-companion${visible && !atForm && !typing ? " md-companion--visible" : ""}${speaking ? " md-companion--speaking" : ""}`} hidden={!visible} inert={!visible || atForm || typing || speaking}>
    <button className="md-companion__dismiss" type="button" aria-label="Hide companion" onClick={dismiss}>×</button>
    <button className="md-companion__sign" type="button" onClick={joinChallenge}>Join the<br />challenge <span aria-hidden="true">↗</span></button>
    <button className="md-companion__body" type="button" aria-label="Open audio tour. Use arrow keys to move companion." title="Drag to move. Click for an audio tour." onPointerDown={down} onPointerMove={move} onPointerUp={event => release(event)} onPointerCancel={event => release(event, true)} onLostPointerCapture={event => { if (pointer.current) release(event, true); }} onKeyDown={keyboard} tabIndex={atForm || typing ? -1 : 0}>
      <GdCharacter />
    </button><span className="md-companion__hint">{speaking ? "Talking you through it" : "Read or listen"}</span>
  </div></>;
}

export function ListenToTourButton() {
  return <button type="button" className="md-listen-link" onClick={() => window.dispatchEvent(new Event("moredone:tour"))}>Listen to the tour <span aria-hidden="true">◖))</span></button>;
}
