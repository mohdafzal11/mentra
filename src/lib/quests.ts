export interface QuestSeed {
  title: string;
  description: string;
  type: string;
  xpReward: number;
  minLevel: number;
  prompt: string;
}

export const QUEST_SEEDS: QuestSeed[] = [
  {
    title: "Morning Reflection",
    description:
      "Start your day with intention. Share what you want to achieve today and why it matters.",
    type: "reflection",
    xpReward: 50,
    minLevel: 1,
    prompt:
      "Good morning! Before the day takes over, let's set an intention. What's the ONE thing you want to accomplish today? Not just a task — what would make today feel meaningful?",
  },
  {
    title: "The Crossroads",
    description:
      "Facing a tough decision? Let's think through it together using wisdom and clarity.",
    type: "decision",
    xpReward: 100,
    minLevel: 2,
    prompt:
      "You're at a crossroads. Tell me about a decision you're currently wrestling with. Don't worry about having all the details — just share what's on your mind, and let's untangle it together.",
  },
  {
    title: "Confidence Builder",
    description:
      "Build unshakeable self-belief by recognizing your wins and reframing your fears.",
    type: "confidence",
    xpReward: 75,
    minLevel: 1,
    prompt:
      "Let's build your confidence muscle today. Tell me about a recent moment where you surprised yourself — where you did something you didn't think you could. No win is too small.",
  },
  {
    title: "Evening Gratitude",
    description:
      "End your day by reflecting on three things you're grateful for. Rewire your brain for positivity.",
    type: "daily",
    xpReward: 40,
    minLevel: 1,
    prompt:
      "As the day winds down, let's practice gratitude. Share three things from today that made you feel good — big or small. A good cup of chai counts!",
  },
  {
    title: "Fear Facing",
    description:
      "Name your biggest current fear. Understanding it is the first step to overcoming it.",
    type: "confidence",
    xpReward: 120,
    minLevel: 3,
    prompt:
      "Today we're going to be brave. What's one fear that's been quietly holding you back? It could be about career, relationships, health, or self-worth. Let's look at it together — no judgment.",
  },
  {
    title: "Career Compass",
    description:
      "Feeling lost in your career? Let's recalibrate your direction with purpose-driven thinking.",
    type: "decision",
    xpReward: 100,
    minLevel: 4,
    prompt:
      "Let's talk about your career path. If money and societal expectations weren't factors, what would you be doing right now? Don't filter — let your truest answer come through.",
  },
  {
    title: "The Mentor Letter",
    description:
      "Write a letter to your younger self. What wisdom would you share?",
    type: "reflection",
    xpReward: 150,
    minLevel: 5,
    prompt:
      "Imagine your younger self — maybe 5 years ago — sitting across from you. They're struggling with something you've since overcome. What would you tell them? Write them a short letter.",
  },
  {
    title: "Night Reflection",
    description:
      "Review your day with honest eyes. What worked? What would you do differently?",
    type: "daily",
    xpReward: 45,
    minLevel: 1,
    prompt:
      "Before you sleep, let's do a quick review. How did today go? Rate it 1-10 and tell me why. No judgment — just honest reflection.",
  },
];
