# 🎮 LifeQuest

An AI-powered, gamified productivity app designed for students and individuals with ADHD who struggle to stay focused and accomplish long-term goals.

LifeQuest turns your goals into structured quest lines, tasks into missions, and productivity into a reward-based game system — all guided by an adaptive AI Agent.

---

## 🚀 Vision

Traditional productivity apps rely on discipline.  
QuestForge relies on **game mechanics + adaptive AI + behavioral psychology**.

Instead of manually creating todos, users:

1. Define a goal through conversation with an AI Agent
2. Co-create a structured quest line
3. Assign meaningful rewards
4. Earn in-app currency by completing tasks
5. Unlock self-defined rewards
6. Adapt difficulty dynamically over time

The AI Agent is the central system intelligence that:
- Breaks down goals into actionable tasks
- Assigns coin values
- Prevents reward abuse
- Tracks completion pace
- Adjusts difficulty through ongoing conversation

---

# 🧠 Core Philosophy

This app is built specifically for:

- 🎓 Students with heavy workload
- 🧠 Individuals with ADHD
- ⚡ People who struggle with focus & follow-through
- 🎯 Users overwhelmed by large goals

Key principles:
- Reduce decision fatigue
- Break down ambiguity
- Create visible progression
- Add emotional engagement through gamification
- Maintain structure through AI agreement

---

# 🎮 Core Features (MVP Scope)

## 1️⃣ AI Quest Creation System

Through structured conversation:

- User defines a high-level goal
- AI breaks it into milestones
- Milestones become tasks
- Tasks receive coin values
- User defines rewards
- AI evaluates and assigns reward cost
- Both agree on final system

⚠️ Users cannot arbitrarily modify rewards later.
Changes require AI re-negotiation.

---

## 2️⃣ Gamified Currency System

- Tasks reward coins
- Rewards cost coins
- Balance tracked in-app
- Spending triggers reinforcement dialogue
- Prevents self-sabotage via guardrails

Example:
- Study 45 minutes → +20 coins
- Gym session → +30 coins
- Watch 1 episode of show → -100 coins

---

## 3️⃣ Adaptive Difficulty Engine

The AI monitors:
- Task completion frequency
- Missed tasks
- Over-performance
- Time-to-complete

It adjusts:
- Task difficulty
- Task breakdown size
- Coin values
- Suggested pacing

All changes happen via conversational negotiation.

---

## 4️⃣ Motivational Game Layer

- Daily missions
- NPC-style encouragement
- Sudden side quests
- Encouragement after streaks
- Recovery messaging after failures
- Streak tracking

---

## 🏗 Technical Architecture

### 📱 Frontend
- React Native (Expo)
- TypeScript
- React Query (server sync)
- Native iOS notifications

### 🧠 Backend
- Next.JS
- Supabase

### 🤖 AI Layer
- OpenAI API
- LangGraph (structured quest flows)
- Deterministic state + LLM hybrid system

### 🔐 Auth
- Supabase Auth
- Apple Sign-In (required for iOS)

---


