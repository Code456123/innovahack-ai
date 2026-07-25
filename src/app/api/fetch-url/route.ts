import { NextRequest, NextResponse } from 'next/server';

// Maximum plain-text characters to return (avoid overwhelming agent context)
const MAX_CHARS = 3000;

// ─────────────────────────────────────────────────────────────────────────────
// Minimal HTML → plain-text stripper (no external dep needed)
// ─────────────────────────────────────────────────────────────────────────────
function htmlToText(html: string): string {
  return html
    // Remove <script> and <style> blocks entirely
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    // Replace block-level tags with newlines for readability
    .replace(/<\/?(p|div|h[1-6]|li|br|tr|section|article|header|footer|nav|aside)[^>]*>/gi, '\n')
    // Strip remaining HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Decode common HTML entities
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&nbsp;/g, ' ')
    // Collapse runs of whitespace / blank lines
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/fetch-url
// Body: { url: string }
// Returns: { text: string }
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  let url: string;
  try {
    const body = await req.json();
    url        = (body?.url ?? '').trim();
    if (!url) throw new Error('empty');
    new URL(url); // throws if not a valid URL
  } catch {
    return NextResponse.json({ error: 'Request body must contain a valid "url" string.' }, { status: 400 });
  }

  console.log(`[/api/fetch-url] fetching: ${url}`);

  try {
    const res = await fetch(url, {
      headers: {
        // Pretend to be a browser so sites don't block the request
        'User-Agent': 'Mozilla/5.0 (compatible; VeriGen-Bot/1.0)',
        'Accept':     'text/html,application/xhtml+xml',
      },
      // 10-second timeout
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Could not fetch URL — server responded with ${res.status}` },
        { status: 502 },
      );
    }

    const contentType = res.headers.get('content-type') ?? '';
    const rawBody     = await res.text();

    const text = contentType.includes('text/html')
      ? htmlToText(rawBody)
      : rawBody.slice(0, MAX_CHARS); // plain text / JSON — use as-is

    const trimmed = text.slice(0, MAX_CHARS);

    console.log(`[/api/fetch-url] ✅ extracted ${trimmed.length} chars from ${url}`);

    return NextResponse.json({ text: trimmed });
  } catch (err) {
    console.error('[/api/fetch-url] ❌', err);
    return NextResponse.json(
      { error: `Failed to fetch URL: ${String(err)}` },
      { status: 500 },
    );
  }
}
