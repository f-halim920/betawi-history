import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  const { user, logout, ready } = useAuth();
  const navigate = useNavigate();
  const { words } = useCollectedWords();
  const total = Object.keys(VOCABULARY).length;

  function tryStart() {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    navigate({ to: "/play" });
  }

  return (
    <div className="relative bg-background text-foreground">
      {user && (
        <div className="absolute right-4 top-4 z-50">
          <button
            onClick={logout}
            className="border-2 border-primary bg-card/80 px-3 py-2 font-pixel text-[10px] text-primary transition hover:border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            LOGOUT
          </button>
        </div>
      )}
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
            Batavia · 1619
          </p>
          <h1 className="mt-3 font-pixel text-4xl text-primary text-shadow-pixel sm:text-6xl">
            ASAL COMOT
          </h1>
          <h2 className="mt-6 font-pixel text-xl text-primary text-shadow-pixel sm:text-2xl">
            SELAMAT DATANG{user ? `, ${user.username.toUpperCase()}` : ""}
          </h2>
          <p className="mt-3 font-mono-pixel text-xl text-foreground/90 text-shadow-pixel">
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
                4 kategori bahasa serapan: Belanda, Tiongkok, Kawi, Arab.
              </p>
              <p className="mt-3 font-mono-pixel text-base text-muted-foreground">
                Terkumpul: <span className="font-pixel text-[10px] text-primary">{words.size}/{total}</span>
              </p>
            </button>
          </div>
          <p className="mt-8 font-mono-pixel text-sm text-muted-foreground">
            {ready ? null : "memuat..."}
          </p>
        </div>
      </section>
    </div>
  );
}
