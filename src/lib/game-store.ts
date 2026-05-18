import { useEffect, useState, useCallback } from "react";
import type { Scene } from "./game-data";

const KEY_WORDS = "asalcomot:words";
const KEY_PROGRESS = "asalcomot:progress";
const KEY_SCENE = "asalcomot:scene";
const KEY_INTRO = "asalcomot:intro-seen";

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
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
    if (current.has(id)) return;
    current.add(id);
    localStorage.setItem(KEY_WORDS, JSON.stringify([...current]));
    window.dispatchEvent(new Event("words-updated"));
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(KEY_WORDS);
    localStorage.removeItem(KEY_PROGRESS);
    localStorage.removeItem(KEY_SCENE);
    localStorage.removeItem(KEY_INTRO);
    window.dispatchEvent(new Event("words-updated"));
  }, []);

  return { words, collect, reset };
}

export function useProgress() {
  const [nodeId, setNodeId] = useState<string | null>(null);

  useEffect(() => {
    setNodeId(typeof window === "undefined" ? null : localStorage.getItem(KEY_PROGRESS));
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

export function useScene() {
  const [scene, setSceneState] = useState<Scene | null>(null);
  useEffect(() => {
    const s = typeof window === "undefined" ? null : (localStorage.getItem(KEY_SCENE) as Scene | null);
    setSceneState(s);
  }, []);
  const setScene = useCallback((s: Scene | null) => {
    if (s) localStorage.setItem(KEY_SCENE, s);
    else localStorage.removeItem(KEY_SCENE);
    setSceneState(s);
  }, []);
  return { scene, setScene };
}

export function useIntroSeen() {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    setSeen(typeof window !== "undefined" && localStorage.getItem(KEY_INTRO) === "1");
  }, []);
  const markSeen = useCallback(() => {
    localStorage.setItem(KEY_INTRO, "1");
    setSeen(true);
  }, []);
  return { seen, markSeen };
}
