import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";

const KEY = "asalcomot:auth";

export type AuthUser = { username: string; nis: string };

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
    const onUpd = () => {
      const raw = localStorage.getItem(KEY);
      setUser(raw ? JSON.parse(raw) : null);
    };
    window.addEventListener("auth-updated", onUpd);
    window.addEventListener("storage", onUpd);
    return () => {
      window.removeEventListener("auth-updated", onUpd);
      window.removeEventListener("storage", onUpd);
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    if (!username.trim() || !password.trim()) {
      return { ok: false, error: "Username dan NIS wajib diisi." };
    }

    const nis = password.trim();

    // Cek ke Supabase database "players"
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("nis", nis)
      .single();

    if (error || !data) {
      return { ok: false, error: "Username atau NIS tidak ditemukan di database." };
    }

    // Pastikan username lumayan cocok
    if (data.username.toLowerCase() !== username.trim().toLowerCase()) {
      return { ok: false, error: "Username tidak cocok dengan NIS tersebut." };
    }

    // Tarik progres dari Supabase
    const { data: prog } = await supabase.from("progress").select("*").eq("nis", nis).single();
    if (prog) {
      if (prog.words) localStorage.setItem("asalcomot:words", JSON.stringify(prog.words));
      else localStorage.setItem("asalcomot:words", "[]");
    } else {
      // Jika belum ada progress, buat row baru
      await supabase.from("progress").insert({ nis: nis, words: [] });
      localStorage.setItem("asalcomot:words", "[]");
    }

    const u: AuthUser = { username: data.username, nis: data.nis };
    localStorage.setItem(KEY, JSON.stringify(u));
    window.dispatchEvent(new Event("auth-updated"));
    
    // Trigger update untuk kamus
    window.dispatchEvent(new Event("words-updated"));
    
    setUser(u);
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    // Hapus sesi game lokal juga
    localStorage.removeItem("asalcomot:words");
    localStorage.removeItem("asalcomot:progress");
    localStorage.removeItem("asalcomot:scene");
    localStorage.removeItem("asalcomot:intro-seen");
    
    window.dispatchEvent(new Event("auth-updated"));
    window.dispatchEvent(new Event("words-updated"));
    setUser(null);
  }, []);

  return { user, ready, login, logout };
}
