import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  DIALOGUE,
  NPCS,
  NPC_BY_ID,
  type DialogueNode,
  type Npc,
  type NpcId,
  type Scene,
  type VocabWord,
  type QuizOption,
} from "@/lib/game-data";
import {
  useCollectedWords,
  useProgress,
  useScene,
  useIntroSeen,
} from "@/lib/game-store";
import { useAuth } from "@/lib/auth";

import scenePasar from "@/assets/scene-pasar.jpg";
import scenePelabuhan from "@/assets/scene-pelabuhan.jpg";
import mcImg from "@/assets/char-mc.png";
import jafarImg from "@/assets/char-jafar.png";
import fengImg from "@/assets/char-feng.png";
import karsaImg from "@/assets/char-karsa.png";
import hendrikImg from "@/assets/char-hendrik.png";
import thomasImg from "@/assets/char-thomas.png";
import joaoImg from "@/assets/char-joao.png";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Bermain — ASAL COMOT" },
      { name: "description", content: "Mainkan ASAL COMOT — visual novel kosakata Betawi." },
    ],
  }),
  component: Play,
});

const NPC_SPRITES: Record<NpcId, string> = {
  jafar: jafarImg,
  feng: fengImg,
  karsa: karsaImg,
  hendrik: hendrikImg,
  thomas: thomasImg,
  joao: joaoImg,
};

const SCENE_BG: Record<Scene, string> = {
  pasar: scenePasar,
  pelabuhan: scenePelabuhan,
};

const SCENE_LABEL: Record<Scene, string> = {
  pasar: "🏪 PASAR",
  pelabuhan: "⚓ PELABUHAN",
};

const MC_START_X = 50;
const MOVE_SPEED = 28;
const INTERACT_DISTANCE = 10;
const MIN_X = 4;
const MAX_X = 96;
const GROUND_BOTTOM = "5%";
const SPRITE_HEIGHT = "h-[22vh] sm:h-[32vh] max-h-[300px]";

type Mode = "intro" | "scene-select" | "explore" | "dialogue" | "quiz" | "transition";

function Play() {
  const navigate = useNavigate();
  const { user, ready: authReady } = useAuth();
  const { collect } = useCollectedWords();
  const { save, clear } = useProgress();
  const { scene, setScene } = useScene();
  const { seen: introSeen, markSeen } = useIntroSeen();

  // Redirect if not logged in
  useEffect(() => {
    if (authReady && !user) navigate({ to: "/" });
  }, [authReady, user, navigate]);

  const [mode, setMode] = useState<Mode>("intro");
  const [fade, setFade] = useState(false);
  const [mcX, setMcX] = useState(MC_START_X);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [walking, setWalking] = useState(false);
  const [bobFrame, setBobFrame] = useState(0);
  const keysRef = useRef<Set<string>>(new Set());

  const [activeNpc, setActiveNpc] = useState<NpcId | null>(null);
  const [currentId, setCurrentId] = useState<string>("");
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [popupWord, setPopupWord] = useState<VocabWord | null>(null);
  const [completedNpcs, setCompletedNpcs] = useState<Set<NpcId>>(new Set());

  // Init: skip intro if already seen, restore scene
  useEffect(() => {
    if (introSeen) {
      setMode(scene ? "explore" : "scene-select");
    }
  }, [introSeen, scene]);

  const sceneNpcs = useMemo(
    () => (scene ? NPCS.filter((n) => n.scene === scene) : []),
    [scene],
  );

  const node: DialogueNode | undefined = DIALOGUE[currentId];
  const line = node?.lines?.[lineIndex];

  // Persist
  useEffect(() => {
    if (mode === "dialogue" && node && !node.end) save(currentId);
  }, [currentId, node, save, mode]);

  // Nearest NPC
  const nearestNpc: Npc | null = useMemo(() => {
    if (mode !== "explore") return null;
    let best: Npc | null = null;
    let bestD = Infinity;
    for (const npc of sceneNpcs) {
      const d = Math.abs(mcX - npc.x);
      if (d <= INTERACT_DISTANCE && d < bestD) {
        best = npc;
        bestD = d;
      }
    }
    return best;
  }, [mcX, mode, sceneNpcs]);

  // Movement
  useEffect(() => {
    if (mode !== "explore") return;
    let raf = 0;
    let last = performance.now();
    let bobT = 0;
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
        setMcX((x) => Math.max(MIN_X, Math.min(MAX_X, x + dir * MOVE_SPEED * dt)));
        bobT += dt;
        if (bobT > 0.18) {
          bobT = 0;
          setBobFrame((f) => (f + 1) % 2);
        }
      } else {
        setWalking(false);
        setBobFrame(0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  const startDialogue = useCallback((npc: Npc | null) => {
    if (!npc) return;
    setActiveNpc(npc.id);
    setCurrentId(npc.startNodeId);
    setLineIndex(0);
    setMode("dialogue");
  }, []);

  // Collect word
  useEffect(() => {
    if (mode === "explore" || mode === "scene-select") {
      setPopupWord(null);
      return;
    }
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
    const it = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(it);
        setIsTyping(false);
      }
    }, 22);
    return () => clearInterval(it);
  }, [line, mode]);

  const fadeTo = useCallback((cb: () => void) => {
    setFade(true);
    setTimeout(() => {
      cb();
      setTimeout(() => setFade(false), 50);
    }, 350);
  }, []);

  const endDialogueExit = useCallback(() => {
    if (!activeNpc) return;
    const next = new Set(completedNpcs);
    next.add(activeNpc);
    setCompletedNpcs(next);
    clear();

    // Cek apakah semua NPC di scene sudah selesai
    const allDone = sceneNpcs.every((n) => next.has(n.id));
    if (allDone) {
      fadeTo(() => {
        setScene(null);
        setActiveNpc(null);
        navigate({ to: "/" });
      });
    } else {
      fadeTo(() => {
        setMode("explore");
        setActiveNpc(null);
      });
    }
  }, [activeNpc, completedNpcs, sceneNpcs, clear, fadeTo, navigate, setScene]);

  const advance = useCallback(() => {
    if (mode !== "dialogue" || !node) return;
    if (isTyping) {
      setTyped(line?.text ?? "");
      setIsTyping(false);
      return;
    }
    const lines = node.lines ?? [];
    if (lineIndex < lines.length - 1) {
      setLineIndex((i) => i + 1);
      return;
    }
    // sudah baris terakhir
    if (node.quiz) {
      setMode("quiz");
      return;
    }
    if (node.choices?.length) return;
    if (node.end) return;
    if (node.next) {
      setCurrentId(node.next);
      setLineIndex(0);
      // jika next node punya quiz tanpa lines, langsung switch
      const nx = DIALOGUE[node.next];
      if (nx?.quiz && (!nx.lines || nx.lines.length === 0)) {
        setMode("quiz");
      }
    }
  }, [node, lineIndex, isTyping, line, mode]);

  // Auto-enter quiz mode jika node baru hanya berisi quiz
  useEffect(() => {
    if (mode === "dialogue" && node && (!node.lines || node.lines.length === 0) && node.quiz) {
      setMode("quiz");
    }
  }, [mode, node]);

  const answerQuiz = (opt: QuizOption) => {
    setCurrentId(opt.next);
    setLineIndex(0);
    setMode("dialogue");
  };

  const choose = (nextId: string) => {
    setCurrentId(nextId);
    setLineIndex(0);
  };

  // Keyboard
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (mode === "explore") {
        if (e.key === "e" || e.key === "E" || e.code === "Space" || e.code === "Enter") {
          if (nearestNpc) {
            e.preventDefault();
            startDialogue(nearestNpc);
          }
        }
      } else if (mode === "dialogue") {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          advance();
        }
      }
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [advance, mode, nearestNpc, startDialogue]);

  const press = (k: string, down: boolean) => {
    if (down) keysRef.current.add(k);
    else keysRef.current.delete(k);
  };

  // ============ RENDER ============

  if (!authReady || !user) {
    return <div className="grid min-h-screen place-items-center font-mono-pixel text-xl">Memuat...</div>;
  }

  // INTRO / OPENING POPUP
  if (mode === "intro") {
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background p-4">
        <img src={scenePasar} alt="" className="pixel absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="relative z-10 w-full max-w-2xl border-4 border-primary bg-card/95 p-6 shadow-2xl backdrop-blur sm:p-8">
          <p className="font-pixel text-[10px] uppercase tracking-widest text-gold">✦ Selamat datang di ASAL COMOT</p>
          <h2 className="mt-3 font-pixel text-xl text-primary sm:text-2xl">Selamat pagi! Gue Chaer.</h2>
          <p className="mt-5 font-mono-pixel text-xl leading-relaxed text-foreground">
            Hari ini adalah hari yang indah di Batavia. Gue mau pergi ngobrol sama orang-orang deh.
            Mending ke mana dulu?
          </p>
          <p className="mt-4 font-mono-pixel text-lg text-muted-foreground">
            <strong className="text-betawi">Tips:</strong> Setiap karakter punya 5 kosakata yang akan kamu pelajari lewat quiz.
            Jawab benar atau salah, kamu tetap dapat penjelasannya — kosakata baru otomatis tersimpan di Kamus.
          </p>
          <button
            onClick={() => {
              markSeen();
              setMode("scene-select");
            }}
            className="mt-6 w-full bg-primary px-5 py-3 font-pixel text-xs text-primary-foreground hover:brightness-110"
          >
            ▶ MULAI
          </button>
        </div>
      </div>
    );
  }

  // SCENE SELECTOR
  if (mode === "scene-select") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2">
          <img src={scenePasar} alt="" className="pixel h-full w-full object-cover opacity-50" />
          <img src={scenePelabuhan} alt="" className="pixel h-full w-full object-cover opacity-50" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/30 to-background" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-12 text-center">
          <Link
            to="/"
            className="mb-6 self-start border-2 border-primary bg-card/80 px-3 py-2 font-pixel text-[10px] text-primary hover:bg-primary hover:text-primary-foreground"
          >
            ← HOME
          </Link>
          <p className="font-display text-xs uppercase tracking-[0.4em] text-primary text-shadow-pixel">
            Pilih Tempat
          </p>
          <h2 className="mt-3 font-pixel text-2xl text-primary text-shadow-pixel sm:text-3xl">
            MAU KE MANA, CHAER?
          </h2>

          <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
            <SceneCard
              title="🏪 PASAR"
              desc="Ngobrol sama Jafar (Arab), Feng (Tiongkok), dan Karsa (Kawi)."
              img={scenePasar}
              onClick={() => fadeTo(() => { setScene("pasar"); setMode("explore"); setMcX(MC_START_X); setCompletedNpcs(new Set()); })}
            />
            <SceneCard
              title="⚓ PELABUHAN"
              desc="Temui Hendrik (Belanda), Sir Thomas (Inggris), dan João (Portugis)."
              img={scenePelabuhan}
              onClick={() => fadeTo(() => { setScene("pelabuhan"); setMode("explore"); setMcX(MC_START_X); setCompletedNpcs(new Set()); })}
            />
          </div>
        </div>

        <FadeOverlay active={fade} />
      </div>
    );
  }

  // EXPLORE / DIALOGUE / QUIZ
  const bg = scene ? SCENE_BG[scene] : scenePasar;
  const speakerName =
    line?.speaker === "mc"
      ? "Chaer"
      : line?.speaker === "narrator"
      ? null
      : line?.speaker ? NPC_BY_ID[line.speaker as NpcId]?.name : null;
  const speakerColor =
    line?.speaker === "mc"
      ? "text-betawi"
      : line?.speaker === "narrator"
      ? "text-gold"
      : line?.speaker ? NPC_BY_ID[line.speaker as NpcId]?.colorClass ?? "text-dutch" : "text-dutch";

  const bobOffset = walking ? (bobFrame === 0 ? -3 : 0) : 0;
  const showChoices = mode === "dialogue" && !isTyping && node?.choices?.length;
  const isEnd = mode === "dialogue" && !isTyping && node?.end && lineIndex === (node.lines?.length ?? 0) - 1;

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-background text-foreground"
      onClick={mode === "dialogue" ? advance : undefined}
    >
      <img src={bg} alt="" className="pixel absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 vignette" />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between gap-2 p-3 sm:p-4">
        <button
          onClick={(e) => { e.stopPropagation(); fadeTo(() => { setScene(null); setMode("scene-select"); }); }}
          className="border-2 border-primary bg-card/90 px-3 py-2 font-pixel text-[10px] text-primary hover:bg-primary hover:text-primary-foreground"
        >
          ← TEMPAT
        </button>
        <p className="hidden font-pixel text-[10px] text-primary text-shadow-pixel sm:block sm:text-xs">
          {scene ? SCENE_LABEL[scene] : ""}  · {completedNpcs.size}/{sceneNpcs.length} selesai
        </p>
        <Link
          to="/dictionary"
          onClick={(e) => e.stopPropagation()}
          className="border-2 border-primary bg-card/90 px-3 py-2 font-pixel text-[10px] text-primary hover:bg-primary hover:text-primary-foreground"
        >
          📖 KAMUS
        </Link>
      </div>

      {/* World */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {sceneNpcs.map((npc) => {
          const isSpeaking = mode === "dialogue" && activeNpc === npc.id && line?.speaker === npc.id;
          const isActive = activeNpc === npc.id;
          const isNear = nearestNpc?.id === npc.id;
          const done = completedNpcs.has(npc.id);
          return (
            <div key={npc.id}>
              <img
                src={NPC_SPRITES[npc.id]}
                alt={npc.name}
                loading="lazy"
                style={{ left: `${npc.x}%`, bottom: GROUND_BOTTOM }}
                className={`pixel absolute ${SPRITE_HEIGHT} -translate-x-1/2 transition-all duration-300 ${
                  isSpeaking
                    ? "scale-105 brightness-110"
                    : mode !== "explore" && !isActive
                    ? "scale-95 brightness-50 saturate-50"
                    : isNear
                    ? "brightness-110 drop-shadow-[0_0_12px_rgba(255,200,80,0.7)]"
                    : "brightness-95"
                }`}
              />
              {/* Name tag */}
              {mode === "explore" && (
                <div
                  style={{ left: `${npc.x}%`, bottom: `calc(${GROUND_BOTTOM} + 30vh)` }}
                  className="absolute -translate-x-1/2"
                >
                  <div className={`border-2 ${done ? "border-gold/60 bg-card/60" : "border-primary bg-card/90"} px-2 py-1 font-pixel text-[8px] ${done ? "text-gold/60 line-through" : "text-primary"}`}>
                    {npc.name} {done ? "✓" : ""}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <img
          src={mcImg}
          alt="Chaer"
          style={{
            left: `${mcX}%`,
            bottom: GROUND_BOTTOM,
            transform: `translateX(-50%) scaleX(${facing === "right" ? 1 : -1}) translateY(${bobOffset}px)`,
          }}
          className={`pixel absolute ${SPRITE_HEIGHT} transition-[filter] duration-300 ${
            mode === "dialogue" && line?.speaker === "mc" ? "brightness-110" : mode !== "explore" ? "brightness-90" : "brightness-105"
          }`}
        />

        {nearestNpc && mode === "explore" && (
          <div
            style={{ left: `${nearestNpc.x}%`, bottom: `calc(${GROUND_BOTTOM} + 28vh)` }}
            className="absolute -translate-x-1/2 animate-float-up"
          >
            <button
              onClick={() => startDialogue(nearestNpc)}
              className="pointer-events-auto border-4 border-gold bg-card/95 px-4 py-2 font-pixel text-[10px] text-gold shadow-2xl"
            >
              ▼ Tekan E — Ngobrol sama {nearestNpc.name}
            </button>
          </div>
        )}
      </div>

      {/* Word popup */}
      {popupWord && (
        <div className="pointer-events-none absolute left-1/2 top-20 z-40 -translate-x-1/2 animate-float-up">
          <div className="border-4 border-gold bg-card/95 px-6 py-3 text-center shadow-2xl">
            <p className="font-pixel text-[10px] uppercase text-gold">✦ Kata Baru Terbuka</p>
            <p className="mt-2 font-pixel text-lg text-primary">{popupWord.original}</p>
            <p className="font-mono-pixel text-base text-muted-foreground">({popupWord.language})</p>
          </div>
        </div>
      )}

      {/* Explore HUD */}
      {mode === "explore" && (
        <>
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 sm:block">
            <div className="whitespace-nowrap border-2 border-primary bg-card/90 px-3 py-1.5 font-mono-pixel text-sm text-foreground shadow-xl sm:text-base">
              ← → / A D untuk jalan · E / klik karakter untuk ngobrol
            </div>
          </div>
          <div className="absolute bottom-6 left-4 z-20 flex gap-2 sm:hidden">
            <button
              onPointerDown={() => press("ArrowLeft", true)}
              onPointerUp={() => press("ArrowLeft", false)}
              onPointerLeave={() => press("ArrowLeft", false)}
              className="h-14 w-14 border-4 border-primary bg-card/90 font-pixel text-lg text-primary active:bg-primary active:text-primary-foreground"
            >
              ←
            </button>
            <button
              onPointerDown={() => press("ArrowRight", true)}
              onPointerUp={() => press("ArrowRight", false)}
              onPointerLeave={() => press("ArrowRight", false)}
              className="h-14 w-14 border-4 border-primary bg-card/90 font-pixel text-lg text-primary active:bg-primary active:text-primary-foreground"
            >
              →
            </button>
          </div>
          <button
            onClick={() => startDialogue(nearestNpc)}
            disabled={!nearestNpc}
            className="absolute bottom-6 right-4 z-20 h-14 w-20 border-4 border-gold bg-card/90 font-pixel text-[10px] text-gold disabled:opacity-30 active:bg-gold active:text-card sm:hidden"
          >
            E
          </button>
        </>
      )}

      {/* Dialogue box */}
      {mode === "dialogue" && node && line && (
        <div className="absolute bottom-2 left-0 right-0 z-20 px-2 sm:px-4">
          <div className="relative mx-auto max-w-4xl border-4 border-primary bg-card/95 px-4 py-2 shadow-2xl backdrop-blur sm:px-5 sm:py-3">
            {speakerName && (
              <div className={`absolute -top-6 left-4 border-4 border-primary bg-card px-3 py-1 font-pixel text-[10px] sm:text-xs ${speakerColor}`}>
                {speakerName}
              </div>
            )}
            <p className="min-h-[2.5rem] font-mono-pixel text-lg leading-relaxed text-foreground sm:text-xl">
              {line.speaker === "narrator" ? <em>{typed}</em> : typed}
              {isTyping && <span className="ml-1 animate-blink text-primary">▊</span>}
            </p>

            {showChoices && (
              <div className="mt-2 flex flex-col gap-2">
                {node.choices!.map((c, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); choose(c.nextId); }}
                    className="group border-2 border-border bg-background/60 px-3 py-2 text-left font-mono-pixel text-lg text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground sm:text-xl"
                  >
                    <span className="mr-2 font-pixel text-[10px] text-primary group-hover:text-primary-foreground">▶</span>
                    {c.text}
                  </button>
                ))}
              </div>
            )}

            {isEnd && (
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); endDialogueExit(); }}
                  className="bg-primary px-4 py-2 font-pixel text-[10px] text-primary-foreground hover:brightness-110 sm:text-xs"
                >
                  ✦ LANJUT
                </button>
                <Link
                  to="/dictionary"
                  onClick={(e) => e.stopPropagation()}
                  className="border-2 border-primary bg-card px-4 py-2 font-pixel text-[10px] text-primary hover:bg-primary hover:text-primary-foreground sm:text-xs"
                >
                  📖 KAMUS
                </Link>
              </div>
            )}

            {!showChoices && !isEnd && (
              <div className="mt-1 flex justify-end font-mono-pixel text-xs text-muted-foreground sm:text-sm">
                <span className="animate-blink">
                  {isTyping ? "klik untuk skip" : "▼ klik / SPACE untuk lanjut"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUIZ overlay */}
      {mode === "quiz" && node?.quiz && (
        <div className="absolute inset-0 z-30 flex items-end justify-center bg-background/40 backdrop-blur-sm sm:items-center">
          <div className="m-3 w-full max-w-2xl border-4 border-gold bg-card/95 p-6 shadow-2xl animate-float-up">
            <p className="font-pixel text-[10px] uppercase tracking-widest text-gold">✦ QUIZ KOSAKATA</p>
            <h3 className="mt-3 font-pixel text-lg text-primary sm:text-xl">{node.quiz.question}</h3>
            <div className="mt-5 flex flex-col gap-2">
              {node.quiz.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answerQuiz(opt)}
                  className="group border-2 border-border bg-background/60 px-4 py-3 text-left font-mono-pixel text-xl text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <span className="mr-2 font-pixel text-[10px] text-gold group-hover:text-primary-foreground">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
            <p className="mt-4 font-mono-pixel text-base text-muted-foreground">
              💡 Tidak masalah salah — Chaer tetap belajar dari penjelasan karakter.
            </p>
          </div>
        </div>
      )}

      <FadeOverlay active={fade} />
    </div>
  );
}

function SceneCard({ title, desc, img, onClick }: { title: string; desc: string; img: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden border-4 border-primary bg-card text-left transition hover:border-gold hover:shadow-2xl"
    >
      <img src={img} alt="" className="pixel h-48 w-full object-cover transition group-hover:scale-105" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-card via-card/90 to-transparent p-4">
        <h3 className="font-pixel text-lg text-primary">{title}</h3>
        <p className="mt-2 font-mono-pixel text-base text-foreground/90">{desc}</p>
      </div>
    </button>
  );
}

function FadeOverlay({ active }: { active: boolean }) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 bg-background transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
