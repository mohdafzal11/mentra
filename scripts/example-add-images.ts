#!/usr/bin/env tsx
/**
 * EXAMPLE: How to add images to personas
 * 
 * This is a template showing how to add avatar images to your personas.
 * Copy this file and modify it with your actual image URLs.
 * 
 * Steps:
 * 1. Upload your persona images to a CDN (Cloudflare, AWS S3, Supabase Storage, etc.)
 * 2. Copy this file: cp scripts/example-add-images.ts scripts/add-my-images.ts
 * 3. Edit scripts/add-my-images.ts with your real image URLs
 * 4. Run: tsx scripts/add-my-images.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// EXAMPLE IMAGE UPDATES
// Replace these URLs with your actual image URLs
const EXAMPLE_UPDATES = [
  // Bollywood Personas
  {
    personaId: "raj-the-romantic",
    avatarUrl: "https://your-cdn.com/personas/raj-romantic.jpg",
    description: "Charming Bollywood hero inspired avatar",
  },
  {
    personaId: "munna-bhai",
    avatarUrl: "https://your-cdn.com/personas/munna-bhai.jpg",
    description: "Tapori with heart of gold",
  },
  {
    personaId: "geet-the-free-spirit",
    avatarUrl: "https://your-cdn.com/personas/geet.jpg",
    description: "Free-spirited Bollywood heroine",
  },
  
  // Cricket Personas
  {
    personaId: "cricket-chacha",
    avatarUrl: "https://your-cdn.com/personas/cricket-chacha.jpg",
    description: "Wise cricket-loving uncle",
  },
  {
    personaId: "captain-cool",
    avatarUrl: "https://your-cdn.com/personas/captain-cool.jpg",
    description: "Cool, composed cricket captain",
  },
  
  // Social Media Personas
  {
    personaId: "reels-rani",
    avatarUrl: "https://your-cdn.com/personas/reels-rani.jpg",
    description: "Gen-Z social media queen",
  },
];

async function addImages() {
  console.log("🖼️  Example: Adding images to personas\n");
  console.log("⚠️  This is an EXAMPLE file with placeholder URLs\n");

  for (const { personaId, avatarUrl, description } of EXAMPLE_UPDATES) {
    try {
      const persona = await prisma.persona.findUnique({
        where: { id: personaId },
        select: { name: true },
      });

      if (!persona) {
        console.log(`❌ Persona not found: ${personaId}`);
        continue;
      }

      await prisma.persona.update({
        where: { id: personaId },
        data: { avatarUrl },
      });

      console.log(`✅ ${persona.name}`);
      console.log(`   ${description}`);
      console.log(`   ${avatarUrl}\n`);
    } catch (error) {
      console.error(`❌ Error updating ${personaId}:`, error);
    }
  }

  console.log("\n✨ Done! Check your database.");
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  📝 EXAMPLE SCRIPT - DO NOT USE AS-IS");
  console.log("═══════════════════════════════════════════════════════\n");
  console.log("This script shows HOW to add images, but uses fake URLs.");
  console.log("\nTo use this for real:");
  console.log("1. Upload your images to a CDN");
  console.log("2. Copy this file: cp scripts/example-add-images.ts scripts/add-my-images.ts");
  console.log("3. Edit add-my-images.ts with your real image URLs");
  console.log("4. Run: tsx scripts/add-my-images.ts\n");
  
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Run example anyway? (yes/no): ", async (answer: string) => {
    if (answer.toLowerCase() === "yes") {
      await addImages();
    } else {
      console.log("\n👍 Good choice! Set up your real images first.");
    }
    rl.close();
    await prisma.$disconnect();
  });
}

main();
