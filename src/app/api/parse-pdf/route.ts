// Force Node.js runtime — Edge runtime lacks Buffer & fs APIs needed by PDF parsers
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/parse-pdf
// Accepts: multipart/form-data with field "file" (PDF)
// Returns: { text: string }  (first ~8000 chars of extracted text)
//
// Uses "unpdf" instead of "pdf-parse" because unpdf does NOT depend on
// pdfjs-dist's DOMMatrix/browser APIs — works cleanly in Node.js server env.
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file     = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`[/api/parse-pdf] received file size=${buffer.byteLength} bytes`);

    // extractText accepts a Uint8Array
    const { text, totalPages } = await extractText(new Uint8Array(buffer), { mergePages: true });

    // text may be string[] when mergePages:false — with mergePages:true it's a single string
    const combined = Array.isArray(text) ? text.join('\n') : (text ?? '');
    const trimmed  = combined.trim();

    console.log(`[/api/parse-pdf] ✅ extracted ${trimmed.length} chars across ${totalPages} pages`);

    // Return first 8000 chars to stay within agent context windows
    return NextResponse.json({ text: trimmed.slice(0, 8000) });
  } catch (err) {
    console.error('[/api/parse-pdf] ❌', err);
    return NextResponse.json(
      { error: `PDF parsing failed: ${String(err)}` },
      { status: 500 },
    );
  }
}
