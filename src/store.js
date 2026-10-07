import { create } from "zustand";
import { summarizeUrl, askQuestion } from "./api";

const errorText = (err) =>
  err?.response?.data?.detail
    ? JSON.stringify(err.response.data.detail)
    : err?.message || "Something went wrong.";

export const useStore = create((set, get) => ({
  url: "",
  summary: "",
  messages: [], // { role: "user" | "ai", text }
  loadingSummary: false,
  loadingAnswer: false,
  error: "",

  setUrl: (url) => set({ url }),

  submitUrl: async () => {
    const url = get().url.trim();
    if (!url) return;
    set({ loadingSummary: true, error: "", summary: "", messages: [] });
    try {
      const summary = await summarizeUrl(url);
      set({ summary });
    } catch (err) {
      set({ error: errorText(err) });
    } finally {
      set({ loadingSummary: false });
    }
  },

  ask: async (question) => {
    const q = question.trim();
    if (!q || get().loadingAnswer) return;
    set((s) => ({
      messages: [...s.messages, { role: "user", text: q }],
      loadingAnswer: true,
      error: "",
    }));
    try {
      const answer = await askQuestion(q);
      set((s) => ({ messages: [...s.messages, { role: "ai", text: answer }] }));
    } catch (err) {
      set({ error: errorText(err) });
    } finally {
      set({ loadingAnswer: false });
    }
  },
}));
