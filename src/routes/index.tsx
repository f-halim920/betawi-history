import { createFileRoute, Link } from "@tanstack/react-router";
import { useCollectedWords, useProgress } from "@/lib/game-store";
import { VOCABULARY } from "@/lib/game-data";
import scene from "@/assets/scene-market.png";
import mc from "@/assets/char-mc.png";
import merchant from "@/assets/char-merchant.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lidah Batavia — Petualangan Kosakata Betawi Abad 16" },
      {
        name: "description",
        content:
          "Game visual novel pixel art tentang Sanip, pemuda Betawi yang mempelajari kosakata serapan dari para saudagar di Batavia abad 16.",
      },
      { property: "og:title", content: "Lidah Batavia" },
      {
        property: "og:description",
        content: "Pelajari asal-usul kata serapan Betawi dalam petualangan visual novel pixel art.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { words, reset } = useCollectedWords();
  const { nodeId, clear } = useProgress();
  const total = Object.keys(VOCABULARY).length;
  const hasSave = !!nodeId;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background scene */}
      <div className="absolute inset-0">
        <img
          src={scene}
          alt="Pelabuhan Batavia abad 16"
          className="pixel h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
      </div>

      {/* Floating characters */}
      <img
        src={mc}
        alt=""
        className="pixel pointer-events-none absolute bottom-0 left-[8%] h-[55vh] max-h-[600px] drop-shadow-[0_0_30px_rgba(0,0,0,0.6)]"
      />
      <img
        src={merchant}
        alt=""
        className="pixel pointer-events-none absolute bottom-0 right-[8%] h-[55vh] max-h-[600px] drop-shadow-[0_0_30px_rgba(0,0,0,0.6)]"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="font-display text-sm uppercase tracking-[0.4em] text-primary text-shadow-pixel">
          Batavia · 1619
        </p>
        <h1 className="mt-4 text-3xl text-primary text-shadow-pixel sm:text-5xl md:text-6xl">
          LIDAH<br />BATAVIA
        </h1>
        <p className="mt-6 max-w-xl font-mono-pixel text-xl leading-relaxed text-foreground/90 text-shadow-pixel">
          Sebuah visual novel pixel art tentang seorang pemuda Betawi yang
          mempelajari bahasa para saudagar — dan tanpa sengaja mewariskan
          kosakata yang masih kita pakai hari ini.
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row">
          {hasSave && (
            <Link
              to="/play"
              className="group relative bg-primary px-8 py-4 font-pixel text-xs text-primary-foreground transition hover:brightness-110 active:translate-y-0.5"
            >
              ▶ LANJUT BERMAIN
              <span className="absolute -bottom-2 left-0 right-0 h-2 bg-primary/40" />
            </Link>
          )}
          <Link
            to="/play"
            onClick={() => {
              if (hasSave) clear();
            }}
            className="relative bg-accent px-8 py-4 font-pixel text-xs text-accent-foreground transition hover:brightness-110 active:translate-y-0.5"
          >
            {hasSave ? "↺ MULAI BARU" : "▶ MULAI PETUALANGAN"}
            <span className="absolute -bottom-2 left-0 right-0 h-2 bg-accent/40" />
          </Link>
          <Link
            to="/dictionary"
            className="relative border-2 border-primary bg-card/80 px-8 py-4 font-pixel text-xs text-primary transition hover:bg-primary hover:text-primary-foreground active:translate-y-0.5"
          >
            📖 KAMUS ({words.size}/{total})
          </Link>
        </div>

        {words.size > 0 && (
          <button
            onClick={() => {
              if (confirm("Hapus semua progress dan kata yang dikumpulkan?")) {
                reset();
                clear();
              }
            }}
            className="mt-8 font-mono-pixel text-sm text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
          >
            Reset progress
          </button>
        )}

        <p className="mt-12 font-mono-pixel text-sm text-muted-foreground">
          Tekan <kbd className="rounded border border-border bg-card px-1.5 py-0.5 text-xs">SPACE</kbd> atau klik untuk melanjutkan dialog
        </p>
      </div>
    </div>
  );
}
