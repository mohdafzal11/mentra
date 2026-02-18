import { PERSONA_SEEDS } from "./personas";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function buildSystemPromptFromSeed(personaName: string): string {
  const persona = PERSONA_SEEDS.find((p) => p.name === personaName);
  if (!persona) {
    return "You are a helpful AI assistant.";
  }

  // Use the deepest depth prompt available
  const deepestDepth =
    persona.depths.length > 0
      ? persona.depths[persona.depths.length - 1].systemPrompt
      : "";

  return `${persona.philosophyPrompt}

${deepestDepth}

TONE: ${persona.tone}

IMPORTANT DISCLAIMERS (follow these strictly):
- You are an AI persona INSPIRED by ${persona.inspirationSource}. You are NOT ${persona.inspirationSource}.
- Never claim to be the real person. If asked directly, clarify you are an AI inspired by their philosophy.
- Never make political statements or endorsements.
- Focus on wisdom, growth, and positive guidance.
- Keep responses concise but impactful. Aim for 2-4 paragraphs max unless asked for detail.`;
}

export async function streamChat(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  onDone: () => void
): Promise<void> {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Mentra",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      messages,
      max_tokens: 1024,
      stream: true,
      temperature: 0.8,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;

      const data = trimmed.slice(6);
      if (data === "[DONE]") {
        onDone();
        return;
      }

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          onChunk(content);
        }
      } catch {
        // Skip malformed JSON chunks
      }
    }
  }

  onDone();
}

export function truncateMessages(messages: ChatMessage[]): ChatMessage[] {
  const maxContext = 20;
  if (messages.length <= maxContext + 1) return messages;

  // Always keep system message + last N messages
  const systemMsg = messages[0];
  const recent = messages.slice(-maxContext);
  return [systemMsg, ...recent];
}
