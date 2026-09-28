import chunk0 from "@/lib/webinar-featured/chunk-0";
import chunk1 from "@/lib/webinar-featured/chunk-1";
import chunk2 from "@/lib/webinar-featured/chunk-2";
import chunk3 from "@/lib/webinar-featured/chunk-3";

export const dynamic = "force-static";

export function GET() {
  const image = Buffer.from(chunk0 + chunk1 + chunk2 + chunk3, "base64");

  return new Response(image, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
