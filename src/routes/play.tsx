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
import mcLeftImg from "@/assets/char-mc-left.png";
import mcRightImg from "@/assets/char-mc-right.png";
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
const SPRITE_HEIGHT = "h-[40%] sm:h-[46%] max-h-[200px]";

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
  const mcXRef = useRef(MC_START_X);
  const walkTargetRef = useRef<number | null>(null);

  useEffect(() => {
    mcXRef.current = mcX;
  }, [mcX]);

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

  const currentMcImg = useMemo(() => {
    if (mode === "dialogue" && activeNpc) {
      const npc = NPC_BY_ID[activeNpc];
      if (npc) {
        return mcX < npc.x ? mcRightImg : mcLeftImg;
      }
    }
    if (walking) {
      return facing === "left" ? mcLeftImg : mcRightImg;
    }
    return mcImg; // front view when idle
  }, [mode, activeNpc, walking, facing, mcX]);

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
    walkTargetRef.current = null;
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
        // manual input selalu membatalkan auto-walk
        walkTargetRef.current = null;
        const nx = Math.max(MIN_X, Math.min(MAX_X, mcXRef.current + dir * MOVE_SPEED * dt));
        mcXRef.current = nx;
        setMcX(nx);
        setFacing(dir > 0 ? "right" : "left");
        setWalking(true);
        bobT += dt;
        if (bobT > 0.18) {
          bobT = 0;
          setBobFrame((f) => (f + 1) % 2);
        }
      } else if (walkTargetRef.current !== null) {
        const target = walkTargetRef.current;
        const diff = target - mcXRef.current;
        if (Math.abs(diff) <= INTERACT_DISTANCE) {
          // sudah cukup dekat — berhenti, tunggu konfirmasi (tekan E / tombol Ngobrol)
          walkTargetRef.current = null;
          setWalking(false);
          setBobFrame(0);
        } else {
          const dirSign = Math.sign(diff);
          const nx = Math.max(MIN_X, Math.min(MAX_X, mcXRef.current + dirSign * MOVE_SPEED * dt));
          mcXRef.current = nx;
          setMcX(nx);
          setFacing(dirSign > 0 ? "right" : "left");
          setWalking(true);
          bobT += dt;
          if (bobT > 0.18) {
            bobT = 0;
            setBobFrame((f) => (f + 1) % 2);
          }
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
    if (mode !== "dialogue") {
      setPopupWord(null);
      return;
    }
    if (line?.word) {
      collect(line.word.id);
      setPopupWord(line.word);
      const t = setTimeout(() => setPopupWord(null), 3000);
      return () => clearTimeout(t);
    } else {
      setPopupWord(null);
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

  const cancelDialogue = useCallback(() => {
    fadeTo(() => {
      setMode("explore");
      setActiveNpc(null);
      setLineIndex(0);
      setCurrentId("");
      clear();
    });
  }, [fadeTo, clear]);

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
        } else if (e.key === "Escape") {
          e.preventDefault();
          cancelDialogue();
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
  }, [advance, mode, nearestNpc, startDialogue, cancelDialogue]);

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
              desc="Ngobrol sama Feng (Tiongkok) dan Karsa (Kawi)."
              img={scenePasar}
              onClick={() => fadeTo(() => { setScene("pasar"); setMode("explore"); setMcX(MC_START_X); setCompletedNpcs(new Set()); })}
            />
            <SceneCard
              title="⚓ PELABUHAN"
              desc="Temui Hendrik (Belanda) dan Jafar (Arab)."
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
    <>
      {/* Overlay ini hanya muncul di layar kecil (HP) saat orientasi potrait */}
      <div className="landscape-lock fixed inset-0 z-[100] flex-col items-center justify-center gap-4 bg-background p-8 text-center">
        <span className="rotate-hint text-6xl">📱</span>
        <p className="font-pixel text-sm text-primary">Putar HP kamu ke mode LANDSCAPE untuk main, ya!</p>
      </div>
      <div className="landscape-hide flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 overflow-hidden select-none">
      <div
        className="relative overflow-hidden bg-background text-foreground shadow-2xl border-4 border-primary/20 rounded-md animate-fade-in"
        style={{
          width: "min(100vw, 133.33vh)",
          height: "min(100vh, 75vw)",
          aspectRatio: "4/3",
        }}
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
          if (activeNpc && activeNpc !== npc.id) return null;
          const isSpeaking = mode === "dialogue" && activeNpc === npc.id && line?.speaker === npc.id;
          const isActive = activeNpc === npc.id;
          const isNear = nearestNpc?.id === npc.id;
          const done = completedNpcs.has(npc.id);
          return (
            <div
              key={npc.id}
              className={`absolute -translate-x-1/2 flex flex-col items-center justify-end ${SPRITE_HEIGHT}`}
              style={{ left: `${npc.x}%`, bottom: GROUND_BOTTOM }}
            >
              {/* Name tag */}
              {mode === "explore" && (
                <div
                  className={`mb-2 border-2 px-2 py-1 font-pixel text-[8px] transition-all duration-300 ${
                    isNear
                      ? "border-gold bg-card text-gold scale-110 shadow-[0_0_8px_rgba(255,200,80,0.5)]"
                      : done
                      ? "border-gold/60 bg-card/60 text-gold/60 line-through"
                      : "border-primary bg-card/90 text-primary"
                  }`}
                >
                  {npc.name} {done ? "✓" : ""}
                </div>
              )}

              <img
                src={NPC_SPRITES[npc.id]}
                alt={npc.name}
                loading="lazy"
                className={`pixel pointer-events-auto h-full w-auto object-contain transition-all duration-300 ${
                  isSpeaking
                    ? "scale-105 brightness-110"
                    : mode !== "explore" && !isActive
                    ? "scale-95 brightness-50 saturate-50"
                    : isNear
                    ? "brightness-110 drop-shadow-[0_0_12px_rgba(255,200,80,0.7)]"
                    : "brightness-95"
                }`}
                onClick={() => {
                  if (mode !== "explore") return;
                  if (isNear) {
                    startDialogue(npc);
                  } else {
                    // MC otomatis jalan mendekat, berhenti dulu untuk konfirmasi
                    walkTargetRef.current = npc.x;
                  }
                }}
              />
            </div>
          );
        })}

        <img
          src={currentMcImg}
          alt="Chaer"
          style={{
            left: `${mcX}%`,
            bottom: GROUND_BOTTOM,
            transform: `translateX(-50%) translateY(${bobOffset}px)`,
          }}
          className={`pixel absolute ${SPRITE_HEIGHT} transition-[filter] duration-300 ${
            mode === "dialogue" && line?.speaker === "mc" ? "brightness-110" : mode !== "explore" ? "brightness-90" : "brightness-105"
          }`}
        />
      </div>

      {/* Word popup */}
      {popupWord && (
        <div className="pointer-events-none absolute left-1/2 top-12 sm:top-20 z-40 -translate-x-1/2 animate-float-up">
          <div className="border-4 border-gold bg-card/95 px-6 py-3 text-center shadow-2xl">
            <p className="font-pixel text-[10px] uppercase text-gold">✦ Kata Baru Terbuka</p>
            <p className="mt-2 font-pixel text-lg text-primary">{popupWord.original}</p>
            <p className="font-mono-pixel text-base text-muted-foreground">({popupWord.language})</p>
          </div>
        </div>
      )}

      {/* Explore HUD / Interaction Prompt */}
      {mode === "explore" && (
        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
          {nearestNpc ? (
            <button
              onClick={() => startDialogue(nearestNpc)}
              className="pointer-events-auto whitespace-nowrap border-4 border-gold bg-card/95 px-4 py-2 font-pixel text-[9px] sm:text-xs text-gold shadow-2xl hover:bg-gold hover:text-card active:scale-95 transition-all duration-150 animate-float-up"
            >
              ▼ <span className="hidden sm:inline">Tekan E / Klik</span><span className="inline sm:hidden">TAP</span> — Ngobrol sama {nearestNpc.name}
            </button>
          ) : (
            <div className="hidden sm:block pointer-events-none whitespace-nowrap border-2 border-primary bg-card/90 px-3 py-1.5 font-mono-pixel text-sm text-foreground shadow-xl sm:text-base">
              ← → / A D untuk jalan · E / klik karakter untuk ngobrol
            </div>
          )}
        </div>
      )}

      {/* Dialogue box */}
      {mode === "dialogue" && node && line && (
        <div className="absolute bottom-1 left-0 right-0 z-20 px-1.5 sm:px-4">
          <div className="relative mx-auto max-w-3xl border-2 border-primary bg-card/95 px-2 py-0.5 shadow-2xl backdrop-blur sm:border-4 sm:px-4 sm:py-2">
            {speakerName && (
              <div className={`absolute -top-4 left-3 border-2 border-primary bg-card px-1.5 py-0 font-pixel text-[7px] sm:-top-5 sm:left-4 sm:border-4 sm:px-2 sm:py-0.5 sm:text-[10px] ${speakerColor}`}>
                {speakerName}
              </div>
            )}
            
            <button
              onClick={(e) => { e.stopPropagation(); cancelDialogue(); }}
              className="absolute -top-4 right-3 border-2 border-primary bg-card px-1.5 py-0 font-pixel text-[7px] text-destructive hover:bg-destructive hover:text-destructive-foreground sm:-top-5 sm:right-4 sm:border-4 sm:px-2 sm:py-0.5 sm:text-[9px]"
            >
              🚪 KELUAR
            </button>
            <p className="min-h-[1.1rem] font-mono-pixel text-[11px] leading-snug text-foreground sm:min-h-[2rem] sm:text-lg">
              {line.speaker === "narrator" ? <em>{typed}</em> : typed}
              {isTyping && <span className="ml-1 animate-blink text-primary">▊</span>}
            </p>

            {showChoices && (
              <div className="mt-1 flex flex-col gap-1 sm:mt-2 sm:gap-1.5">
                {node.choices!.map((c, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); choose(c.nextId); }}
                    className="group border-2 border-border bg-background/60 px-1.5 py-1 text-left font-mono-pixel text-[11px] text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground sm:px-2.5 sm:py-1.5 sm:text-lg"
                  >
                    <span className="mr-1.5 font-pixel text-[8px] text-primary group-hover:text-primary-foreground sm:mr-2 sm:text-[9px]">▶</span>
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
              <div className="mt-0.5 flex justify-end font-mono-pixel text-[9px] text-muted-foreground sm:mt-1 sm:text-sm">
                <span className="animate-blink">
                  {isTyping ? "tap skip" : "▼ tap / SPACE lanjut"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUIZ overlay */}
      {mode === "quiz" && node?.quiz && (
        <div className="absolute inset-0 z-30 flex items-end justify-center bg-background/40 backdrop-blur-sm sm:items-center">
          <div className="m-1.5 w-full max-w-2xl border-2 border-gold bg-card/95 p-2 shadow-2xl animate-float-up sm:m-3 sm:border-4 sm:p-6">
            <p className="font-pixel text-[7px] uppercase tracking-widest text-gold sm:text-[10px]">✦ QUIZ KOSAKATA</p>
            <h3 className="mt-1 font-pixel text-[11px] text-primary sm:mt-3 sm:text-xl">{node.quiz.question}</h3>
            <div className="mt-2 flex flex-col gap-1 sm:mt-5 sm:gap-2">
              {node.quiz.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answerQuiz(opt)}
                  className="group border-2 border-border bg-background/60 px-2 py-1.5 text-left font-mono-pixel text-[11px] text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground sm:px-4 sm:py-3 sm:text-xl"
                >
                  <span className="mr-1.5 font-pixel text-[8px] text-gold group-hover:text-primary-foreground sm:mr-2 sm:text-[10px]">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
            <p className="mt-1.5 font-mono-pixel text-[9px] text-muted-foreground sm:mt-4 sm:text-base">
              💡 Tidak masalah salah — Chaer tetap belajar.
            </p>
          </div>
        </div>
      )}

        {/* Mobile D-pad — di dalam frame (pojok kiri-bawah), tampil berdasarkan touchscreen
            (bukan lebar layar) supaya tetap terlihat walau HP diputar ke landscape */}
        <div
          className={`absolute bottom-3 left-3 z-40 hidden gap-3 [@media(pointer:coarse)]:flex touch-none select-none transition-opacity duration-200 ${
            mode !== "explore" ? "invisible pointer-events-none" : "opacity-90"
          }`}
        >
          <button
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); press("ArrowLeft", true); }}
            onPointerUp={(e) => { e.stopPropagation(); e.currentTarget.releasePointerCapture(e.pointerId); press("ArrowLeft", false); }}
            onPointerCancel={() => press("ArrowLeft", false)}
            className="flex h-12 w-16 items-center justify-center border-4 border-primary bg-card/90 font-pixel text-xl text-primary active:bg-primary active:text-primary-foreground"
          >
            ◀
          </button>
          <button
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); press("ArrowRight", true); }}
            onPointerUp={(e) => { e.stopPropagation(); e.currentTarget.releasePointerCapture(e.pointerId); press("ArrowRight", false); }}
            onPointerCancel={() => press("ArrowRight", false)}
            className="flex h-12 w-16 items-center justify-center border-4 border-primary bg-card/90 font-pixel text-xl text-primary active:bg-primary active:text-primary-foreground"
          >
            ▶
          </button>
        </div>

        <FadeOverlay active={fade} />
      </div>
      </div>
    </>
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
