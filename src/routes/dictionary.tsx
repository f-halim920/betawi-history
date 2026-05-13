import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { VOCABULARY, type VocabWord } from "@/lib/game-data";
import { useCollectedWords } from "@/lib/game-store";

export const Route = createFileRoute("/dictionary")({
  head: () => ({
    meta: [
      { title: "Kamus — Lidah Batavia" },
      {
        name: "description",
        content: "Kamus kata serapan Belanda yang dipelajari Sanip selama petualangan di Batavia.",
      },
      { property: "og:title", content: "Kamus Lidah Batavia" },
      {
        property: "og:description",
        content: "Asal-usul kata serapan Belanda dalam bahasa Betawi modern.",
      },
    ],
  }),
  component: Dictionary,
});

function Dictionary() {
  const { words } = useCollectedWords();
  const [filter, setFilter] = useState<"all" | "common" | "advance">("all");
  const [selected, setSelected] = useState<VocabWord | null>(null);

  const all = Object.values(VOCABULARY);
  const filtered = filter === "all" ? all : all.filter((w) => w.level === filter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b-4 border-primary bg-card/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
          <Link
            to="/"
            className="border-2 border-primary px-3 py-2 font-pixel text-[10px] text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            ← MENU
          </Link>
          <div className="text-center">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Buku Catatan Sanip
            </p>
            <h1 className="mt-1 text-xl text-primary text-shadow-pixel sm:text-3xl">
              📖 KAMUS
            </h1>
          </div>
          <Link
            to="/play"
            className="bg-primary px-3 py-2 font-pixel text-[10px] text-primary-foreground transition hover:brightness-110"
          >
            ▶ MAIN
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="font-mono-pixel text-xl text-muted-foreground">
            Terkumpul:{" "}
            <span className="font-pixel text-sm text-primary">
              {words.size} / {all.length}
            </span>{" "}
            kata
          </p>

          <div className="flex gap-2">
            {(["all", "common", "advance"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`border-2 px-3 py-2 font-pixel text-[10px] transition ${
                  filter === k
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary"
                }`}
              >
                {k === "all" ? "SEMUA" : k === "common" ? "UMUM" : "LANJUTAN"}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8 h-3 w-full border-2 border-border bg-background">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(words.size / all.length) * 100}%` }}
          />
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((w) => {
            const collected = words.has(w.id);
            return (
              <button
                key={w.id}
                onClick={() => collected && setSelected(w)}
                disabled={!collected}
                className={`group relative border-4 p-5 text-left transition ${
                  collected
                    ? "border-primary bg-card hover:bg-primary/10 hover:shadow-lg"
                    : "cursor-not-allowed border-border bg-card/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {collected ? (
                      <>
                        <p className="font-pixel text-base text-primary sm:text-lg">
                          {w.original}
                        </p>
                        <p className="mt-1 font-mono-pixel text-base text-muted-foreground">
                          {w.language}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-pixel text-base text-muted-foreground/50">
                          ? ? ? ? ?
                        </p>
                        <p className="mt-1 font-mono-pixel text-base text-muted-foreground/40">
                          Belum ditemukan
                        </p>
                      </>
                    )}
                  </div>
                  <span
                    className={`border-2 px-2 py-1 font-pixel text-[8px] uppercase ${
                      w.level === "common"
                        ? "border-betawi text-betawi"
                        : "border-gold text-gold"
                    }`}
                  >
                    {w.level === "common" ? "Umum" : "Lanjutan"}
                  </span>
                </div>

                {collected && (
                  <p className="mt-3 font-mono-pixel text-lg text-foreground">
                    → <span className="text-accent">{w.betawi.split("—")[0].trim()}</span>
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {words.size === 0 && (
          <div className="mt-8 border-4 border-dashed border-border bg-card/50 p-8 text-center">
            <p className="font-mono-pixel text-xl text-muted-foreground">
              Buku catatan masih kosong. Mulai petualangan untuk mengumpulkan kata!
            </p>
            <Link
              to="/play"
              className="mt-4 inline-block bg-primary px-6 py-3 font-pixel text-xs text-primary-foreground transition hover:brightness-110"
            >
              ▶ MULAI PETUALANGAN
            </Link>
          </div>
        )}
      </main>

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
              ✦ Kata Serapan
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
                <p className="font-pixel text-[10px] uppercase text-muted-foreground">
                  Arti Asli
                </p>
                <p className="mt-1 font-mono-pixel text-xl text-foreground">
                  {selected.literal}
                </p>
              </div>
              <div>
                <p className="font-pixel text-[10px] uppercase text-betawi">
                  Dalam Bahasa Betawi / Indonesia Modern
                </p>
                <p className="mt-1 font-mono-pixel text-xl text-foreground">
                  {selected.betawi}
                </p>
              </div>
              <div className="border-l-4 border-accent bg-background/50 p-3">
                <p className="font-pixel text-[10px] uppercase text-accent">
                  Contoh Kalimat
                </p>
                <p className="mt-1 font-mono-pixel text-xl italic text-foreground">
                  {selected.example}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
