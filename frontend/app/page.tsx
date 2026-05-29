"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

/** FastAPI backend base URL (local dev). */
const API_BASE = "http://127.0.0.1:8000";

type HealthState = "loading" | "ok" | "error";

export default function Home() {
  const [health, setHealth] = useState<HealthState>("loading");
  const [healthDetail, setHealthDetail] = useState("Checking backend…");
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setHealth("loading");
    setHealthDetail("Checking backend…");
    try {
      const res = await fetch(`${API_BASE}/`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as { status?: string };
      if (data.status === "ok") {
        setHealth("ok");
        setHealthDetail("Backend is healthy");
      } else {
        setHealth("error");
        setHealthDetail(`Unexpected response: ${JSON.stringify(data)}`);
      }
    } catch (e) {
      setHealth("error");
      setHealthDetail(
        e instanceof Error
          ? `Cannot reach backend: ${e.message}`
          : "Cannot reach backend"
      );
    }
  }, []);

  useEffect(() => {
    void checkHealth();
  }, [checkHealth]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = prompt.trim();
    if (!message) return;

    setSubmitting(true);
    setError(null);
    setReply(null);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = (await res.json()) as { reply?: string; detail?: string };

      if (!res.ok) {
        const detail =
          typeof data.detail === "string"
            ? data.detail
            : `Request failed (${res.status})`;
        throw new Error(detail);
      }

      if (!data.reply) {
        throw new Error("No reply in response");
      }

      setReply(data.reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>My First LLM App</h1>
      <p className="subtitle">
        Send a prompt to your FastAPI backend and see the coach&apos;s reply.
      </p>

      <div className="status-card" role="status" aria-live="polite">
        <span
          className={`status-dot ${health}`}
          aria-hidden="true"
        />
        <span>{healthDetail}</span>
        {health === "error" && (
          <button
            type="button"
            onClick={() => void checkHealth()}
            style={{
              marginLeft: "auto",
              fontSize: "0.8rem",
              padding: "0.25rem 0.5rem",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        )}
      </div>

      <form className="form-section" onSubmit={handleSubmit}>
        <label htmlFor="prompt">Your prompt</label>
        <textarea
          id="prompt"
          name="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your message here…"
          disabled={submitting}
          required
        />
        <button type="submit" disabled={submitting || !prompt.trim()}>
          {submitting ? "Sending…" : "Submit"}
        </button>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
      </form>

      <section className="response-section" aria-labelledby="response-heading">
        <h2 id="response-heading">AI response</h2>
        {reply ? (
          <p className="response-body">{reply}</p>
        ) : (
          <p className="response-body response-placeholder">
            Submit a prompt to see the response here.
          </p>
        )}
      </section>
    </main>
  );
}
