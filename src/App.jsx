import { useEffect, useRef, useState } from "react";
import { useStore } from "./store";

function Spinner({ label }) {
  return (
    <div className="flex items-center gap-3 text-sm text-stone-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-teal-700" />
      {label}
    </div>
  );
}

function UrlForm() {
  const { url, setUrl, submitUrl, loadingSummary } = useStore();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitUrl();
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="url"
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a YouTube or web page link"
        className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
      />
      <button
        type="submit"
        disabled={loadingSummary}
        className="rounded-lg bg-teal-800 px-6 py-3 font-medium text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingSummary ? "Summarizing…" : "Summarize"}
      </button>
    </form>
  );
}

function Summary() {
  const summary = useStore((s) => s.summary);
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="mb-3 text-lg font-semibold text-stone-900">Summary</h2>
      <p className="max-w-prose whitespace-pre-line leading-relaxed text-stone-700">
        {summary}
      </p>
    </section>
  );
}

function Chat() {
  const { messages, ask, loadingAnswer } = useStore();
  const [question, setQuestion] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingAnswer]);

  const send = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    ask(question);
    setQuestion("");
  };

  return (
    <section className="flex flex-col rounded-xl border border-stone-200 bg-white">
      <h2 className="border-b border-stone-200 px-6 py-4 text-lg font-semibold text-stone-900">
        Ask about this content
      </h2>

      <div className="flex max-h-96 min-h-40 flex-col gap-3 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <p className="text-sm text-stone-500">
            Type a question below, for example “What are the main points?”
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === "user"
                ? "self-end bg-teal-800 text-white"
                : "self-start bg-stone-100 text-stone-800"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loadingAnswer && <Spinner label="Thinking…" />}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="flex gap-3 border-t border-stone-200 p-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question"
          className="min-w-0 flex-1 rounded-lg border border-stone-300 px-4 py-2.5 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
        />
        <button
          type="submit"
          disabled={loadingAnswer || !question.trim()}
          className="rounded-lg bg-teal-800 px-5 py-2.5 font-medium text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}

export default function App() {
  const { summary, loadingSummary, error } = useStore();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">
            Summarize a link, then ask it anything
          </h1>
          <p className="mt-2 text-stone-600">
            Works with YouTube videos and regular web pages.
          </p>
        </header>

        <UrlForm />

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        {loadingSummary && <Spinner label="Reading the link and writing a summary…" />}

        {summary && !loadingSummary && (
          <>
            <Summary />
            <Chat />
          </>
        )}
      </main>
    </div>
  );
}
