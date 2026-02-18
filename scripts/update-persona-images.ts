#!/usr/bin/env tsx
/**
 * Script to add/update avatar images for existing personas
 * 
 * Usage:
 *   tsx scripts/update-persona-images.ts
 * 
 * This script allows you to update persona images without re-seeding everything.
 * Just modify the IMAGE_UPDATES array below with persona IDs and their image URLs.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Add your image URLs here
const IMAGE_UPDATES: Array<{
  personaId: string; // Use the persona slug (e.g., "raj-the-romantic")
  avatarUrl: string; // Full URL to the image
}> = [
  // Example entries (uncomment and modify):
  // {
  //   personaId: "raj-the-romantic",
  //   avatarUrl: "https://example.com/images/raj.jpg",
  // },
  // {
  //   personaId: "munna-bhai",
  //   avatarUrl: "https://example.com/images/munna.jpg",
  // },
  // {
  //   personaId: "geet-the-free-spirit",
  //   avatarUrl: "https://example.com/images/geet.jpg",
  // },
  // {
  //   personaId: "cricket-chacha",
  //   avatarUrl: "https://example.com/images/cricket-chacha.jpg",
  // },
  // {
  //   personaId: "captain-cool",
  //   avatarUrl: "https://example.com/images/captain-cool.jpg",
  // },
];

async function updatePersonaImages() {
  console.log("🖼️  Starting persona image updates...\n");

  if (IMAGE_UPDATES.length === 0) {
    console.log("⚠️  No image updates configured.");
    console.log("   Edit scripts/update-persona-images.ts and add entries to IMAGE_UPDATES array.\n");
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const { personaId, avatarUrl } of IMAGE_UPDATES) {
    try {
      // Check if persona exists
      const persona = await prisma.persona.findUnique({
        where: { id: personaId },
        select: { id: true, name: true, avatarUrl: true },
      });

      if (!persona) {
        console.log(`❌ Persona not found: ${personaId}`);
        errorCount++;
        continue;
      }

      // Update the avatar URL
      await prisma.persona.update({
        where: { id: personaId },
        data: { avatarUrl },
      });

      console.log(`✅ Updated ${persona.name} (${personaId})`);
      console.log(`   Old: ${persona.avatarUrl || "none"}`);
      console.log(`   New: ${avatarUrl}\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error updating ${personaId}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Update Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${IMAGE_UPDATES.length}`);
  console.log(`\n🎉 Image update complete!`);
}

async function listPersonas() {
  console.log("📋 Available Personas:\n");
  const personas = await prisma.persona.findMany({
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      category: true,
    },
    orderBy: { unlockLevel: "asc" },
  });

  personas.forEach((p) => {
    console.log(
      `   ${p.avatarUrl ? "🖼️ " : "⚪"} ${p.name} (ID: ${p.id}) - ${p.category}`
    );
  });
  console.log("");
}

async function main() {
  try {
    // First, show available personas
    await listPersonas();
    
    // Then update images
    await updatePersonaImages();
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
