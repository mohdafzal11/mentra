# MimChat — Grow Through Conversations

A production-ready, gamified conversational web app where users chat with AI-inspired personas based on Indian philosophies. This is a progression-driven, habit-forming experience designed to feel like mentorship, not just messaging.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Auth | Cookie-based (HTTP-only, secure) |
| LLM | OpenRouter (model-agnostic) |
| Rendering | Server Components + Server Actions |

## Authentication Architecture

### Why Cookie-Based Auth?

We chose HTTP-only secure cookies over JWT-in-localStorage for several critical reasons:

1. **XSS Protection**: HTTP-only cookies cannot be accessed by JavaScript, eliminating the most common attack vector for token theft.

2. **Server-Side Compatibility**: Cookies flow automatically with every request, making them work seamlessly with:
   - Server Components (via `cookies()`)
   - Server Actions
   - Middleware (route protection)
   - API Routes

3. **Automatic Session Refresh**: Cookie expiry is managed server-side with a 30-day sliding window. No client-side refresh token logic needed.

4. **SameSite Protection**: `SameSite=Lax` prevents CSRF attacks while allowing normal navigation.

### Auth Flow

```
Register/Login -> Create Session (DB) -> Sign JWT (session ID only) -> Set HTTP-only Cookie
                                                                          |
Every Request -> Middleware reads cookie -> Verify JWT -> Load session -> Allow/Deny
                                                                          |
Protected Pages -> getSession() -> Return user data from session -> Render
```

### Session Model

Sessions are stored in the database with expiry timestamps. The JWT in the cookie only contains the session ID — no user data. This means:
- Sessions can be revoked server-side
- User data is always fresh (not stale from a token)
- Multiple sessions per user are supported

## UX Psychology & Gamification Design

### Core Loop: The MimChat Habit Engine

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

## Database Schema

### Models

| Model | Purpose |
|-------|---------|
| `User` | Core user with XP, level, streak tracking |
| `Session` | Server-side sessions for cookie auth |
| `Persona` | AI mentor characters with philosophy prompts |
| `PersonaDepth` | Progressive prompt layers per persona |
| `Chat` | Conversation threads |
| `Message` | Individual messages with XP tracking |
| `Quest` | Structured conversation goals |
| `UserQuestProgress` | Per-user quest completion tracking |
| `XPLog` | Audit trail of all XP awards |
| `UserPersonaUnlock` | Which personas each user has unlocked |

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
- PostgreSQL (via Supabase or local)

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
DATABASE_URL="postgresql://..."
SESSION_SECRET="64-char-random-hex"
OPENROUTER_API_KEY="sk-or-..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. **Set up database**
```bash
npm run db:push     # Push schema to database
npm run db:seed     # Seed personas and quests
```

4. **Run development server**
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
    auth.ts           # Cookie-based auth system
    gamification.ts   # XP engine, streaks, levels
    openrouter.ts     # LLM integration with streaming
    personas.ts       # Persona seed data
    prisma.ts         # Prisma client singleton
    quests.ts         # Quest seed data
    utils.ts          # Utility functions
    validations.ts    # Zod schemas
  middleware.ts       # Route protection
```

## Security & Ethics

- **No impersonation**: All personas are clearly marked as AI-inspired, not real people
- **HTTP-only cookies**: Prevents XSS token theft
- **SameSite cookies**: Prevents CSRF attacks
- **Input validation**: Zod schemas on all user inputs
- **Rate limiting ready**: Architecture supports per-user rate limits
- **Prompt injection protection**: System prompts include strict behavioral boundaries
- **No political content**: Personas explicitly avoid political statements
- **Cultural sensitivity**: Indian context without stereotyping

## Design Principles

1. **Mobile-first**: Every layout is designed for phones first
2. **Glassmorphism**: Frosted glass effects for premium feel
3. **Micro-animations**: Framer Motion for XP pops, level-ups, streak fires
4. **Dark mode**: Optimized for late-night reflection sessions
5. **Minimal & intentional**: Every element serves the progression loop
