export type PagePart = { tag: string; text: string };
type LocatedPart = { element: HTMLElement; text: string; offset: number };
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
const opened = new Set<HTMLDetailsElement>();
let outlined: HTMLElement | null = null;

export function locatePassage(parts: PagePart[]): LocatedPart[] | null {
  let offset = 0;
  const result: LocatedPart[] = [];
  for (const part of parts) {
    if (!["h1", "h2", "h3", "p", "span", "summary"].includes(part.tag)) return null;
    const match = Array.from(document.querySelectorAll<HTMLElement>(`.md-page ${part.tag}`)).find(element =>
      !element.closest("form,.md-tour,.md-companion,.md-voice-dock") && normalize(element.textContent || "") === part.text);
    if (!match) return null;
    result.push({ element: match, text: part.text, offset });
    offset += part.text.length + 1;
  }
  return result;
}

export function revealPassage(parts: LocatedPart[], scroll: boolean) {
  for (const { element } of parts) {
    let parent: HTMLElement | null = element.parentElement;
    while (parent) {
      if (parent instanceof HTMLDetailsElement && !parent.open) { parent.open = true; opened.add(parent); }
      parent = parent.parentElement;
    }
  }
  if (scroll) parts[0]?.element.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}

type HighlightRegistry = { set: (name: string, value: unknown) => void; delete: (name: string) => void };
function registry() { return (CSS as typeof CSS & { highlights?: HighlightRegistry }).highlights; }

export function clearReading(restoreDetails = false) {
  registry()?.delete("moredone-reading");
  outlined?.classList.remove("md-reading-paragraph");
  outlined = null;
  if (restoreDetails) { for (const detail of opened) detail.open = false; opened.clear(); }
}

export function highlightWord(parts: LocatedPart[], character: number) {
  const part = [...parts].reverse().find(item => character >= item.offset) || parts[0];
  if (!part) return;
  const local = Math.max(0, character - part.offset);
  const end = part.text.indexOf(" ", local);
  const wordEnd = end < 0 ? part.text.length : end;
  const walker = document.createTreeWalker(part.element, NodeFilter.SHOW_TEXT);
  const nodes: Array<{ node: Text; start: number; end: number }> = [];
  let raw = "";
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    nodes.push({ node, start: raw.length, end: raw.length + node.length });
    raw += node.data;
  }
  const map: number[] = [];
  let normalized = "";
  for (let i = 0; i < raw.length; i++) {
    if (/\s/.test(raw[i])) {
      if (normalized && !normalized.endsWith(" ")) { normalized += " "; map.push(i); }
    } else { normalized += raw[i]; map.push(i); }
  }
  const first = map[local];
  const last = map[Math.min(wordEnd - 1, map.length - 1)];
  const startNode = nodes.find(node => first >= node.start && first < node.end);
  const endNode = nodes.find(node => last >= node.start && last < node.end);
  clearReading();
  const Highlight = (window as unknown as { Highlight?: new (...ranges: Range[]) => unknown }).Highlight;
  if (!Highlight || !registry() || !startNode || !endNode) {
    outlined = part.element;
    outlined.classList.add("md-reading-paragraph");
    return;
  }
  const range = document.createRange();
  range.setStart(startNode.node, first - startNode.start);
  range.setEnd(endNode.node, last - endNode.start + 1);
  registry()!.set("moredone-reading", new Highlight(range));
}
