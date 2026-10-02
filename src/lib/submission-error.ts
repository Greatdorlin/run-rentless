import { NextResponse } from "next/server";

export function submissionReference() {
  return crypto.randomUUID().slice(0, 8).toUpperCase();
}

export function logSubmissionIssue(flow: "webinar" | "audit", stage: string, reference: string, reason: unknown) {
  console.error("Submission issue", {
    flow,
    stage,
    reference,
    reason: reason instanceof Error ? reason.message : typeof reason === "number" ? `HTTP ${reason}` : "Unknown error",
  });
}

export function submissionError(message: string, status: number, reference: string) {
  return NextResponse.json({ ok: false, message, reference }, { status });
}
