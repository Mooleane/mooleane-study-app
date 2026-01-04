import { NextResponse } from "next/server";

export const runtime = "nodejs";

function buildPrompt({ taskName, taskDate, priority, contextText, contextFileName }) {
  const safeName = String(taskName ?? "").trim();
  const safeDate = String(taskDate ?? "").trim();
  const safePriority = String(priority ?? "").trim();
  const safeContext = String(contextText ?? "").trim();
  const safeContextFileName = String(contextFileName ?? "").trim();
  const contextBlock = safeContext ? safeContext.slice(0, 8000) : "";
  const contextLabel = safeContextFileName
    ? `Context from attached file (${safeContextFileName}):`
    : "Context from attached file:";

  return [
    "You are a helpful study-planning assistant.",
    "Return ONLY valid JSON in this exact shape:",
    '{"steps":["Step 1 (30m)","Step 2 (20m)"]}',
    "Rules:",
    "- 4 to 6 steps",
    "- Each step short and actionable",
    "- Include an estimated time in minutes in parentheses like (30m)",
    "- Do not include any extra keys or text",
    "Task:",
    safeName ? `- Name: ${safeName}` : "- Name: (not provided)",
    safeDate ? `- Due/Date: ${safeDate}` : "- Due/Date: (not provided)",
    safePriority ? `- Priority: ${safePriority}` : "- Priority: (not provided)",
    contextBlock ? contextLabel : "",
    contextBlock ? contextBlock : "",
  ].join("\n");
}

function tryParseSteps(content) {
  try {
    const parsed = JSON.parse(content);
    if (parsed && Array.isArray(parsed.steps)) {
      return parsed.steps.filter((s) => typeof s === "string" && s.trim());
    }
  } catch {
    // ignore
  }

  // Fallback: try to pull out bullet/numbered lines
  const lines = String(content ?? "")
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-*\d.)\s]+/, "").trim())
    .filter(Boolean);

  return lines.slice(0, 6);
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { taskName, taskDate, priority, contextText, contextFileName } = body ?? {};

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 220,
        messages: [
          { role: "system", content: "You are a concise planning assistant." },
          {
            role: "user",
            content: buildPrompt({ taskName, taskDate, priority, contextText, contextFileName }),
          },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const details = (await openaiRes.text()).slice(0, 500);
      return NextResponse.json(
        { error: "OpenAI request failed", details },
        { status: openaiRes.status }
      );
    }

    const data = await openaiRes.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    const steps = tryParseSteps(content);

    return NextResponse.json({ steps });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
