import { useEffect, useState, useCallback } from "react";

const KEY = "asalcomot:auth";

export type AuthUser = { username: string };

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

  const login = useCallback((username: string, password: string) => {
    // NOTE: Untuk MVP, validasi sederhana: username & NIS (password) wajib diisi.
    // Validasi terhadap database real (Google Sheet Vistrasaka/Sakravara) butuh
    // integrasi backend (Lovable Cloud) + upload CSV ke project — bisa ditambah berikutnya.
    if (!username.trim() || !password.trim()) {
      return { ok: false, error: "Username dan NIS wajib diisi." };
    }
    if (password.trim().length < 3) {
      return { ok: false, error: "NIS minimal 3 karakter." };
    }
    const u: AuthUser = { username: username.trim() };
    localStorage.setItem(KEY, JSON.stringify(u));
    window.dispatchEvent(new Event("auth-updated"));
    setUser(u);
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("auth-updated"));
    setUser(null);
  }, []);

  return { user, ready, login, logout };
}
