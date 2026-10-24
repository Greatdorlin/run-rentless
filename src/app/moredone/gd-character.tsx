import { useId } from "react";

export function GdCharacter({ talking = false }: { talking?: boolean }) {
  const skinId = useId();
  const jacketId = useId();
  return <svg className={"md-gd" + (talking ? " md-gd--talking" : "")} viewBox="0 0 100 122" aria-hidden="true">
    <defs><linearGradient id={skinId} x2=".8" y2="1"><stop stopColor="#a66b49"/><stop offset="1" stopColor="#6b3726"/></linearGradient><linearGradient id={jacketId} x2="1" y2="1"><stop stopColor="#273d54"/><stop offset="1" stopColor="#102236"/></linearGradient></defs>
    <path d="M7 122v-11q0-24 29-28h28q29 4 29 28v11" fill={"url(#" + jacketId + ")"} stroke="#36536a"/>
    <path d="m36 82 14 10 14-10-3 40H39Z" fill="#111c27"/>
    <path d="M39 80v11q11 9 22 0V80" fill="#77422d"/>
    <path d="m32 86 12 36-20-25 7-2-5-6Zm36 0-12 36 20-25-7-2 5-6Z" fill="#3c5266"/>
    <ellipse cx="22" cy="56" rx="7" ry="11" fill="#8d5238"/><ellipse cx="78" cy="56" rx="7" ry="11" fill="#75402d"/>
    <path d="M23 37q0-25 27-25t27 25v25q-1 26-27 29Q25 88 23 62Z" fill={"url(#" + skinId + ")"}/>
    <path d="M23 48q-10-16-2-28Q30 2 50 5q23-2 31 18 5 14-4 25l-2-19q-13-3-18-9-13 12-31 11Z" fill="#11191d"/>
    <g fill="#1b2327"><circle cx="25" cy="22" r="7"/><circle cx="33" cy="14" r="8"/><circle cx="43" cy="11" r="8"/><circle cx="55" cy="11" r="9"/><circle cx="67" cy="15" r="8"/><circle cx="75" cy="25" r="7"/></g>
    <path d="M30 45q8-5 15-1m10 0q8-5 15 1" fill="none" stroke="#38271e" strokeWidth="3" strokeLinecap="round"/>
    <g className="md-gd__eyes"><path d="M29 52q8-7 16 0-8 6-16 0m26 0q8-7 16 0-8 6-16 0" fill="#fff5e9"/><ellipse cx="38" cy="52" rx="3" ry="4" fill="#20251f"/><ellipse cx="63" cy="52" rx="3" ry="4" fill="#20251f"/><circle cx="39" cy="51" r="1" fill="#fff"/><circle cx="64" cy="51" r="1" fill="#fff"/></g>
    <path d="m50 51-4 11q4 4 8 0" fill="none" stroke="#663824" strokeWidth="2" strokeLinecap="round"/>
    <g className="md-gd__mouth"><path d="M34 70q16 10 32 0-3 15-16 15T34 70Z" fill="#542a22"/><path d="M35 71q15 5 30 0l-3 6q-12 4-24 0Z" fill="#fff9ed"/><path d="M43 82q7-4 14 0" fill="none" stroke="#c87c70" strokeWidth="2"/></g>
    <path d="M29 63q3 3 6 0m30 0q3 3 6 0" fill="none" stroke="#b57650" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="50" cy="106" r="2" fill="#9db0b9"/>
  </svg>;
}
