import { NextResponse } from "next/server";

export function submissionReference() {
  return crypto.randomUUID().slice(0, 8).toUpperCase();
}

export function logSubmissionIssue(flow: "webinar" | "audit", stage: string, reference: string, reason: unknown) {
  console.error("Submission issue", {
    flow,
    stage,
    reference,
    // Provider errors can contain submitted values. Keep logs useful without
    // recording names, email addresses, phone numbers or report answers.
    reason: reason instanceof Error ? reason.name : typeof reason === "number" ? `HTTP ${reason}` : "Unknown error",
  });
}

export function submissionError(message: string, status: number, reference: string) {
  return NextResponse.json({ ok: false, message, reference }, { status });
}
