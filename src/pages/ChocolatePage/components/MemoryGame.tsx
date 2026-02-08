import { useEffect, useState, useRef } from "react";
import Tile3D from "./Tile";

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [combo, setCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showGolden, setShowGolden] = useState(false);
  const [matchMessage, setMatchMessage] = useState("");
  const [gameCompleted, setGameCompleted] = useState(false);

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  const images = [
    "/Chocolate1.webp",
    "/Chocolate2.webp",
    "/Chocolate3.webp",
    "/Chocolate4.webp",
    "/Chocolate5.webp",
    "/Chocolate6.webp",
  ];

  const initializeGame = () => {
    const deck = [...images, ...images]
      .map((img, i) => ({
        id: i,
        image: img,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
    setFlipped([]);
    setLocked(false);
    setCombo(0);
    setMistakes(0);
    setTimer(0);
    setShowGolden(false);
    setMatchMessage("");

    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    initializeGame();

    timerRef.current = setInterval(() => {
      setTimer(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCardClick = (idx: number) => {
    if (locked || cards[idx].isFlipped || cards[idx].isMatched) return;
    if (flipped.length === 2) return;

    setCards((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, isFlipped: true } : c)),
    );
    setFlipped((prev) => [...prev, idx]);
  };

  useEffect(() => {
    if (flipped.length !== 2) return;

    setLocked(true);
    const [a, b] = flipped;

    const timeout = setTimeout(() => {
      if (cards[a].image === cards[b].image) {
        setCards((prev) =>
          prev.map((c, i) =>
            i === a || i === b ? { ...c, isMatched: true } : c,
          ),
        );
        setCombo((c) => c + 1);

        const messages = [
          "Perfect together 💕",
          "Sweet match 🍫",
          "Meant to be ✨",
          "Love is sweet 💖",
        ];
        setMatchMessage(messages[Math.floor(Math.random() * messages.length)]);
        setTimeout(() => setMatchMessage(""), 1500);
      } else {
        setCards((prev) =>
          prev.map((c, i) =>
            i === a || i === b ? { ...c, isFlipped: false } : c,
          ),
        );
        setCombo(0);
        setMistakes((m) => m + 1);
      }

      setFlipped([]);
      setLocked(false);
    }, 750);

    return () => clearTimeout(timeout);
  }, [flipped]);

  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every((c) => c.isMatched);
    if (!allMatched) return;

    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      setGameCompleted(true);
      if (timer < 60 || mistakes === 0) {
        setShowGolden(true);
      }
    }, 800);
  }, [cards]);

  const formatTime = (t: number) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(
      2,
      "0",
    )}`;

  return (
    <div className="relative">
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        Sweetness shared: {formatTime(timer)}
      </div>

      {combo > 1 && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 text-amber-300 font-semibold animate-pulse">
          {combo}x Combo 🔥
        </div>
      )}

      {matchMessage && (
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 text-pink-300 text-xl animate-bounce">
          {matchMessage}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <Tile3D
            key={card.id}
            backImage={card.image}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={() => handleCardClick(idx)}
            delay={idx * 0.08}
          />
        ))}
      </div>

      {gameCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="text-7xl animate-bounce">🍫</div>
            <div className="text-4xl font-bold text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
              My sweetest chocolate won {showGolden && "golden "}chocolate
            </div>
            <div className="text-2xl text-pink-300 font-semibold">
              Happy Chocolate Day 💝
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
