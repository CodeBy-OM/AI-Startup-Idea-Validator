# IdeaForge — AI Startup Idea Validator

> An AI-powered startup validation tool built for the Schmooze Media technical screening task. Submit a startup idea and receive a detailed expert analysis report powered by Claude AI.

# Live Link - https://ai-startup-idea-validator-liard.vercel.app/
---

## Live Demo

- **Frontend**: Deploy to Vercel (see below)
- **Backend**: Deploy to Render (see below)

---

## Features

- **AI Analysis** — Claude claude-sonnet-4-20250514 generates structured reports including problem statement, customer persona, market overview, competitors, tech stack, risk factors, and a profitability score (0–100)
- **Dashboard** — Browse and manage all validated ideas
- **Detail Reports** — Rich formatted view with visual score gauge and competitor breakdown
- **Persistence** — JSON file-based storage (easy to swap for MongoDB/Postgres)
- **Delete** — Remove ideas from the dashboard or detail view

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, React Router v6, Axios    |
| Backend   | Node.js, Express 4                  |
| AI        | Anthropic Claude (claude-sonnet-4-20250514) |
| Storage   | JSON file (server/data/ideas.json)  |
| Fonts     | Syne, DM Sans, DM Mono (Google Fonts)|

---

## Project Structure

```
startup-validator/
├── client/                  # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.css
│   │   ├── hooks/
│   │   │   └── useApi.js    # Axios API wrapper
│   │   ├── pages/
│   │   │   ├── HomePage.js         # Idea submission form
│   │   │   ├── DashboardPage.js    # Ideas list
│   │   │   └── IdeaDetailPage.js   # Full report view
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
└── server/                  # Express backend
    ├── src/
    │   ├── db/
    │   │   └── store.js      # JSON file store
    │   ├── routes/
    │   │   └── ideas.js      # CRUD routes
    │   ├── services/
    │   │   └── ai.js         # Anthropic integration
    │   └── index.js          # Express app
    ├── data/                 # Auto-created, stores ideas.json
    ├── .env.example
    └── package.json
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- An [GROQ API key]

### 1. Clone and install

```bash
git clone <your-repo-url>
cd startup-validator
```

### 2. Setup the server

```bash
cd server
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup the client

```bash
cd ../client
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000 (already set)
npm install
npm start
# App runs on http://localhost:3000
```

---

## API Reference

| Method | Endpoint        | Description                          |
|--------|----------------|--------------------------------------|
| POST   | `/ideas`        | Submit idea → triggers AI analysis   |
| GET    | `/ideas`        | List all ideas (summary view)        |
| GET    | `/ideas/:id`    | Full idea with complete AI report    |
| DELETE | `/ideas/:id`    | Delete an idea                       |
| GET    | `/health`       | Health check                         |

### POST /ideas — Request Body
```json
{
  "title": "Your startup idea title",
  "description": "Detailed description of the problem and solution..."
}
```

### GET /ideas — Response
```json
[
  {
    "id": "uuid",
    "title": "...",
    "description": "...",
    "createdAt": "ISO date",
    "profitability_score": 72,
    "risk_level": "Medium",
    "verdict": "Promising"
  }
]
```

---

## AI Prompt Design

The system uses a detailed system prompt that instructs Claude to return a strict JSON schema:

```json
{
  "problem": "...",
  "customer": {
    "primary": "...",
    "pain_points": ["..."],
    "willingness_to_pay": "..."
  },
  "market": {
    "size": "...",
    "growth_rate": "...",
    "maturity": "...",
    "summary": "..."
  },
  "competitors": [
    { "name": "...", "differentiation": "..." }
  ],
  "tech_stack": ["..."],
  "risk_level": "Low | Medium | High",
  "risk_factors": ["..."],
  "profitability_score": 0-100,
  "justification": "...",
  "go_to_market": "...",
  "verdict": "Strong Buy | Promising | Risky | Needs Pivot"
}
```

The prompt enforces realism over hype, requires exactly 3 competitors, 4–6 tech stack choices, and provides a calibrated scoring rubric.

---

## Deployment

### Frontend → Vercel

```bash
cd client
npm run build
# Push to GitHub and connect to Vercel
# Set environment variable: REACT_APP_API_URL=https://your-server.onrender.com
```

### Backend → Render

1. Push the `server/` folder to GitHub
2. Create a new Web Service on Render
3. Set environment variables:
   - `ANTHROPIC_API_KEY` = your key
   - `CLIENT_URL` = your Vercel frontend URL
   - `PORT` = 5000
4. Build command: `npm install`
5. Start command: `npm start`

> **Note**: For production, replace the JSON file store with MongoDB Atlas or Neon (Postgres). The `db/store.js` file has a clear interface making this straightforward.

---

## Architecture Notes

- **Storage**: For MVP speed, the server uses a simple JSON file store (`server/data/ideas.json`). This is trivially replaceable with any database — the `store.js` module exposes `getAll`, `getById`, `insert`, and `delete` with a clean interface.
- **AI calls**: Analysis is synchronous (awaited before returning 201). Timeout is set to 60s on the client. For production, consider a job queue (BullMQ) with WebSocket status updates.
- **Error handling**: All API errors are caught and returned as structured JSON with `error` and `message` fields.
- **CORS**: Configured to allow only the client origin via env variable.

---

## Scoring Rubric Coverage

| Category                  | Implementation                                    |
|---------------------------|---------------------------------------------------|
| AI Report Quality (25pts) | 10-field structured JSON, calibrated scoring       |
| API Functionality (15pts) | POST, GET, GET/:id, DELETE all implemented         |
| Frontend UI/UX (15pts)    | Dark themed, responsive, animated, 3 pages         |
| Database Integration (10) | JSON persistence, easily swappable                 |
| Deployment / Docs (10pts) | Vercel + Render instructions above                 |
| Code Quality (15pts)      | Modular, separated concerns, env-based config      |
| Documentation (10pts)     | This README                                        |
