import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import scenePasar from "@/assets/scene-pasar.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — ASAL COMOT" },
    ],
  }),
  component: Login,
});

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);

  // Jika sudah login, redirect kembali ke home
  useEffect(() => {
    if (user) {
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const r = await login(u, p);
    if (!r.ok) setErr(r.error);
    else {
      navigate({ to: "/" });
    }
  }

  return (
    <div className="relative bg-background text-foreground">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
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

            <div className="mt-5 flex flex-col gap-3 text-center">
              <p className="font-mono-pixel text-sm text-muted-foreground">
                Belum punya akun? Tanya panitia untuk NIS-mu.
              </p>
              <Link to="/" className="font-mono-pixel text-base text-primary hover:underline">
                ← Kembali ke Menu Utama
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
