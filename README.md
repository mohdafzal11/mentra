# Mentra — Grow Through Conversations

A production-ready, gamified conversational web app where users chat with AI-inspired personas based on Indian philosophies. This is a progression-driven, habit-forming experience designed to feel like mentorship, not just messaging.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Storage | Client-side (localStorage) |
| LLM | OpenRouter (model-agnostic) |
| Rendering | Server Components + Server Actions |

## UX Psychology & Gamification Design

### Core Loop: The Mentra Habit Engine

```
Trigger (notification/streak) -> Action (chat) -> Variable Reward (XP + insight)
                                      ^                     |
                                      +-- Investment (streak, level) --+
```

This follows Nir Eyal's Hook Model adapted for healthy habits:

### 1. XP-Centric Design (Operant Conditioning)

Every interaction rewards the user with visible XP. This uses **variable ratio reinforcement** — the most addictive schedule:
- Message sent: +10 XP (consistent)
- First daily message: +50 XP (daily trigger)
- Streak bonus: +15 x streak days (escalating reward)
- Quest completion: +100 XP (achievement)

**Non-linear level curve**: `XP = 50 x (level - 1)^1.8`

This means early levels feel fast (instant gratification), while later levels require sustained engagement. This prevents "honeymoon fatigue" — the pattern where users quit after initial excitement fades.

### 2. Persona Depth Layers (Progressive Disclosure)

Personas don't just unlock — they deepen:
- **Level 1-4**: Surface wisdom (encouraging, safe)
- **Level 5-14**: Deeper insights (challenging, honest)
- **Level 15+**: Inner circle (vulnerable, transformative)

This is inspired by **therapeutic alliance research**: trust must be built before confronting deeper truths. Users earn the right to deeper conversations through consistent engagement.

### 3. Streak System (Loss Aversion)

Humans fear losing progress 2x more than gaining new progress (Kahneman's Prospect Theory). Our streak system leverages this:
- Visual streak counter with fire animations
- Escalating streak bonuses (multiplicative)
- **Gentle reset** — no guilt messaging, just encouragement to restart

### 4. Quest Framing (Goal-Gradient Effect)

Conversations are framed as "quests" instead of "chats" because:
- Clear objectives create purpose
- Progress toward completion accelerates engagement (goal-gradient effect)
- Categories (reflection, decision, confidence) give users agency over their growth direction

### 5. Unlock Journey (Endowment Effect + IKEA Effect)

Showing locked personas creates anticipation. When users unlock a new persona through their own XP, they value it more (IKEA effect) and feel ownership (endowment effect).

## Sample Personas

| Persona | Category | Unlock Level | Inspiration |
|---------|----------|:------------:|-------------|
| Vijay the Visionary | Leadership | 1 | Indian entrepreneurial spirit |
| Ananya the Sage | Peace | 1 | Vedantic & mindfulness traditions |
| Priya the Trailblazer | Confidence | 3 | Indian women who broke barriers |
| Arjun the Scientist | Science | 5 | Indian scientific inquiry |
| Kabir the Storyteller | Creativity | 8 | Indian storytelling traditions |

All personas include explicit disclaimers that they are AI-generated characters inspired by philosophies, NOT impersonations.

## Getting Started

### Prerequisites

- Node.js 18+

### Setup

1. **Clone and install**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

Required variables:
```
OPENROUTER_API_KEY="sk-or-..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. **Run development server**
```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/
    (auth)/           # Auth pages (login, register)
    (app)/            # Protected app pages
      chat/           # Chat list + individual chats
      personas/       # Persona gallery
      quests/         # Quest board
      profile/        # User profile + stats
    api/              # API routes
      auth/           # Auth endpoints
      chat/           # Chat CRUD + streaming
      personas/       # Persona listing
      quests/         # Quest management
      xp/             # XP data
      stats/          # User statistics
    onboarding/       # Onboarding flow
  components/
    chat/             # Chat UI components
    gamification/     # XP bar, streak, level-up modal
    persona/          # Persona cards
    quest/            # Quest cards
    ui/               # Base UI components
  lib/
    chat-store.ts     # Client-side chat storage
    gamification.ts   # XP engine, streaks, levels
    openrouter.ts     # LLM integration with streaming
    personas.ts       # Persona data
    quests.ts         # Quest data
    utils.ts          # Utility functions
```

## Security & Ethics

- **No impersonation**: All personas are clearly marked as AI-inspired, not real people
- **Prompt injection protection**: System prompts include strict behavioral boundaries
- **No political content**: Personas explicitly avoid political statements
- **Cultural sensitivity**: Indian context without stereotyping

## Design Principles

1. **Mobile-first**: Every layout is designed for phones first
2. **Glassmorphism**: Frosted glass effects for premium feel
3. **Micro-animations**: Framer Motion for XP pops, level-ups, streak fires
4. **Dark mode**: Optimized for late-night reflection sessions
5. **Minimal & intentional**: Every element serves the progression loop
