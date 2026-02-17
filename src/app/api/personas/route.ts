import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const personas = await prisma.persona.findMany({
      where: { isActive: true },
      include: {
        userUnlocks: {
          where: { userId: user.id },
          select: { id: true },
        },
        depths: {
          select: { depthLevel: true, description: true, unlockLevel: true },
          orderBy: { depthLevel: "asc" },
        },
      },
      orderBy: { unlockLevel: "asc" },
    });

    const personasWithStatus = personas.map((persona) => ({
      id: persona.id,
      name: persona.name,
      inspirationSource: persona.inspirationSource,
      tone: persona.tone,
      avatarUrl: persona.avatarUrl,
      unlockLevel: persona.unlockLevel,
      category: persona.category,
      teaserLine: persona.teaserLine,
      isUnlocked:
        persona.unlockLevel <= user.level || persona.userUnlocks.length > 0,
      depths: persona.depths,
    }));

    return NextResponse.json({ personas: personasWithStatus });
  } catch (error) {
    console.error("Fetch personas error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
