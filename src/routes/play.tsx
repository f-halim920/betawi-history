import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
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

function Play() {
  const navigate = useNavigate();
  const { collect } = useCollectedWords();
  const { nodeId, save, clear } = useProgress();

  const [currentId, setCurrentId] = useState<string>("start");
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [popupWord, setPopupWord] = useState<VocabWord | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from save on mount
  useEffect(() => {
    if (nodeId && DIALOGUE[nodeId]) {
      setCurrentId(nodeId);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const node: DialogueNode = DIALOGUE[currentId];
  const line = node?.lines[lineIndex];

  // Persist position
  useEffect(() => {
    if (hydrated && node && !node.end) save(currentId);
  }, [currentId, hydrated, node, save]);

  // Collect word when line appears
  useEffect(() => {
    if (line?.word) {
      collect(line.word.id);
      setPopupWord(line.word);
      const t = setTimeout(() => setPopupWord(null), 2800);
      return () => clearTimeout(t);
    }
  }, [line, collect]);

  // Typewriter
  useEffect(() => {
    if (!line) return;
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
  }, [line]);

  const advance = useCallback(() => {
    if (!node) return;
    if (isTyping) {
      setTyped(line?.text ?? "");
      setIsTyping(false);
      return;
    }
    if (lineIndex < node.lines.length - 1) {
      setLineIndex((i) => i + 1);
      return;
    }
    // End of lines
    if (node.choices && node.choices.length > 0) return;
    if (node.end) return;
    if (node.next) {
      setCurrentId(node.next);
      setLineIndex(0);
    }
  }, [node, lineIndex, isTyping, line]);

  const choose = (nextId: string) => {
    setCurrentId(nextId);
    setLineIndex(0);
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance]);

  if (!node || !line) return null;

  const showChoices =
    !isTyping && lineIndex === node.lines.length - 1 && node.choices && node.choices.length > 0;
  const isEnd = !isTyping && lineIndex === node.lines.length - 1 && node.end;

  const speakerName =
    line.speaker === "mc" ? "Sanip" : line.speaker === "merchant" ? "Tuan Van Houten" : null;
  const speakerColor =
    line.speaker === "mc"
      ? "text-betawi"
      : line.speaker === "merchant"
        ? "text-dutch"
        : "text-gold";

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-background text-foreground"
      onClick={advance}
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

      {/* Characters */}
      <div className="absolute inset-x-0 bottom-[28%] z-10 flex items-end justify-between px-4 sm:px-12">
        <img
          src={mc}
          alt="Sanip"
          className={`pixel h-[60vh] max-h-[640px] transition-all duration-300 ${
            line.speaker === "mc"
              ? "scale-105 brightness-110"
              : "scale-100 brightness-50 saturate-50"
          }`}
        />
        <img
          src={merchant}
          alt="Tuan Van Houten"
          className={`pixel h-[60vh] max-h-[640px] transition-all duration-300 ${
            line.speaker === "merchant"
              ? "scale-105 brightness-110"
              : "scale-100 brightness-50 saturate-50"
          }`}
        />
      </div>

      {/* Word popup */}
      {popupWord && (
        <div className="pointer-events-none absolute left-1/2 top-24 z-40 -translate-x-1/2 animate-float-up">
          <div className="border-4 border-gold bg-card/95 px-6 py-3 text-center shadow-2xl">
            <p className="font-pixel text-[10px] uppercase text-gold">
              ✦ Kata Baru
            </p>
            <p className="mt-2 font-pixel text-lg text-primary">
              {popupWord.original}
            </p>
            <p className="font-mono-pixel text-base text-muted-foreground">
              ({popupWord.language})
            </p>
          </div>
        </div>
      )}

      {/* Dialogue box */}
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

          {/* Choices */}
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

          {/* End buttons */}
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
    </div>
  );
}
