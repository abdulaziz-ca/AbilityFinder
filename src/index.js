// AbilityFinder Worker.
//
// Serves POST /api/ask (the Phase 4 assistant) and passes everything else to
// the static site in ./public.
//
// COST: this uses Workers AI, which on the Workers FREE plan has a 10,000
// Neuron/day allocation and NO overage price -- once it is spent, requests fail
// with an error until 00:00 UTC. There is no API key and no paid provider, so
// this endpoint cannot generate a bill. If the account is ever moved to Workers
// Paid, usage above 10,000 Neurons/day starts costing $0.011/1,000 Neurons --
// re-read this comment before upgrading.

import { BENEFITS_CONTEXT } from "./benefits-context.js";

// Llama 4 Scout: 131k context, current (the llama-3.1 builds are past their
// 2026-05-30 deprecation). Roughly 60 Neurons per question, so the free
// allocation is very roughly 150 questions/day.
const MODEL = "@cf/meta/llama-4-scout-17b-16e-instruct";
const MAX_TOKENS = 1024;
const MAX_QUESTION_CHARS = 2000;
const MAX_TURNS = 20;

// This model is far weaker than a frontier model at following "do not guess"
// under pressure, and the audience is disabled people making decisions about
// money. So the prompt does not ask it to reason about eligibility at all --
// it explains, points, and hands off to the verified data already in the app.
//
// GROUNDING: ungrounded, this model invented Alberta benefit facts (it called
// AISH "Alberta Income Support for the Homeless"). BENEFITS_CONTEXT is the
// verified catalog generated from data.js; the rules below make it the only
// permitted source for what a program is. Do not remove it.
const SYSTEM_PROMPT = `You are the assistant for AbilityFinder, a free tool that helps disabled Albertans find government benefits.

## THE BENEFIT LIST — YOUR ONLY SOURCE OF TRUTH
These are the only benefits AbilityFinder covers. This list is correct and was checked by a human. Your own memory of Canadian or Alberta benefit programs is NOT reliable and must not be used.

${BENEFITS_CONTEXT}

RULES FOR THAT LIST — these override everything else:
- When you name or describe a program, use the name and the description EXACTLY as written above. Do not reword the name. Do not expand an acronym yourself — the expansion is already in the list.
- If someone asks what a program is, answer using only its line above.
- If a program is NOT on that list, say: "That one isn't in AbilityFinder, so I can't describe it." Then suggest they check the official government page. Do NOT describe it from memory.
- If you are about to state a fact about a program that is not written above, stop and say you are not sure, and point them to that benefit's guide page in AbilityFinder.

YOUR JOB IS NARROW. You do these things:
1. Explain confusing government words and phrases in plain English.
2. Explain what a form or a step is asking for, and why.
3. Point people to the right benefit guide inside AbilityFinder, or to the official government page.
4. Explain the general shape of a process (how to apply, how to appeal, who signs what).

YOU MUST NEVER DO THESE THINGS. This is the most important part of your instructions:
- NEVER state a dollar amount, income cutoff, asset limit, percentage, age limit, or processing time. Not even an approximate one. Not even if you think you know it. Say "AbilityFinder shows the current amount on the guide page for that benefit, and the official page is the final word."
- NEVER tell someone they qualify or do not qualify. Only the government decides. Say "it is worth applying" or "you may qualify".
- NEVER invent a form number, phone number, office name, or web address. If you are not certain, say so and tell them to check the benefit guide.
- NEVER guess. If you do not know, say "I am not sure about that one" and point them to the guide or to human help.

If a question needs a number or an eligibility decision, do not answer it from memory. Say that the guide page has the checked, current number, and encourage them to open it.

HOW TO WRITE:
- Plain English, around a grade 8 reading level. Short sentences. Short paragraphs.
- Answer first, then explain. Never bury the answer.
- No emoji. No exclamation marks. Warm and calm, never patronising.
- Say "you", not "the claimant" or "the applicant".
- Do not praise the question or restate it. Just answer.
- Keep it under about 200 words unless they ask for more.

TONE AND CARE:
- Many people using this are tired, in pain, or have been denied before. Never suggest someone is not trying hard enough.
- You are not a doctor, lawyer, or financial advisor. For appeals and legal questions, point to Legal Aid Alberta or a community legal clinic.
- Many people give up before applying. If someone is unsure, encourage them to apply anyway: the government decides, applying is usually free, and a denial can be appealed.
- Scope is Alberta and federal Canada only. For another province, say AbilityFinder does not cover it yet.`;

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

/**
 * Workers AI streams its own SSE (`data: {"response":"..."}` ... `data: [DONE]`).
 * Re-emit it as our own delta/done/error events so the client contract stays
 * stable if the model or provider is ever swapped.
 */
function toClientStream(aiStream) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream({
    async start(controller) {
      const send = (event, data) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));

      try {
        for await (const chunk of aiStream) {
          buffer += decoder.decode(chunk, { stream: true });

          // Keep the trailing partial line in the buffer for the next chunk.
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;

            const payload = trimmed.slice(5).trim();
            if (payload === "" || payload === "[DONE]") continue;

            try {
              const parsed = JSON.parse(payload);
              const t = parsed.response;
              // Workers AI streams numeric tokens as JSON numbers, not strings
              // ("T2201" arrives as "T", 220, 1). A truthy check would silently
              // swallow a literal 0 token, so test for null/undefined and
              // normalise to a string for the client.
              if (t !== undefined && t !== null && t !== "") {
                send("delta", { text: String(t) });
              }
            } catch {
              // A malformed chunk shouldn't kill an otherwise good answer.
            }
          }
        }
        send("done", {});
      } catch (err) {
        // Headers are already sent, so the status can't change -- report in-band.
        const msg = String(err?.message ?? err);
        console.error("Workers AI request failed:", msg);

        // The daily free allocation running out is expected, not a bug. Say so
        // plainly rather than showing a generic error.
        const outOfCapacity = /capacity|limit|quota|429|3040/i.test(msg);
        send("error", {
          message: outOfCapacity
            ? "The assistant has reached its free daily limit. It resets overnight. The benefit guides all still work."
            : "Something went wrong reaching the assistant. Please try again.",
        });
      } finally {
        controller.close();
      }
    },
  });
}

async function handleAsk(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });
  if (request.method !== "POST") return errorResponse("Use POST.", 405);

  if (!env.AI) {
    console.error("AI binding missing");
    return errorResponse("The assistant is not available right now.", 503);
  }

  // Rate limit per IP. Guards the shared daily allocation from a single visitor.
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

  let aiStream;
  try {
    aiStream = await env.AI.run(MODEL, {
      stream: true,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...body.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });
  } catch (err) {
    // Failed before streaming started, so we can still return a real status.
    console.error("Workers AI call failed:", err?.message ?? err);
    return errorResponse("The assistant is busy right now. Please try again shortly.", 503);
  }

  return new Response(toClientStream(aiStream), {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
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
