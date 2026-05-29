# Frontend — My First LLM App

A small **Next.js** UI that talks to the FastAPI backend in `/api`.

## What it does

- Shows the page title **My First LLM App**
- Checks backend health at `http://127.0.0.1:8000/`
- Lets you type a prompt and submit it to `POST /api/chat`
- Displays the `reply` from the API

## Prerequisites

1. **Backend running** on port 8000 (from the repo root):

   ```bash
   export OPENAI_API_KEY=sk-your-key-here
   uv run uvicorn api.index:app --reload
   ```

2. **Node.js** (18+) and **npm** installed.

## Install dependencies

From the **repository root**:

```bash
cd frontend
npm install
```

## Run locally

Still in the `frontend` directory:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production build (optional)

```bash
npm run build
npm start
```

## Configuration

The API base URL is set in `app/page.tsx` as `http://127.0.0.1:8000`. Change it there if your backend runs on another host or port.
