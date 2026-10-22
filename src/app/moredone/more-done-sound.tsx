"use client";

import { useEffect, useRef, useState } from "react";

const chords = [
  [130.81, 155.56, 196, 261.63],
  [103.83, 155.56, 207.65, 261.63],
  [155.56, 196, 233.08, 311.13],
  [116.54, 174.61, 233.08, 293.66],
];

function note(context: AudioContext, output: AudioNode, frequency: number, length: number, volume: number, wave: OscillatorType) {
  const sound = context.createOscillator();
  const envelope = context.createGain();
  const now = context.currentTime;
  sound.type = wave;
  sound.frequency.value = frequency;
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(volume, now + 0.06);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + length);
  sound.connect(envelope).connect(output);
  sound.start(now);
  sound.stop(now + length + 0.02);
}

export function MoreDoneSound() {
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const contextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    if (contextRef.current) void contextRef.current.close();
  }, []);

  function toggle() {
    if (contextRef.current) {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      timerRef.current = null;
      void contextRef.current.close();
      contextRef.current = null;
      setPlaying(false);
      return;
    }
    try {
      const context = new AudioContext();
      const output = context.createGain();
      output.gain.value = 0.6;
      output.connect(context.destination);
      contextRef.current = context;
      let step = 0;
      const playStep = () => {
        const chord = chords[Math.floor(step / 8) % chords.length];
        note(context, output, chord[step % chord.length] * 2, 1.5, 0.022, "triangle");
        if (step % 8 === 0) note(context, output, chord[0], 4.1, 0.018, "sine");
        step += 1;
      };
      void context.resume();
      playStep();
      timerRef.current = window.setInterval(playStep, 580);
      setPlaying(true);
    } catch {
      setAvailable(false);
      setPlaying(false);
    }
  }

  if (!available) return null;
  return <button className="md-sound" type="button" aria-pressed={playing} onClick={toggle}>
    <span className="md-sound__bars" aria-hidden="true"><i /><i /><i /><i /></span>
    {playing ? "Sound on · tap to mute" : "Play the page sound"}
  </button>;
}
