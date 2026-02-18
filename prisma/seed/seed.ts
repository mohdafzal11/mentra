import { PrismaClient } from "@prisma/client";
import { PERSONA_SEEDS } from "../../src/lib/personas";
import { QUEST_SEEDS } from "../../src/lib/quests";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // Seed Personas
  console.log("👤 Seeding personas...");
  for (const persona of PERSONA_SEEDS) {
    const created = await prisma.persona.upsert({
      where: {
        id: persona.name.toLowerCase().replace(/\s+/g, "-"),
      },
      create: {
        id: persona.name.toLowerCase().replace(/\s+/g, "-"),
        name: persona.name,
        inspirationSource: persona.inspirationSource,
        philosophyPrompt: persona.philosophyPrompt,
        tone: persona.tone,
        unlockLevel: persona.unlockLevel,
        category: persona.category,
        teaserLine: persona.teaserLine,
        avatarUrl: persona.avatarUrl || null,
        depths: {
          create: persona.depths.map((depth) => ({
            depthLevel: depth.depthLevel,
            systemPrompt: depth.systemPrompt,
            description: depth.description,
            unlockLevel: depth.unlockLevel,
          })),
        },
      },
      update: {
        name: persona.name,
        inspirationSource: persona.inspirationSource,
        philosophyPrompt: persona.philosophyPrompt,
        tone: persona.tone,
        unlockLevel: persona.unlockLevel,
        category: persona.category,
        teaserLine: persona.teaserLine,
        avatarUrl: persona.avatarUrl || null,
      },
    });
    console.log(`  ✅ ${created.name} (Level ${created.unlockLevel})`);
  }

  // Seed Quests
  console.log("\n🎯 Seeding quests...");
  for (const quest of QUEST_SEEDS) {
    const created = await prisma.quest.upsert({
      where: {
        id: quest.title.toLowerCase().replace(/\s+/g, "-"),
      },
      create: {
        id: quest.title.toLowerCase().replace(/\s+/g, "-"),
        title: quest.title,
        description: quest.description,
        type: quest.type,
        xpReward: quest.xpReward,
        minLevel: quest.minLevel,
        prompt: quest.prompt,
      },
      update: {
        title: quest.title,
        description: quest.description,
        type: quest.type,
        xpReward: quest.xpReward,
        minLevel: quest.minLevel,
        prompt: quest.prompt,
      },
    });
    console.log(
      `  ✅ ${created.title} (${created.type}, +${created.xpReward} XP)`
    );
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
