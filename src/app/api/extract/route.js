import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function extractPdfText(buffer, { maxPages = 30, maxChars = 200000 } = {}) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const pageCount = Math.min(pdf.numPages || 0, maxPages);
  let out = "";

  for (let pageNum = 1; pageNum <= pageCount; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = Array.isArray(content?.items)
      ? content.items
          .map((item) => (typeof item?.str === "string" ? item.str : ""))
          .filter(Boolean)
      : [];

    if (strings.length) {
      out += `${strings.join(" ")}\n`;
      if (out.length >= maxChars) break;
    }
  }

  return out;
}

function clampText(text, maxChars) {
  const s = String(text ?? "");
  if (s.length <= maxChars) return s;
  return s.slice(0, maxChars);
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const fileName = typeof file.name === "string" ? file.name : "";
    const type = typeof file.type === "string" ? file.type : "";

    const buf = Buffer.from(await file.arrayBuffer());

    let text = "";

    // TXT
    if (type === "text/plain" || fileName.toLowerCase().endsWith(".txt")) {
      text = buf.toString("utf8");
    }

    // PDF
    if (!text && (type === "application/pdf" || fileName.toLowerCase().endsWith(".pdf"))) {
      text = await extractPdfText(buf);
    }

    text = text.replace(/\r\n/g, "\n").trim();

    if (!text) {
      return NextResponse.json(
        { error: "Could not extract text from this file." },
        { status: 400 }
      );
    }

    // Keep responses reasonably small.
    const clamped = clampText(text, 12000);

    return NextResponse.json({
      fileName,
      text: clamped,
      charCount: clamped.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
