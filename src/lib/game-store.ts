import { useEffect, useState, useCallback } from "react";
import type { Scene } from "./game-data";
import { supabase } from "./supabase";
import type { AuthUser } from "./auth";

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

  const collect = useCallback(async (id: string) => {
    const current = readSet(KEY_WORDS);
    if (current.has(id)) return;
    current.add(id);
    
    const newWordsArr = [...current];

    // Simpan ke localStorage untuk kecepatan UI
    localStorage.setItem(KEY_WORDS, JSON.stringify(newWordsArr));
    window.dispatchEvent(new Event("words-updated"));

    // Sync ke Supabase di background
    try {
      const rawUser = localStorage.getItem("asalcomot:auth");
      if (rawUser) {
        const user = JSON.parse(rawUser) as AuthUser;
        if (user && user.nis) {
          await supabase.from("progress").update({ words: newWordsArr }).eq("nis", user.nis);
        }
      }
    } catch (err) {
      console.error("Gagal sinkronisasi kamus ke Supabase", err);
    }
  }, []);

  const reset = useCallback(async () => {
    localStorage.removeItem(KEY_WORDS);
    localStorage.removeItem(KEY_PROGRESS);
    localStorage.removeItem(KEY_SCENE);
    localStorage.removeItem(KEY_INTRO);
    window.dispatchEvent(new Event("words-updated"));

    // Hapus juga di Supabase jika sedang login
    try {
      const rawUser = localStorage.getItem("asalcomot:auth");
      if (rawUser) {
        const user = JSON.parse(rawUser) as AuthUser;
        if (user && user.nis) {
          await supabase.from("progress").update({ words: [], scenes: [] }).eq("nis", user.nis);
        }
      }
    } catch {}
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
