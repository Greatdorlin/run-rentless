"use client";

import { useEffect, useState } from "react";
import chapters from "./tour-script.json";

export const narrationEvent = "moredone:read-word";
const passages = chapters.flatMap(chapter => chapter.lines);

export function NarratedCopy({ segment, as: Tag = "p", className }: { segment: number; as?: "p" | "span" | "h1" | "h2"; className?: string }) {
  const [character, setCharacter] = useState(-1);
  const text = passages[segment];
  useEffect(() => {
    const follow = (event: Event) => {
      const value = (event as CustomEvent<{ segment?: unknown; char?: unknown }>).detail;
      if (!value || !Number.isInteger(value.segment) || typeof value.char !== "number") return;
      setCharacter(value.segment === segment ? value.char : -1);
    };
    window.addEventListener(narrationEvent, follow);
    return () => window.removeEventListener(narrationEvent, follow);
  }, [segment]);
  const words = Array.from(text.matchAll(/\S+\s*/g));
  return <Tag id={chapters[segment].target} className={className} data-md-narration={segment} data-reading={character >= 0 ? "true" : undefined}>
    {words.map((word, i) => <span key={i} className={character >= word.index! && (i === words.length - 1 || character < words[i + 1].index!) ? "md-page-word md-page-word--current" : "md-page-word"}>{word[0]}</span>)}
  </Tag>;
}
