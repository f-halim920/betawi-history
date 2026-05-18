import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useCollectedWords } from "@/lib/game-store";
import { VOCABULARY } from "@/lib/game-data";
import scenePasar from "@/assets/scene-pasar.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASAL COMOT — Belajar Kosakata Serapan Betawi" },
      { name: "description", content: "Game ASAL COMOT: jelajahi Batavia abad ke-16 bersama Chaer dan pelajari asal-usul kosakata serapan bahasa Betawi." },
      { property: "og:title", content: "ASAL COMOT" },
      { property: "og:description", content: "Visual novel pixel art tentang asal-usul kosakata serapan bahasa Betawi." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user, login, logout, ready } = useAuth();
  const navigate = useNavigate();
  const { words } = useCollectedWords();
  const total = Object.keys(VOCABULARY).length;

  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [needLogin, setNeedLogin] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const r = login(u, p);
    if (!r.ok) setErr(r.error);
    else {
      setU(""); setP("");
      // Scroll ke home
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function tryStart() {
    if (!user) {
      setNeedLogin(true);
      document.getElementById("login")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate({ to: "/play" });
  }

  return (
    <div className="relative bg-background text-foreground">
      {/* ===== LOGIN SECTION ===== */}
      <section
        id="login"
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16"
      >
        <img
          src={scenePasar}
          alt=""
          className="pixel absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="font-display text-xs uppercase tracking-[0.4em] text-primary text-shadow-pixel">
              Batavia · 1619
            </p>
            <h1 className="mt-3 font-pixel text-3xl text-primary text-shadow-pixel sm:text-5xl">
              ASAL<br />COMOT
            </h1>
            <p className="mt-4 font-mono-pixel text-xl text-foreground/90 text-shadow-pixel">
              Pelajari asal-usul kosakata serapan bahasa Betawi
            </p>
          </div>

          {user ? (
            <div className="border-4 border-primary bg-card/95 p-6 text-center shadow-2xl">
              <p className="font-pixel text-[10px] uppercase text-muted-foreground">Sudah login sebagai</p>
              <p className="mt-2 font-pixel text-lg text-primary">{user.username}</p>
              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-primary px-5 py-3 font-pixel text-xs text-primary-foreground transition hover:brightness-110"
                >
                  ↓ KE HOME
                </button>
                <button
                  onClick={logout}
                  className="border-2 border-border bg-card px-5 py-3 font-pixel text-[10px] text-muted-foreground hover:border-destructive hover:text-destructive"
                >
                  LOGOUT
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="border-4 border-primary bg-card/95 p-6 shadow-2xl backdrop-blur"
            >
              <h2 className="font-pixel text-sm text-primary">LOGIN PEMAIN</h2>
              <p className="mt-1 font-mono-pixel text-base text-muted-foreground">
                Masukkan username & NIS-mu untuk mulai.
              </p>

              <label className="mt-5 block font-pixel text-[10px] uppercase text-muted-foreground">Username</label>
              <input
                value={u}
                onChange={(e) => setU(e.target.value)}
                placeholder="cth: chaer"
                className="mt-1 w-full border-2 border-border bg-background px-3 py-3 font-mono-pixel text-xl text-foreground outline-none focus:border-primary"
                autoComplete="username"
              />

              <label className="mt-4 block font-pixel text-[10px] uppercase text-muted-foreground">NIS (Password)</label>
              <input
                type="password"
                value={p}
                onChange={(e) => setP(e.target.value)}
                placeholder="cth: 12345"
                className="mt-1 w-full border-2 border-border bg-background px-3 py-3 font-mono-pixel text-xl text-foreground outline-none focus:border-primary"
                autoComplete="current-password"
              />

              {err && (
                <p className="mt-3 border-2 border-destructive bg-destructive/10 p-2 font-mono-pixel text-base text-destructive">
                  ⚠ {err}
                </p>
              )}

              <button
                type="submit"
                className="mt-5 w-full bg-primary px-5 py-3 font-pixel text-xs text-primary-foreground transition hover:brightness-110 active:translate-y-0.5"
              >
                ▶ LOGIN & LANJUT
              </button>

              <p className="mt-3 text-center font-mono-pixel text-sm text-muted-foreground">
                Belum punya akun? Tanya panitia untuk NIS-mu.
              </p>
            </form>
          )}

          <p className="mt-6 text-center font-mono-pixel text-base text-muted-foreground animate-blink">
            ↓ scroll ke bawah untuk Home
          </p>
        </div>

        {needLogin && !user && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur"
            onClick={() => setNeedLogin(false)}
          >
            <div
              className="relative w-full max-w-md border-4 border-destructive bg-card p-6 shadow-2xl animate-float-up"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-pixel text-[10px] uppercase text-destructive">⚠ Akses ditolak</p>
              <h3 className="mt-3 font-pixel text-lg text-primary">Login dulu, ya!</h3>
              <p className="mt-3 font-mono-pixel text-xl text-foreground">
                Kamu harus login dengan username & NIS untuk memulai petualangan Chaer.
              </p>
              <button
                onClick={() => setNeedLogin(false)}
                className="mt-5 w-full bg-primary px-5 py-3 font-pixel text-xs text-primary-foreground hover:brightness-110"
              >
                MENGERTI
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ===== HOME SECTION ===== */}
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16"
      >
        <img
          src={scenePasar}
          alt=""
          className="pixel absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background" />

        <div className="relative z-10 w-full max-w-3xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-primary text-shadow-pixel">
            ✦ Menu Utama ✦
          </p>
          <h2 className="mt-3 font-pixel text-2xl text-primary text-shadow-pixel sm:text-4xl">
            SELAMAT DATANG{user ? `, ${user.username.toUpperCase()}` : ""}
          </h2>
          <p className="mt-5 font-mono-pixel text-xl text-foreground/90 text-shadow-pixel">
            Pilih: mulai petualangan Chaer, atau buka Kamus untuk meninjau kata yang sudah kamu kumpulkan.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <button
              onClick={tryStart}
              className="group relative border-4 border-primary bg-primary/10 p-6 text-left transition hover:bg-primary/20"
            >
              <p className="font-pixel text-[10px] uppercase text-primary">▶ Start</p>
              <h3 className="mt-2 font-pixel text-xl text-primary">MULAI GAME</h3>
              <p className="mt-2 font-mono-pixel text-lg text-foreground/90">
                Bangun di Batavia abad ke-16. Ngobrol sama saudagar dari segala penjuru dunia.
              </p>
              {!user && (
                <p className="mt-3 font-mono-pixel text-base text-destructive">🔒 Perlu login dulu</p>
              )}
            </button>

            <button
              onClick={() => navigate({ to: "/dictionary" })}
              className="relative border-4 border-gold bg-gold/10 p-6 text-left transition hover:bg-gold/20"
            >
              <p className="font-pixel text-[10px] uppercase text-gold">📖 Lihat</p>
              <h3 className="mt-2 font-pixel text-xl text-gold">KAMUS</h3>
              <p className="mt-2 font-mono-pixel text-lg text-foreground/90">
                6 kategori bahasa serapan: Belanda, Tiongkok, Portugis, Kawi, Inggris, Arab.
              </p>
              <p className="mt-3 font-mono-pixel text-base text-muted-foreground">
                Terkumpul: <span className="font-pixel text-[10px] text-primary">{words.size}/{total}</span>
              </p>
            </button>
          </div>

          {user && (
            <button
              onClick={logout}
              className="mt-8 font-mono-pixel text-sm text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
            >
              Logout
            </button>
          )}

          <p className="mt-12 font-mono-pixel text-sm text-muted-foreground">
            {ready ? null : "memuat..."}
          </p>
        </div>
      </section>
    </div>
  );
}
