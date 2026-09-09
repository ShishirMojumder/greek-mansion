"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Gift, RotateCcw, Star, Trophy } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type GameState = "ready" | "playing" | "finished";
type ScoreEntry = { user: string; score: number; createdAt: string };

const ROUND_SECONDS = 10;
const MAX_REASONABLE_SCORE = 300;
const STORAGE_KEY = "greek-mansion-tap-scores";

const sampleScores: ScoreEntry[] = [
  { user: "Alex", score: 102, createdAt: "sample" },
  { user: "Sofia", score: 95, createdAt: "sample" },
  { user: "Liam", score: 90, createdAt: "sample" },
];

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function rewardPoints(score: number) {
  if (score >= 80) return 5;
  if (score >= 60) return 4;
  if (score >= 40) return 3;
  if (score >= 20) return 2;
  return 1;
}

export default function TapChallenge() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const endTime = useRef(0);
  const scoreRef = useRef(0);
  const finished = useRef(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(stored)) {
        setScores(stored.filter((entry): entry is ScoreEntry =>
          typeof entry?.user === "string" && Number.isInteger(entry?.score) && entry.score >= 0 && entry.score <= MAX_REASONABLE_SCORE && typeof entry?.createdAt === "string"
        ));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const finishRound = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const finalScore = Math.max(0, Math.min(MAX_REASONABLE_SCORE, Math.floor(scoreRef.current)));
    setTimeLeft(0);
    setScore(finalScore);
    setGameState("finished");

    const entry: ScoreEntry = { user: "You", score: finalScore, createdAt: new Date().toISOString() };
    setScores(previous => {
      const today = dayKey(new Date());
      const withoutOlderPersonalBest = previous.filter(item => item.user !== "You" || dayKey(new Date(item.createdAt)) !== today);
      const previousBest = previous
        .filter(item => item.user === "You" && dayKey(new Date(item.createdAt)) === today)
        .reduce((best, item) => Math.max(best, item.score), 0);
      const next = [...withoutOlderPersonalBest, { ...entry, score: Math.max(previousBest, finalScore) }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const tick = () => {
      const remaining = Math.max(0, endTime.current - Date.now());
      setTimeLeft(Math.ceil(remaining / 1000));
      if (remaining <= 0) finishRound();
    };
    tick();
    const timer = window.setInterval(tick, 100);
    return () => window.clearInterval(timer);
  }, [finishRound, gameState]);

  const startGame = () => {
    if (gameState === "playing") return;
    scoreRef.current = 0;
    finished.current = false;
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    endTime.current = Date.now() + ROUND_SECONDS * 1000;
    setGameState("playing");
  };

  const resetGame = () => {
    finished.current = true;
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setGameState("ready");
  };

  const tapFood = (button: HTMLButtonElement) => {
    if (gameState !== "playing" || Date.now() >= endTime.current) {
      if (gameState === "playing") finishRound();
      return;
    }
    scoreRef.current += 1;
    setScore(scoreRef.current);
    button.animate(
      [{ transform: "scale(1)" }, { transform: "scale(.965)" }, { transform: "scale(1)" }],
      { duration: 90, easing: "ease-out" }
    );
  };

  const handleFoodPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    tapFood(event.currentTarget);
  };

  const handleFoodKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    tapFood(event.currentTarget);
  };

  const leaderboard = useMemo(() => {
    const today = dayKey(new Date());
    const todaysScores = scores.filter(item => !Number.isNaN(new Date(item.createdAt).getTime()) && dayKey(new Date(item.createdAt)) === today);
    const bestByUser = new Map<string, ScoreEntry>();
    [...sampleScores, ...todaysScores].forEach(entry => {
      const current = bestByUser.get(entry.user);
      if (!current || entry.score > current.score) bestByUser.set(entry.user, entry);
    });
    return [...bestByUser.values()].sort((a, b) => b.score - a.score).slice(0, 10);
  }, [scores]);

  const points = gameState === "finished" ? rewardPoints(score) : 0;

  return <div className="mx-auto w-full max-w-[760px] px-4 py-10 sm:px-6 md:py-16">
    <header className="text-center">
      <p className="eyebrow">Greek Mansion games</p>
      <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-navy sm:text-5xl">10-Second Tap Challenge</h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-ink/60 sm:text-base">Tap the gyro as many times as you can in 10 seconds.</p>
    </header>

    <section className="mt-8 overflow-hidden rounded-[30px] border border-navy/10 bg-white p-5 shadow-xl shadow-navy/10 sm:p-8" aria-labelledby="game-status">
      {gameState === "finished" && <div className="mb-5 text-center" aria-live="assertive"><p className="eyebrow !text-gold">Time&apos;s Up!</p><h2 id="game-status" className="mt-2 font-serif text-3xl font-bold text-navy">Your Score: {score}</h2></div>}

      <div className="grid grid-cols-2 gap-3" aria-live="polite">
        <div className="rounded-2xl bg-marble p-4 text-center"><Clock3 className="mx-auto text-navy" aria-hidden/><p className="mt-2 text-xs uppercase tracking-[.15em] text-ink/50">Time left</p><p className="mt-1 font-serif text-4xl font-bold tabular-nums text-navy">00:{String(timeLeft).padStart(2, "0")}</p></div>
        <div className="rounded-2xl bg-marble p-4 text-center"><Trophy className="mx-auto text-navy" aria-hidden/><p className="mt-2 text-xs uppercase tracking-[.15em] text-ink/50">Score</p><p className="mt-1 font-serif text-4xl font-bold tabular-nums text-navy">{score}</p></div>
      </div>

      <button type="button" onPointerDown={handleFoodPointerDown} onKeyDown={handleFoodKeyDown} disabled={gameState !== "playing"} aria-label={gameState === "playing" ? "Tap the gyro to score" : "Start the game before tapping the gyro"} className="focus-ring mx-auto mt-7 block aspect-square w-full max-w-[330px] select-none overflow-hidden rounded-full border-[10px] border-sky-200 bg-navy shadow-lg shadow-navy/20 disabled:cursor-default" style={{touchAction:"none",WebkitUserSelect:"none"}}>
        <span className="relative block h-full w-full pointer-events-none"><Image src="/images/real-food/greekmansion-gyrowrap-native.jpg" alt="Greek Mansion gyro wrap" fill priority draggable={false} className="select-none object-cover" sizes="330px"/></span>
      </button>
      <p className="mt-3 text-center font-serif text-lg italic text-navy">{gameState === "playing" ? "Tap the gyro!" : gameState === "finished" ? `You earned ${points} reward point${points === 1 ? "" : "s"}.` : "Ready when you are."}</p>

      <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
        {gameState === "ready" && <button type="button" onPointerDown={(event)=>{event.preventDefault();startGame()}} onClick={(event)=>{if(event.detail===0) startGame()}} className="focus-ring touch-manipulation rounded-full bg-navy px-8 py-4 text-sm font-semibold uppercase tracking-[.16em] text-white transition hover:bg-ink active:scale-[.98]">Start Game</button>}
        {gameState === "playing" && <button type="button" disabled className="rounded-full bg-navy/45 px-8 py-4 text-sm font-semibold uppercase tracking-[.16em] text-white">Game in progress…</button>}
        {gameState === "finished" && <><button type="button" onPointerDown={(event)=>{event.preventDefault();resetGame()}} onClick={(event)=>{if(event.detail===0) resetGame()}} className="focus-ring touch-manipulation inline-flex items-center justify-center gap-2 rounded-full bg-navy px-8 py-4 text-sm font-semibold uppercase tracking-[.16em] text-white transition hover:bg-ink active:scale-[.98]"><RotateCcw size={17}/>Play Again</button><a href="#leaderboard" className="focus-ring rounded-full border border-navy px-8 py-4 text-center text-sm font-semibold uppercase tracking-[.16em] text-navy transition hover:bg-navy hover:text-white">View Leaderboard</a></>}
      </div>
    </section>

    <section id="leaderboard" className="mt-5 rounded-[26px] border border-navy/10 bg-white p-5 shadow-lg shadow-navy/5 sm:p-7">
      <div className="flex items-center justify-between gap-4"><h2 className="flex items-center gap-2 font-serif text-xl font-bold text-navy"><Trophy size={21}/>Today&apos;s Leaderboard</h2><span className="text-xs uppercase tracking-[.14em] text-ink/40">Top 10</span></div>
      <ol className="mt-5 divide-y divide-navy/10">{leaderboard.map((entry, index) => <li key={`${entry.user}-${entry.createdAt}`} className={`flex items-center gap-3 py-3 ${entry.user === "You" ? "font-semibold text-navy" : "text-ink/70"}`}><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm ${index === 0 ? "bg-gold text-ink" : "bg-marble"}`}>{index + 1}</span><span className="flex-1">{entry.user}</span><span className="tabular-nums">{entry.score}</span></li>)}</ol>
    </section>

    <aside className="mt-5 flex items-start gap-4 rounded-[26px] bg-sky-50 p-5 text-navy sm:p-7"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white"><Gift aria-hidden/></span><div><h2 className="font-serif text-xl font-bold">Play, earn and enjoy</h2><p className="mt-1 text-sm leading-6 text-ink/60">Every completed round earns 1–5 points based on your score. Your best score today is used on this device&apos;s leaderboard.</p><p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[.14em]"><Star size={14} fill="currentColor"/> 100 points = 2% off</p></div></aside>
    <p className="mt-8 text-center text-xs text-ink/40">Want the real thing? <Link href="/menu" className="font-semibold text-navy underline underline-offset-4">See our full menu</Link>.</p>
  </div>;
}
