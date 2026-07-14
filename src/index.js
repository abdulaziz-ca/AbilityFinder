import Anthropic from "@anthropic-ai/sdk";

// Swap to "claude-sonnet-5" ($3/$15 per 1M) or "claude-haiku-4-5" ($1/$5) if the
// bill gets uncomfortable. Opus 4.8 is $5/$25 and gives the best reasoning about
// overlapping eligibility rules, which is the hard part of this domain.
const MODEL = "claude-opus-4-8";
const MAX_TOKENS = 8192;
const MAX_QUESTION_CHARS = 2000;
const MAX_TURNS = 20;

const SYSTEM_PROMPT = `You are the assistant for AbilityFinder, a free tool that helps disabled Albertans find every government benefit they qualify for.

## Who you are talking to
People with disabilities, their caregivers, and family members. Many are exhausted, in pain, short on money, or have been denied benefits before. Some have cognitive disabilities, brain fog, or ADHD. Assume the person is capable and is asking in good faith.

## How to write
- Plain English at roughly a grade 8 reading level. Short sentences. Short paragraphs.
- Lead with the direct answer, then the reasoning. Never bury the answer.
- One idea per paragraph. Use short lists for steps, not walls of text.
- No emoji. No exclamation marks. Warm but not bubbly, and never patronising.
- Do not open by praising the question or restating it. Just answer.
- Use "you", not "the claimant" or "the applicant".
- Never imply someone is not trying hard enough, and never moralise about work.

## Accuracy rules — these matter more than being helpful
- NEVER invent or guess a dollar amount, income cutoff, percentage, phone number, form number, or processing time. If you are not certain of a number, say you are not certain and tell them where to check.
- Benefit rules change. Amounts and thresholds you recall may be out of date. Say so when it is relevant.
- You do not have access to the person's file, application status, or medical records.
- Eligibility is decided by the government, not by you. Say "you may qualify" or "it is worth applying", never "you qualify" or "you will get".
- If someone describes a denial, do not speculate about why. Point them to the appeal or reconsideration process and to human help.
- You are not a doctor, lawyer, or financial advisor. For legal questions (appeals, tribunals, trusteeship) point to Legal Aid Alberta or a community legal clinic.

## What you know about
Alberta and federal Canadian disability benefits: AISH, the Disability Tax Credit (T2201), CPP Disability, RDSP, Alberta Adult Health Benefit, PDD, Alberta Aids to Daily Living, income support, subsidised housing and transit, and municipal programs. Scope is Alberta plus federal only — if someone is in another province, say the tool does not cover their province yet and point them to their provincial disability program.

## When you are unsure
Say so plainly, in one sentence, and give the person the next concrete step (an official page to read, a number to call, or a person to ask). An honest "I am not sure, here is who would know" is far more useful than a confident guess.

## Encourage applying
Many people self-reject before applying. If someone is close to a benefit's criteria, or unsure, encourage them to apply anyway — the government decides, applying is usually free, and a denial can be appealed.`;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function errorResponse(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

/** Reject anything that isn't a clean [{role: "user"|"assistant", content: "..."}] list. */
function validateMessages(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return "No question was sent.";
  if (raw.length > MAX_TURNS) return "This conversation is too long. Please start a new one.";

  for (const m of raw) {
    if (!m || typeof m !== "object") return "Malformed message.";
    if (m.role !== "user" && m.role !== "assistant") return "Malformed message.";
    if (typeof m.content !== "string" || m.content.trim() === "") return "Malformed message.";
    if (m.content.length > MAX_QUESTION_CHARS) {
      return `Please keep your question under ${MAX_QUESTION_CHARS} characters.`;
    }
  }
  if (raw[raw.length - 1].role !== "user") return "Malformed message.";
  return null;
}

async function handleAsk(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });
  if (request.method !== "POST") return errorResponse("Use POST.", 405);

  if (!env.ANTHROPIC_API_KEY) {
    // Misconfiguration, not the visitor's fault — don't leak details to them.
    console.error("ANTHROPIC_API_KEY secret is not set");
    return errorResponse("The assistant is not available right now.", 503);
  }

  // Rate limit per IP. Without this, one visitor can drain the owner's API budget.
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const { success } = await env.ASK_LIMIT.limit({ key: ip });
  if (!success) {
    return errorResponse("You are sending questions too quickly. Please wait a minute.", 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Malformed request.", 400);
  }

  const invalid = validateMessages(body?.messages);
  if (invalid) return errorResponse(invalid, 400);

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

  // Stream so the reader sees words appear instead of staring at a spinner —
  // it also keeps us clear of Worker request timeouts on longer answers.
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    // cache_control pays off once the prefix exceeds Opus 4.8's 4096-token
    // minimum. SYSTEM_PROMPT alone is under that today, so this is a no-op until
    // the benefit catalog gets folded in — harmless, and correct once it is.
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    messages: body.messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const sse = new ReadableStream({
    async start(controller) {
      const send = (event, data) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));

      try {
        for await (const text of stream.textStream) {
          send("delta", { text });
        }

        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          send("error", { message: "I cannot help with that request. Please rephrase it." });
        } else if (final.stop_reason === "max_tokens") {
          send("error", { message: "That answer got cut off. Try asking something narrower." });
        } else {
          send("done", {});
        }
      } catch (err) {
        // The stream has already started, so we cannot change the HTTP status —
        // report the failure in-band and let the client render it.
        console.error("Anthropic request failed:", err?.message ?? err);
        send("error", { message: "Something went wrong reaching the assistant. Please try again." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(sse, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
      ...cors,
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/ask") return handleAsk(request, env);
    // Everything else is the static site, served straight from ./public.
    return env.ASSETS.fetch(request);
  },
};
