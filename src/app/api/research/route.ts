import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { ResearchReport, Source, VerifiedClaim, Contradiction, ResearchMode } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// Supabase client (server-side)
// ─────────────────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ─────────────────────────────────────────────────────────────────────────────
// Lyzr Agent Chat types
// ─────────────────────────────────────────────────────────────────────────────
const LYZR_CHAT_URL = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/';
const LYZR_USER_ID  = 'hackathon_user';

interface LyzrChatResponse {
  response?: string;
  message?:  string;
  content?:  string;
  output?:   string;
  [key: string]: unknown;
}

interface LyzrClaim {
  claim_text:          string;
  confidence?:         number;   // 0-1 or 0-100 — may be absent in Fast Mode
  contradiction_flag?: boolean;
  reason?:             string;
  source_url?:         string;
}

interface LyzrSynthesisOutput {
  topic?:              string;
  verdict?:            string;
  overall_confidence?: number;
  summary?:            string;
  claims?:             LyzrClaim[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Call one Lyzr agent and return its reply text. */
async function callAgent(agentId: string, message: string, apiKey: string): Promise<string> {
  const body = {
    user_id:    LYZR_USER_ID,
    agent_id:   agentId,
    session_id: randomUUID(),
    message,
  };

  const tryFetch = async (headers: Record<string, string>) =>
    fetch(LYZR_CHAT_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body:    JSON.stringify(body),
    });

  let res = await tryFetch({ 'x-api-key': apiKey });

  if (res.status === 401 || res.status === 403) {
    console.log(`[Lyzr] x-api-key rejected (${res.status}), retrying with Bearer…`);
    res = await tryFetch({ Authorization: `Bearer ${apiKey}` });
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Lyzr agent ${agentId} HTTP ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as LyzrChatResponse;
  const replyText = data.response ?? data.message ?? data.content ?? data.output ?? '';

  if (!replyText) {
    throw new Error(
      `Lyzr agent ${agentId} returned no reply text. Full response: ${JSON.stringify(data)}`,
    );
  }
  return replyText;
}

/** Strip markdown code fences and parse JSON. */
function parseAgentJson<T>(raw: string, stepLabel: string): T {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`${stepLabel}: could not parse agent reply as JSON.\nRaw: ${cleaned.slice(0, 500)}`);
  }
}

/** Extract domain from URL. */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url || 'unknown';
  }
}

/** Normalise confidence to 0-100 integer. */
function toPercent(value: number | undefined): number {
  if (value == null || isNaN(value)) return 70; // sensible fallback when agent omits it
  return Math.round(value <= 1 ? value * 100 : value);
}

/** Map percentage to badge. */
function badge(pct: number): 'High' | 'Medium' | 'Low' {
  if (pct > 80) return 'High';
  if (pct > 50) return 'Medium';
  return 'Low';
}

/**
 * Infer a human-readable source type from the domain string.
 * Rules (first match wins):
 *   wikipedia             → Encyclopedia
 *   .gov / .nic.in        → Government
 *   known news domains    → News
 *   blog / tutorial sites → Article
 *   default               → Reference
 */
const NEWS_DOMAINS = [
  'bbc', 'cnn', 'reuters', 'ndtv', 'theguardian', 'apnews',
  'bloomberg', 'forbes', 'aljazeera', 'nytimes', 'washingtonpost',
  'theverge', 'techcrunch', 'wired', 'thehindu', 'indiatoday',
  'timesofindia', 'businessinsider', 'abc', 'nbc', 'cbsnews',
  'ft.com', 'economist', 'huffpost', 'vox', 'axios', 'politico',
];

const ARTICLE_DOMAINS = [
  'medium', 'dev.to', 'geeksforgeeks', 'hashnode', 'substack',
  'towardsdatascience', 'hackernoon', 'freecodecamp', 'css-tricks',
  'smashingmagazine', 'sitepoint', 'digitalocean', 'baeldung',
];

function getSourceType(domain: string): Source['type'] {
  const d = domain.toLowerCase();
  if (d.includes('wikipedia')) return 'Encyclopedia';
  if (/\.gov(\.|$)/.test(d) || d.endsWith('.nic.in') || d.endsWith('.gov.in')) return 'Government';
  if (NEWS_DOMAINS.some((k) => d.includes(k))) return 'News';
  if (d.includes('news')) return 'News';
  if (ARTICLE_DOMAINS.some((k) => d.includes(k))) return 'Article';
  if (d.includes('blog')) return 'Article';
  return 'Reference';
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/research
// Body: { topic: string, mode?: ResearchMode, additionalContext?: string }
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 0. Validate env & input ──────────────────────────────────────────────
  const apiKey               = process.env.LYZR_API_KEY;
  const researchAgentId      = process.env.LYZR_RESEARCH_AGENT_ID;
  const verificationAgentId  = process.env.LYZR_VERIFICATION_AGENT_ID;
  const contradictionAgentId = process.env.LYZR_CONTRADICTION_AGENT_ID;
  const synthesisAgentId     = process.env.LYZR_SYNTHESIS_AGENT_ID;

  if (!apiKey || !researchAgentId || !verificationAgentId || !contradictionAgentId || !synthesisAgentId) {
    return NextResponse.json(
      { error: 'Server misconfiguration: one or more LYZR_* env vars are missing.' },
      { status: 500 },
    );
  }

  let topic: string;
  let mode: ResearchMode = 'Deep Research';
  let additionalContext  = '';

  try {
    const body       = await req.json();
    topic            = (body?.topic ?? '').trim();
    if (!topic) throw new Error('empty');
    mode             = body?.mode === 'Fast Mode' ? 'Fast Mode' : 'Deep Research';
    additionalContext = (body?.additionalContext ?? '').trim();
  } catch {
    return NextResponse.json(
      { error: 'Request body must be JSON with a non-empty "topic" string.' },
      { status: 400 },
    );
  }

  const isFastMode = mode === 'Fast Mode';

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`[/api/research] START  mode="${mode}"  topic="${topic}"`);
  if (additionalContext) console.log(`[/api/research] additionalContext length=${additionalContext.length}`);
  console.log(`${'─'.repeat(60)}`);

  // Build the Research Agent message — include uploaded/URL context if any
  const researchMessage = additionalContext
    ? `${topic}\n\nAdditional context from uploaded document/URL:\n${additionalContext}`
    : topic;

  // ── Step 1: Research Agent ────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let researchOutput: any;
  try {
    const researchRaw = await callAgent(researchAgentId, researchMessage, apiKey);
    researchOutput    = parseAgentJson(researchRaw, 'Step 1 (Research)');
    console.log('[Step 1 Research] ✅ preview:', JSON.stringify(researchOutput).slice(0, 300));
  } catch (err) {
    console.error('[Step 1 Research] ❌', err);
    return NextResponse.json({ error: `Step 1 (Research Agent) failed: ${String(err)}` }, { status: 502 });
  }

  // ── Early-exit guard ──────────────────────────────────────────────────────
  if (researchOutput?.error) {
    console.warn('[Step 1 Research] ⚠️  agent returned error field:', researchOutput.error);
    return NextResponse.json(
      { error: 'Topic samajh nahi aaya, kripya ek specific factual question poochein.' },
      { status: 422 },
    );
  }

  const researchClaims: unknown[] = Array.isArray(researchOutput?.claims)
    ? researchOutput.claims
    : [];

  if (researchClaims.length === 0) {
    console.warn('[Step 1 Research] ⚠️  0 claims. Output:', JSON.stringify(researchOutput).slice(0, 500));
    return NextResponse.json(
      { error: 'Topic samajh nahi aaya, kripya ek specific factual question poochein.' },
      { status: 422 },
    );
  }

  console.log(`[Step 1 Research] ✅ ${researchClaims.length} claim(s) — mode="${mode}"`);

  // ── Steps 2 & 3 — SKIPPED in Fast Mode ───────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pipelineOutput: any = researchOutput; // default: pass research → synthesis directly

  if (!isFastMode) {
    // ── Step 2: Verification Agent ──────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let verificationOutput: any;
    try {
      const verificationRaw = await callAgent(verificationAgentId, JSON.stringify(researchOutput), apiKey);
      verificationOutput    = parseAgentJson(verificationRaw, 'Step 2 (Verification)');
      console.log('[Step 2 Verification] ✅ preview:', JSON.stringify(verificationOutput).slice(0, 300));
    } catch (err) {
      console.error('[Step 2 Verification] ❌', err);
      return NextResponse.json({ error: `Step 2 (Verification Agent) failed: ${String(err)}` }, { status: 502 });
    }

    // ── Step 3: Contradiction Detector ─────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let contradictionOutput: any;
    try {
      const contradictionRaw = await callAgent(contradictionAgentId, JSON.stringify(verificationOutput), apiKey);
      contradictionOutput    = parseAgentJson(contradictionRaw, 'Step 3 (Contradiction)');
      console.log('[Step 3 Contradiction] ✅ preview:', JSON.stringify(contradictionOutput).slice(0, 300));
    } catch (err) {
      console.error('[Step 3 Contradiction] ❌', err);
      return NextResponse.json({ error: `Step 3 (Contradiction Detector) failed: ${String(err)}` }, { status: 502 });
    }

    pipelineOutput = contradictionOutput;
  } else {
    console.log('[/api/research] ⚡ Fast Mode — skipping Verification & Contradiction Detector');
  }

  // ── Step 4 (Deep) / Step 2 (Fast): Synthesis Agent ───────────────────────
  let synthesisOutput: LyzrSynthesisOutput;
  try {
    // Tell Synthesis Agent it may receive partial data in Fast Mode
    const synthesisMessage = isFastMode
      ? `${JSON.stringify(pipelineOutput)}\n\n[Fast Mode: confidence and contradiction_flag may be absent — use best estimates]`
      : JSON.stringify(pipelineOutput);

    const synthesisRaw = await callAgent(synthesisAgentId, synthesisMessage, apiKey);
    synthesisOutput    = parseAgentJson<LyzrSynthesisOutput>(synthesisRaw, 'Step 4 (Synthesis)');
    console.log('[Step 4 Synthesis] ✅ preview:', JSON.stringify(synthesisOutput).slice(0, 300));
  } catch (err) {
    console.error('[Step 4 Synthesis] ❌', err);
    return NextResponse.json({ error: `Step 4 (Synthesis Agent) failed: ${String(err)}` }, { status: 502 });
  }

  // ── Map synthesis output → ResearchReport ────────────────────────────────
  const now      = new Date();
  const reportId = `rep-${now.getTime()}`;

  const overallConfidence = toPercent(synthesisOutput.overall_confidence);

  const verifiedClaims: VerifiedClaim[] = (synthesisOutput.claims ?? []).map(
    (c: LyzrClaim, idx: number) => {
      const pct = toPercent(c.confidence);
      return {
        id:         `claim-${reportId}-${idx}`,
        text:       c.claim_text,
        confidence: pct,
        badge:      badge(pct),
        verified:   !(c.contradiction_flag ?? false),
        citation:   c.reason ?? '',
        sourceUrl:  c.source_url ?? '',
      };
    },
  );

  const contradictions: Contradiction[] = (synthesisOutput.claims ?? [])
    .filter((c: LyzrClaim) => c.contradiction_flag === true)
    .map((c: LyzrClaim, idx: number) => ({
      id:         `contra-${reportId}-${idx}`,
      claim:      c.claim_text,
      sourceA:    { name: extractDomain(c.source_url ?? ''), quote: c.claim_text },
      sourceB:    { name: 'Contradicting evidence',          quote: c.reason ?? '' },
      resolution: c.reason ?? '',
    }));

  // Build agents list depending on mode
  const agentsList = isFastMode
    ? [
        { name: 'Research Agent',  status: 'Completed' as const, timeTaken: '—', description: 'Mined primary sources' },
        { name: 'Synthesis Agent', status: 'Completed' as const, timeTaken: '—', description: 'Fast synthesis dossier' },
      ]
    : [
        { name: 'Research Agent',         status: 'Completed' as const, timeTaken: '—', description: 'Mined primary sources' },
        { name: 'Verification Agent',     status: 'Completed' as const, timeTaken: '—', description: 'Validated all claims' },
        { name: 'Contradiction Detector', status: 'Completed' as const, timeTaken: '—', description: 'Audited source conflicts' },
        { name: 'Synthesis Agent',        status: 'Completed' as const, timeTaken: '—', description: 'Final fact-check dossier' },
      ];

  const report: ResearchReport = {
    id:                reportId,
    query:             topic,
    date:              now.toISOString().split('T')[0],
    time:              now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    confidence:        overallConfidence,
    status:            'Completed',
    mode,
    verificationLevel: isFastMode ? 'Basic' : 'Expert',
    summary:           synthesisOutput.summary ?? '',
    detailedAnalysis:  synthesisOutput.summary ?? '',
    verifiedClaims,
    contradictions,
    sources: (() => {
      const seen = new Set<string>();
      return verifiedClaims
        .filter((vc) => {
          if (!vc.sourceUrl) return false;
          if (seen.has(vc.sourceUrl)) return false;
          seen.add(vc.sourceUrl);
          return true;
        })
        .map((vc, idx) => {
          const domain = extractDomain(vc.sourceUrl);
          return {
            id:          `src-${reportId}-${idx}`,
            title:       vc.citation || domain,
            domain,
            reliability: vc.confidence,
            date:        now.toISOString().split('T')[0],
            url:         vc.sourceUrl,
            // Type inferred dynamically from domain — not hardcoded
            type:        getSourceType(domain),
          };
        });
    })(),
    saved: false,
    tags:  ['Lyzr Agent', 'Fact Verified', mode, synthesisOutput.verdict ?? ''],
    agents: agentsList,
  };

  // ── Save to Supabase ──────────────────────────────────────────────────────
  const { error: sbErr } = await supabase.from('reports').insert({
    organisation: 'Innovahack',
    topic,
    report_json:  report,
    status:       'completed',
  });

  if (sbErr) {
    console.error('[/api/research] Supabase insert error:', sbErr.message);
  } else {
    console.log('[/api/research] Supabase ✅ report saved');
  }

  console.log(`[/api/research] DONE  reportId=${reportId}  mode=${mode}  confidence=${overallConfidence}%`);
  console.log(`${'─'.repeat(60)}\n`);

  return NextResponse.json(report);
}
