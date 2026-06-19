import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  VOCABULARY,
  ALL_WORDS_BY_LANG,
  type VocabWord,
  type Language,
} from "@/lib/game-data";
import { useCollectedWords } from "@/lib/game-store";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dictionary")({
  head: () => ({
    meta: [
      { title: "Kamus — ASAL COMOT" },
      { name: "description", content: "Kamus kosakata serapan bahasa Betawi dari 6 bahasa." },
    ],
  }),
  component: Dictionary,
});

const LANGS: Language[] = ["Belanda", "Tiongkok", "Portugis", "Kawi", "Inggris", "Arab"];

const LANG_META: Record<Language, { emoji: string; tag: string }> = {
  Belanda: { emoji: "🇳🇱", tag: "Betawi—Belanda" },
  Tiongkok: { emoji: "🇨🇳", tag: "Betawi—Tiongkok" },
  Portugis: { emoji: "🇵🇹", tag: "Betawi—Portugis" },
  Kawi: { emoji: "🪔", tag: "Betawi—Kawi" },
  Inggris: { emoji: "🇬🇧", tag: "Betawi—Inggris" },
  Arab: { emoji: "🇸🇦", tag: "Betawi—Arab" },
};

function Dictionary() {
  const { words } = useCollectedWords();
  const { user } = useAuth();
  const [lang, setLang] = useState<Language>("Belanda");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<"all" | "common" | "advance">("all");
  const [selected, setSelected] = useState<VocabWord | null>(null);

  const list = useMemo(() => {
    let l = ALL_WORDS_BY_LANG[lang];
    if (level !== "all") l = l.filter((w) => w.level === level);
    if (query.trim()) {
      const q = query.toLowerCase();
      l = l.filter(
        (w) =>
          w.original.toLowerCase().includes(q) ||
          w.betawi.toLowerCase().includes(q) ||
          w.literal.toLowerCase().includes(q),
      );
    }
    return l;
  }, [lang, level, query]);

  const total = Object.keys(VOCABULARY).length;
  const totalUnlocked = Object.values(VOCABULARY).filter((w) => w.level === "common" || words.has(w.id)).length;
  const collectedInLang = ALL_WORDS_BY_LANG[lang].filter((w) => w.level === "common" || words.has(w.id)).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b-4 border-primary bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <Link
            to="/"
            className="border-2 border-primary px-3 py-2 font-pixel text-[10px] text-primary hover:bg-primary hover:text-primary-foreground"
          >
            ← HOME
          </Link>
          <div className="text-center">
            <p className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              ASAL COMOT
            </p>
            <h1 className="font-pixel text-base text-primary sm:text-xl">📖 KAMUS</h1>
          </div>
          {user ? (
            <Link
              to="/play"
              className="bg-primary px-3 py-2 font-pixel text-[10px] text-primary-foreground hover:brightness-110"
            >
              ▶ START GAME
            </Link>
          ) : (
            <Link
              to="/"
              className="border-2 border-destructive px-3 py-2 font-pixel text-[10px] text-destructive"
            >
              🔒 LOGIN
            </Link>
          )}
        </div>

        {/* Language tabs */}
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3">
          {LANGS.map((L) => {
            const c = ALL_WORDS_BY_LANG[L].filter((w) => w.level === "common" || words.has(w.id)).length;
            const tot = ALL_WORDS_BY_LANG[L].length;
            const active = L === lang;
            return (
              <button
                key={L}
                onClick={() => setLang(L)}
                className={`shrink-0 border-2 px-3 py-2 font-pixel text-[10px] transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary"
                }`}
              >
                {LANG_META[L].emoji} {LANG_META[L].tag}
                <span className="ml-2 opacity-70">{c}/{tot}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Search + filter */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Cari kata, arti, atau bahasa asli..."
            className="flex-1 border-2 border-border bg-card px-3 py-3 font-mono-pixel text-xl text-foreground outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            {(["all", "common", "advance"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setLevel(k)}
                className={`border-2 px-3 py-2 font-pixel text-[10px] ${
                  level === k
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary"
                }`}
              >
                {k === "all" ? "SEMUA" : k === "common" ? "UMUM" : "LANJUTAN"}
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="font-mono-pixel text-lg text-muted-foreground">
            <span className="text-primary">{LANG_META[lang].tag}</span> · terkumpul{" "}
            <span className="font-pixel text-[10px] text-primary">{collectedInLang}/{ALL_WORDS_BY_LANG[lang].length}</span>
            {" · "}total <span className="font-pixel text-[10px] text-gold">{totalUnlocked}/{total}</span>
          </p>
        </div>
        <div className="mb-6 h-3 w-full border-2 border-border bg-background">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(collectedInLang / Math.max(1, ALL_WORDS_BY_LANG[lang].length)) * 100}%` }}
          />
        </div>

        {/* Grid */}
        {list.length === 0 ? (
          <p className="border-4 border-dashed border-border bg-card/40 p-8 text-center font-mono-pixel text-xl text-muted-foreground">
            Tidak ada kata yang cocok.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((w) => {
              const got = w.level === "common" || words.has(w.id);
              return (
                <button
                  key={w.id}
                  onClick={() => got && setSelected(w)}
                  disabled={!got}
                  className={`group relative border-4 p-4 text-left transition ${
                    got
                      ? "border-primary bg-card hover:bg-primary/10 hover:shadow-xl"
                      : "cursor-not-allowed border-border bg-card/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className={`font-pixel text-base ${got ? "text-primary" : "text-muted-foreground/40"}`}>
                        {got ? w.original : "?????"}
                      </p>
                      <p className="mt-1 font-mono-pixel text-base text-muted-foreground">
                        {w.language}
                      </p>
                    </div>
                    <span
                      className={`border-2 px-2 py-1 font-pixel text-[8px] uppercase ${
                        w.level === "common" ? "border-betawi text-betawi" : "border-gold text-gold"
                      }`}
                    >
                      {w.level === "common" ? "Umum" : "Lanjut"}
                    </span>
                  </div>

                  {got ? (
                    <p className="mt-3 font-mono-pixel text-lg text-accent">
                      → {w.betawi.split("—")[0].trim()}
                    </p>
                  ) : (
                    <p className="mt-3 font-mono-pixel text-base text-muted-foreground/50">
                      🔒 Mainkan game untuk buka kata ini
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {totalUnlocked === 0 && (
          <div className="mt-8 border-4 border-dashed border-primary bg-card/40 p-8 text-center">
            <p className="font-mono-pixel text-xl text-muted-foreground">
              Kamus masih terkunci. Mulai petualangan Chaer untuk membuka kata-kata!
            </p>
            {user ? (
              <Link
                to="/play"
                className="mt-4 inline-block bg-primary px-6 py-3 font-pixel text-xs text-primary-foreground hover:brightness-110"
              >
                ▶ MULAI PETUALANGAN
              </Link>
            ) : (
              <Link
                to="/"
                className="mt-4 inline-block border-2 border-destructive px-6 py-3 font-pixel text-xs text-destructive"
              >
                🔒 LOGIN DULU
              </Link>
            )}
          </div>
        )}
      </main>

      {/* Floating Start Game button */}
      {user && (
        <Link
          to="/play"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 border-4 border-primary bg-primary px-5 py-4 font-pixel text-xs text-primary-foreground shadow-2xl transition hover:brightness-110 active:translate-y-0.5"
        >
          ▶ START GAME
        </Link>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-lg border-4 border-primary bg-card p-6 shadow-2xl animate-float-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-2 top-2 border-2 border-border bg-background px-2 py-1 font-pixel text-[10px] hover:border-primary"
            >
              ✕
            </button>
            <p className="font-pixel text-[10px] uppercase tracking-widest text-gold">
              ✦ {LANG_META[selected.language].tag}
            </p>
            <h2 className="mt-3 font-pixel text-2xl text-primary sm:text-3xl">
              {selected.original}
            </h2>
            <p className="mt-1 font-mono-pixel text-lg text-muted-foreground">
              Bahasa {selected.language}
            </p>
            <div className="my-5 h-px bg-border" />
            <div className="space-y-4">
              <div>
                <p className="font-pixel text-[10px] uppercase text-muted-foreground">Arti Asli</p>
                <p className="mt-1 font-mono-pixel text-xl text-foreground">{selected.literal}</p>
              </div>
              <div>
                <p className="font-pixel text-[10px] uppercase text-betawi">Dalam Bahasa Betawi / Indonesia</p>
                <p className="mt-1 font-mono-pixel text-xl text-foreground">{selected.betawi}</p>
              </div>
              <div className="border-l-4 border-accent bg-background/50 p-3">
                <p className="font-pixel text-[10px] uppercase text-accent">Contoh Kalimat</p>
                <p className="mt-1 font-mono-pixel text-xl italic text-foreground">{selected.example}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
