#!/usr/bin/env tsx
/**
 * Script to seed personas into the database with optional image URLs
 * 
 * Usage:
 *   npm run db:seed              - Seeds all personas from personas.ts
 *   tsx scripts/seed-personas-with-images.ts  - Run this script directly
 */

import { PrismaClient } from "@prisma/client";
import { PERSONA_SEEDS } from "../src/lib/personas";

const prisma = new PrismaClient();

async function seedPersonas() {
  console.log("🌱 Starting persona seeding with image support...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const persona of PERSONA_SEEDS) {
    try {
      const personaId = persona.name.toLowerCase().replace(/\s+/g, "-");
      
      // Check if persona exists
      const existing = await prisma.persona.findUnique({
        where: { id: personaId },
      });

      if (existing) {
        console.log(`📝 Updating: ${persona.name}`);
      } else {
        console.log(`✨ Creating: ${persona.name}`);
      }

      const created = await prisma.persona.upsert({
        where: { id: personaId },
        create: {
          id: personaId,
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

      console.log(
        `   ✅ ${created.name} (Level ${created.unlockLevel}) ${
          created.avatarUrl ? "🖼️  with image" : ""
        }`
      );
      successCount++;
    } catch (error) {
      console.error(`   ❌ Error seeding ${persona.name}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Seeding Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${PERSONA_SEEDS.length}`);
  console.log(`\n🎉 Persona seeding complete!`);
}

async function main() {
  try {
    await seedPersonas();
  } catch (error) {
    console.error("❌ Fatal error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
