import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { DIALOGUE, type DialogueNode, type VocabWord } from "@/lib/game-data";
import { useCollectedWords, useProgress } from "@/lib/game-store";
import scene from "@/assets/scene-market.png";
import mc from "@/assets/char-mc.png";
import merchant from "@/assets/char-merchant.png";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Bermain — Lidah Batavia" },
      { name: "description", content: "Mainkan visual novel Lidah Batavia." },
    ],
  }),
  component: Play,
});

// World positions in % of screen width
const NPC_X = 78;
const MC_START_X = 20;
const MOVE_SPEED = 28; // % per second
const INTERACT_DISTANCE = 18; // % distance to trigger interaction prompt

type Mode = "explore" | "dialogue";

function Play() {
  const navigate = useNavigate();
  const { collect } = useCollectedWords();
  const { nodeId, save, clear } = useProgress();

  const [mode, setMode] = useState<Mode>("explore");
  const [mcX, setMcX] = useState(MC_START_X);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [walking, setWalking] = useState(false);
  const keysRef = useRef<Set<string>>(new Set());

  const [currentId, setCurrentId] = useState<string>("start");
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [popupWord, setPopupWord] = useState<VocabWord | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from save on mount — if there is a saved dialogue node, jump straight into dialogue
  useEffect(() => {
    if (nodeId && DIALOGUE[nodeId]) {
      setCurrentId(nodeId);
      setMode("dialogue");
      setMcX(NPC_X - INTERACT_DISTANCE + 4);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const node: DialogueNode | undefined = DIALOGUE[currentId];
  const line = node?.lines[lineIndex];

  // Persist dialogue position
  useEffect(() => {
    if (hydrated && mode === "dialogue" && node && !node.end) save(currentId);
  }, [currentId, hydrated, node, save, mode]);

  // Movement loop (explore mode)
  useEffect(() => {
    if (mode !== "explore") return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const keys = keysRef.current;
      let dir = 0;
      if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) dir -= 1;
      if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) dir += 1;
      if (dir !== 0) {
        setFacing(dir > 0 ? "right" : "left");
        setWalking(true);
        setMcX((x) => Math.max(4, Math.min(NPC_X - 6, x + dir * MOVE_SPEED * dt)));
      } else {
        setWalking(false);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  const distance = Math.abs(mcX - NPC_X);
  const canInteract = mode === "explore" && distance <= INTERACT_DISTANCE;

  const startDialogue = useCallback(() => {
    if (!canInteract) return;
    setMode("dialogue");
    setCurrentId("start");
    setLineIndex(0);
  }, [canInteract]);

  // Collect word when line appears
  useEffect(() => {
    if (mode !== "dialogue") return;
    if (line?.word) {
      collect(line.word.id);
      setPopupWord(line.word);
      const t = setTimeout(() => setPopupWord(null), 2800);
      return () => clearTimeout(t);
    }
  }, [line, collect, mode]);

  // Typewriter
  useEffect(() => {
    if (mode !== "dialogue" || !line) return;
    setTyped("");
    setIsTyping(true);
    let i = 0;
    const text = line.text;
    const interval = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [line, mode]);

  const advance = useCallback(() => {
    if (mode !== "dialogue" || !node) return;
    if (isTyping) {
      setTyped(line?.text ?? "");
      setIsTyping(false);
      return;
    }
    if (lineIndex < node.lines.length - 1) {
      setLineIndex((i) => i + 1);
      return;
    }
    if (node.choices && node.choices.length > 0) return;
    if (node.end) return;
    if (node.next) {
      setCurrentId(node.next);
      setLineIndex(0);
    }
  }, [node, lineIndex, isTyping, line, mode]);

  const choose = (nextId: string) => {
    setCurrentId(nextId);
    setLineIndex(0);
  };

  // Keyboard listeners
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (mode === "explore") {
        if (e.key === "e" || e.key === "E" || e.code === "Space" || e.code === "Enter") {
          if (canInteract) {
            e.preventDefault();
            startDialogue();
          }
        }
      } else {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          advance();
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [advance, mode, canInteract, startDialogue]);

  // Touch controls helpers
  const press = (key: string, down: boolean) => {
    if (down) keysRef.current.add(key);
    else keysRef.current.delete(key);
  };

  const showChoices =
    mode === "dialogue" &&
    !isTyping &&
    node &&
    line &&
    lineIndex === node.lines.length - 1 &&
    node.choices &&
    node.choices.length > 0;
  const isEnd =
    mode === "dialogue" &&
    !isTyping &&
    node &&
    line &&
    lineIndex === node.lines.length - 1 &&
    node.end;

  const speakerName =
    line?.speaker === "mc"
      ? "Sanip"
      : line?.speaker === "merchant"
        ? "Tuan Van Houten"
        : null;
  const speakerColor =
    line?.speaker === "mc"
      ? "text-betawi"
      : line?.speaker === "merchant"
        ? "text-dutch"
        : "text-gold";

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-background text-foreground"
      onClick={mode === "dialogue" ? advance : undefined}
    >
      {/* Background */}
      <img
        src={scene}
        alt=""
        className="pixel absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 vignette" />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between p-4">
        <Link
          to="/"
          onClick={(e) => e.stopPropagation()}
          className="border-2 border-primary bg-card/90 px-3 py-2 font-pixel text-[10px] text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          ← MENU
        </Link>
        <Link
          to="/dictionary"
          onClick={(e) => e.stopPropagation()}
          className="border-2 border-primary bg-card/90 px-3 py-2 font-pixel text-[10px] text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          📖 KAMUS
        </Link>
      </div>

      {/* World — characters positioned by % */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Merchant (NPC) — fixed */}
        <img
          src={merchant}
          alt="Tuan Van Houten"
          style={{ left: `${NPC_X}%` }}
          className={`pixel absolute bottom-[24%] h-[58vh] max-h-[620px] -translate-x-1/2 transition-all duration-300 ${
            mode === "dialogue" && line?.speaker === "merchant"
              ? "scale-105 brightness-110"
              : mode === "dialogue"
                ? "scale-100 brightness-50 saturate-50"
                : canInteract
                  ? "brightness-110 drop-shadow-[0_0_12px_rgba(255,200,80,0.6)]"
                  : "brightness-95"
          }`}
        />
        {/* MC — movable */}
        <img
          src={mc}
          alt="Sanip"
          style={{
            left: `${mcX}%`,
            transform: `translateX(-50%) scaleX(${facing === "right" ? 1 : -1}) translateY(${
              walking ? "-4px" : "0"
            })`,
          }}
          className={`pixel absolute bottom-[24%] h-[58vh] max-h-[620px] transition-[filter] duration-300 ${
            mode === "dialogue" && line?.speaker === "mc"
              ? "brightness-110"
              : mode === "dialogue"
                ? "brightness-50 saturate-50"
                : "brightness-105"
          }`}
        />

        {/* Interaction prompt above NPC */}
        {canInteract && (
          <div
            style={{ left: `${NPC_X}%` }}
            className="absolute bottom-[80%] -translate-x-1/2 animate-float-up"
          >
            <button
              onClick={startDialogue}
              className="pointer-events-auto border-4 border-gold bg-card/95 px-4 py-2 font-pixel text-[10px] text-gold shadow-2xl"
            >
              ▼ Tekan E untuk Bicara
            </button>
          </div>
        )}
      </div>

      {/* Word popup */}
      {popupWord && (
        <div className="pointer-events-none absolute left-1/2 top-24 z-40 -translate-x-1/2 animate-float-up">
          <div className="border-4 border-gold bg-card/95 px-6 py-3 text-center shadow-2xl">
            <p className="font-pixel text-[10px] uppercase text-gold">✦ Kata Baru</p>
            <p className="mt-2 font-pixel text-lg text-primary">{popupWord.original}</p>
            <p className="font-mono-pixel text-base text-muted-foreground">
              ({popupWord.language})
            </p>
          </div>
        </div>
      )}

      {/* Explore HUD: hint + on-screen controls */}
      {mode === "explore" && (
        <>
          <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
            <div className="border-2 border-primary bg-card/90 px-4 py-2 font-mono-pixel text-lg text-foreground shadow-xl">
              ← → / A D untuk berjalan · E untuk berinteraksi
            </div>
          </div>

          {/* Touch / mouse D-pad for mobile */}
          <div className="absolute bottom-20 left-4 z-20 flex gap-2 sm:hidden">
            <button
              onPointerDown={() => press("ArrowLeft", true)}
              onPointerUp={() => press("ArrowLeft", false)}
              onPointerLeave={() => press("ArrowLeft", false)}
              className="h-14 w-14 border-4 border-primary bg-card/90 font-pixel text-lg text-primary active:bg-primary active:text-primary-foreground"
              aria-label="Jalan ke kiri"
            >
              ←
            </button>
            <button
              onPointerDown={() => press("ArrowRight", true)}
              onPointerUp={() => press("ArrowRight", false)}
              onPointerLeave={() => press("ArrowRight", false)}
              className="h-14 w-14 border-4 border-primary bg-card/90 font-pixel text-lg text-primary active:bg-primary active:text-primary-foreground"
              aria-label="Jalan ke kanan"
            >
              →
            </button>
          </div>
          <button
            onClick={startDialogue}
            disabled={!canInteract}
            className="absolute bottom-20 right-4 z-20 h-14 w-20 border-4 border-gold bg-card/90 font-pixel text-[10px] text-gold disabled:opacity-30 active:bg-gold active:text-card sm:hidden"
            aria-label="Berinteraksi"
          >
            E
          </button>
        </>
      )}

      {/* Dialogue box */}
      {mode === "dialogue" && node && line && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6">
          <div className="relative mx-auto max-w-5xl border-4 border-primary bg-card/95 p-5 shadow-2xl backdrop-blur sm:p-6">
            {speakerName && (
              <div
                className={`absolute -top-7 left-4 border-4 border-primary bg-card px-4 py-2 font-pixel text-xs ${speakerColor}`}
              >
                {speakerName}
              </div>
            )}

            <p className="min-h-[5.5rem] font-mono-pixel text-2xl leading-relaxed text-foreground sm:text-[1.6rem]">
              {line.speaker === "narrator" ? <em>{typed}</em> : typed}
              {isTyping && <span className="ml-1 animate-blink text-primary">▊</span>}
            </p>

            {showChoices && (
              <div className="mt-4 flex flex-col gap-2">
                {node.choices!.map((c, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      choose(c.nextId);
                    }}
                    className="group border-2 border-border bg-background/60 px-4 py-3 text-left font-mono-pixel text-xl text-foreground transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <span className="mr-2 font-pixel text-[10px] text-primary group-hover:text-primary-foreground">
                      ▶
                    </span>
                    {c.text}
                  </button>
                ))}
              </div>
            )}

            {isEnd && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clear();
                    navigate({ to: "/dictionary" });
                  }}
                  className="bg-primary px-5 py-3 font-pixel text-xs text-primary-foreground transition hover:brightness-110"
                >
                  📖 LIHAT KAMUS
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clear();
                    navigate({ to: "/" });
                  }}
                  className="border-2 border-primary bg-card px-5 py-3 font-pixel text-xs text-primary transition hover:bg-primary hover:text-primary-foreground"
                >
                  ← KEMBALI KE MENU
                </button>
              </div>
            )}

            {!showChoices && !isEnd && (
              <div className="mt-3 flex justify-end font-mono-pixel text-base text-muted-foreground">
                <span className="animate-blink">
                  {isTyping ? "klik untuk skip" : "▼ klik untuk lanjut"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
