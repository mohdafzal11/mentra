import { getMaxDepthForLevel } from "./gamification";
import { prisma } from "./prisma";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

// Token limits scale with user level
function getMaxTokensForLevel(level: number): number {
  if (level >= 20) return 2048;
  if (level >= 10) return 1536;
  if (level >= 5) return 1024;
  return 512;
}

// Context window scales with user level
function getContextMessagesForLevel(level: number): number {
  if (level >= 20) return 30;
  if (level >= 10) return 20;
  if (level >= 5) return 15;
  return 8;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function buildSystemPrompt(
  personaId: string,
  userLevel: number,
  userName: string,
  userIntent: string | null
): Promise<string> {
  const persona = await prisma.persona.findUniqueOrThrow({
    where: { id: personaId },
    include: {
      depths: {
        orderBy: { depthLevel: "asc" },
      },
    },
  });

  const maxDepth = getMaxDepthForLevel(userLevel);

  // Get the deepest available prompt for the user's level
  const applicableDepths = persona.depths.filter(
    (d) => d.depthLevel <= maxDepth && d.unlockLevel <= userLevel
  );

  const depthPrompt =
    applicableDepths.length > 0
      ? applicableDepths[applicableDepths.length - 1].systemPrompt
      : "";

  const levelContext =
    userLevel >= 15
      ? "The user is deeply committed. Be profoundly honest, share inner wisdom, challenge them."
      : userLevel >= 5
        ? "The user is growing. Offer deeper insights while maintaining warmth."
        : "The user is new. Be welcoming, encouraging, and gently guide them.";

  const culturalContext = `You are conversing with an Indian user named ${userName}.
Be culturally aware - reference Indian contexts, examples, festivals, daily life when relevant.
Use occasional Hindi/Hinglish phrases naturally where they add warmth (like "beta", "bhai", "yaar").
Keep advice practical and relevant to Indian life and values.`;

  return `${persona.philosophyPrompt}

${depthPrompt}

TONE: ${persona.tone}

${levelContext}

${culturalContext}

${userIntent ? `The user's growth intent is: ${userIntent}. Tailor advice accordingly.` : ""}

IMPORTANT DISCLAIMERS (follow these strictly):
- You are an AI persona INSPIRED by ${persona.inspirationSource}. You are NOT ${persona.inspirationSource}.
- Never claim to be the real person. If asked directly, clarify you are an AI inspired by their philosophy.
- Never make political statements or endorsements.
- Focus on wisdom, growth, and positive guidance.
- Keep responses concise but impactful. Aim for 2-4 paragraphs max unless asked for detail.`;
}

export async function streamChat(
  messages: ChatMessage[],
  userLevel: number,
  onChunk: (chunk: string) => void,
  onDone: () => void
): Promise<void> {
  const maxTokens = getMaxTokensForLevel(userLevel);

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "MimChat",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      messages,
      max_tokens: maxTokens,
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

export function truncateMessages(
  messages: ChatMessage[],
  userLevel: number
): ChatMessage[] {
  const maxContext = getContextMessagesForLevel(userLevel);
  if (messages.length <= maxContext + 1) return messages;

  // Always keep system message + last N messages
  const systemMsg = messages[0];
  const recent = messages.slice(-(maxContext));
  return [systemMsg, ...recent];
}
