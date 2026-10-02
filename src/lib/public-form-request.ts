type FormResult =
  | { body: Record<string, unknown>; status?: never }
  | { body?: never; status: 400 | 403 | 413; message: string };

export async function readPublicForm(request: Request, maxBytes: number): Promise<FormResult> {
  const origin = request.headers.get("origin");
  const site = request.headers.get("sec-fetch-site");
  if ((origin && origin !== new URL(request.url).origin) || site === "cross-site") {
    return { status: 403, message: "This submission could not be verified." };
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return { status: 400, message: "Please check your details and try again." };
  }
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { status: 413, message: "This submission is too large. Please shorten it and try again." };
  }

  const reader = request.body?.getReader();
  if (!reader) return { status: 400, message: "Please check your details and try again." };
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        void reader.cancel().catch(() => {});
        return { status: 413, message: "This submission is too large. Please shorten it and try again." };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const body: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return { status: 400, message: "Please check your details and try again." };
    }
    return { body: body as Record<string, unknown> };
  } catch {
    return { status: 400, message: "Please check your details and try again." };
  }
}
