import { useEffect, useState, useCallback } from "react";

const KEY_WORDS = "betawi-game:collected-words";
const KEY_PROGRESS = "betawi-game:progress";

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function readString(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

export function useCollectedWords() {
  const [words, setWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    setWords(readSet(KEY_WORDS));
    const onStorage = () => setWords(readSet(KEY_WORDS));
    window.addEventListener("storage", onStorage);
    window.addEventListener("words-updated", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("words-updated", onStorage);
    };
  }, []);

  const collect = useCallback((id: string) => {
    const current = readSet(KEY_WORDS);
    current.add(id);
    localStorage.setItem(KEY_WORDS, JSON.stringify([...current]));
    window.dispatchEvent(new Event("words-updated"));
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(KEY_WORDS);
    localStorage.removeItem(KEY_PROGRESS);
    window.dispatchEvent(new Event("words-updated"));
  }, []);

  return { words, collect, reset };
}

export function useProgress() {
  const [nodeId, setNodeId] = useState<string | null>(null);

  useEffect(() => {
    setNodeId(readString(KEY_PROGRESS));
  }, []);

  const save = useCallback((id: string) => {
    localStorage.setItem(KEY_PROGRESS, id);
    setNodeId(id);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY_PROGRESS);
    setNodeId(null);
  }, []);

  return { nodeId, save, clear };
}
