# Intervue — Real-Time Technical Interview Platform

A full-stack collaborative coding interview platform that enables live video interviews with real-time code sync, chat, and candidate evaluation.

---

## 🚀 Features

### 🎙️ Live Interview Sessions
- **1-on-1 video calls** powered by Stream Video SDK
- **Real-time code collaboration** — both interviewer and candidate see code update live (Stream Chat custom events + debounced sync)
- **Live Sync indicator** — visible badge when collaborative mode is active
- **Synchronized interview timer** — host-controlled countdown, synced across both participants
- **Live Interviewer Notes & Candidate Scratchpad** — tabbed panel in the session room with quick observation tags (`[Optimal Approach]`, `[Edge Cases]`, `[Complexity]`) that auto-fill into the final evaluation
- **Invite link sharing** — copy session URL to clipboard with one click
- **Public & Private sessions** — private sessions are invite-only (not visible on dashboard)

### 💻 Code Editor
- Monaco Editor (VS Code engine) with JavaScript, Python, and Java support
- **Real-time code execution** via Piston API
- **Custom stdin input** support for test cases
- **Font size adjustments** (12px, 13px, 14px, 16px, 18px)
- **Reset to Starter Code** with confirmation
- **One-click Copy Code** with visual feedback
- **Line count & character count** display
- **Test case validation** with confetti 🎉 on success
- **Automatic problem solved tracking** — marks problem as solved in DB when all tests pass

### 📋 Problem Library & Bookmarks (15 Problems)
| Difficulty | Count | Problems |
|------------|-------|----------|
| Easy | 7 | Two Sum, Reverse String, Valid Palindrome, Best Time to Buy & Sell Stock, Valid Parentheses, Climbing Stairs, Binary Search |
| Medium | 5 | Maximum Subarray, Container With Most Water, Merge Intervals, Longest Substring Without Repeating Chars, Number of Islands |
| Hard | 3 | LRU Cache, Word Search, Trapping Rain Water |

- **Search & filter** by title, difficulty, category, and status (All, Solved, Bookmarked)
- **Bookmarking / Starred Problems** with backend persistence
- **Solved problem indicators** — green checkmarks on completed problems
- **Custom problem** entry for interviewers (enter any problem not in the list)

### 📊 Dashboard & Reporting
- **Live Sessions** feed — join open public sessions
- **Personal Stats** — active sessions, total sessions, hire rate progress bar
- **Hire rate** computed from your rated sessions (hire/no-hire breakdown)
- **Past Sessions** grid with difficulty, rating badge, and timestamp
- **Session review modal** — view final code snapshot (Monaco), interviewer notes, and execution output
- **Evaluation Report Export** — 1-click Download Markdown (.md) report or copy full evaluation report to clipboard
- **Daily interview tip** rotating by day of week

### 👤 Profile & Analytics
- **Profile page** with avatar, session count, hire rate badge, and solved count
- **Hire rate chart** with progress bar and hire/no-hire split
- **Difficulty breakdown** bar chart (Easy/Medium/Hard)
- **Rating distribution** across all sessions
- **Extra stats**: Problems solved, bookmarked problems, unique problems, **average session duration**
- **Bookmarked Problems to Practice** quick list on profile
- **Full session history** — click any session to review it

### 🏁 Post-Session Experience
- **Interviewer**: `EndSessionModal` with rating picker (Strong Hire → No Hire), live notes pre-filled, and rubric tags
- **Candidate**: `CandidateFeedbackModal` — see your rating, interviewer notes, duration, and download/copy full report before leaving

### 🔐 Auth & Security
- **Clerk authentication** — sign in with Google/GitHub/email
- Protected routes — all interview features require login
- JWT-based API protection via Clerk middleware

### 🗄️ Backend
- **Node.js + Express** REST API
- **MongoDB** via Mongoose with full session data persistence
- **Stream SDK** for video calls and chat channels
- **Session duration** auto-calculated on session end (in minutes)
- **User stats endpoint** aggregating hire rate, avg duration, difficulty breakdown, unique problems
- **Inngest** for background jobs

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TailwindCSS + DaisyUI |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Video & Chat | Stream Video + Chat SDK |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | Clerk |
| Code Execution | Piston API |
| Background Jobs | Inngest |
| State Management | TanStack Query (React Query) |

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance
- Clerk account (for auth)
- Stream account (for video/chat)
- Piston API access (or self-hosted)

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` in `backend/`:
```env
PORT=5001
MONGODB_URI=your_mongodb_uri
CLERK_SECRET_KEY=your_clerk_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
CLIENT_URL=http://localhost:5173
INNGEST_EVENT_KEY=your_inngest_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` in `frontend/`:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
VITE_API_URL=http://localhost:5001/api
```

```bash
npm run dev
```

---

## 📁 Project Structure

```
Intervue/
├── backend/
│   └── src/
│       ├── controllers/     # sessionController, codeController, userController, chatController
│       ├── lib/             # db, env, stream, inngest
│       ├── middleware/      # protectRoute (Clerk)
│       ├── models/          # User, Session
│       ├── routes/          # session, code, chat, user routes
│       └── server.js
└── frontend/
    └── src/
        ├── api/             # axios API modules
        ├── components/      # Reusable UI (CodeEditorPanel, VideoCallUI, Modals...)
        ├── data/            # problems.js (15 problems with starter code)
        ├── hooks/           # useSessions, useStreamClient, useUserProgress...
        ├── lib/             # axios, codeExecution, utils
        └── pages/           # HomePage, DashboardPage, SessionPage, ProfilePage, ProblemsPage...
```

---

## 🎯 Real-World Use Cases

1. **Technical Interviewer**: Create a private session → share invite link → run candidate through a problem → rate and leave notes → view candidate's code snapshot later
2. **Candidate**: Join session via link → write code in real-time with interviewer → run tests → see interviewer's feedback in post-session modal
3. **Mock Interview Partner**: Start a public session → any peer can join → practice together with timer
4. **Solo Practice**: Browse problems page → solve problems → track progress with solved indicators

---

## 📄 License

MIT
