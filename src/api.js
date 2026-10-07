import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// Your FastAPI params are plain `str` args, so FastAPI reads them from the
// query string (?url=...), not from a JSON body. That's why we use `params`.
export const summarizeUrl = async (url) => {
  const { data } = await api.post("/url", null, { params: { url } });
  return data; // a string
};

export const askQuestion = async (question) => {
  const { data } = await api.post("/ask", null, { params: { data: question } });
  // qa_chain.invoke returns a dict; pull out the text field it uses.
  if (typeof data === "string") return data;
  return data.text ?? data.answer ?? data.output ?? JSON.stringify(data);
};
