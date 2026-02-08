import { useState, useEffect } from "react";

interface Tile3DProps {
  backImage: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  delay?: number;
}

export default function Tile3D({
  backImage,
  isFlipped,
  isMatched,
  onClick,
  delay = 0,
}: Tile3DProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isUnwrapped, setIsUnwrapped] = useState(false);

  // 🔑 Re-wrap on mismatch
  useEffect(() => {
    if (!isFlipped && !isMatched) {
      setIsUnwrapped(false);
    }
  }, [isFlipped, isMatched]);

  const handleClick = () => {
    if (!isFlipped && !isUnwrapped) {
      setIsUnwrapped(true);
      setTimeout(onClick, 320); // unwrap → flip
    } else {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({
          x: ((e.clientY - r.top) / r.height - 0.5) * 10,
          y: ((e.clientX - r.left) / r.width - 0.5) * -10,
        });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative w-28 h-28 cursor-pointer animate-float-slow"
      style={{ perspective: "1400px", animationDelay: `${delay}s` }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${
            tilt.y + (isFlipped ? 180 : 0)
          }deg)`,
        }}
      >
        {/* ================= FRONT (WRAPPED) ================= */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
            boxShadow: `
              inset 0 1px 2px rgba(255,255,255,0.4),
              inset 0 -2px 4px rgba(0,0,0,0.4),
              0 18px 40px rgba(0,0,0,0.45)
            `,
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          {/* 🟫 Wrapper with torn edge */}
          <div
            className="absolute inset-0 z-20 transition-all duration-500 ease-out"
            style={{
              background: `
                linear-gradient(
                  135deg,
                  rgba(120,60,20,0.85),
                  rgba(60,30,10,0.95)
                )
              `,
              clipPath: isUnwrapped
                ? "polygon(0 0,100% 0,100% 12%,80% 18%,60% 10%,40% 16%,20% 8%,0 14%)"
                : "polygon(0 0,100% 0,100% 100%,0 100%)",
              transform: isUnwrapped
                ? "translateY(-35%) rotate(-10deg)"
                : "none",
              opacity: isUnwrapped ? 0 : 1,
            }}
          />

          {/* ✨ Light sweep */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
              transform: "translateX(-120%)",
              animation: "shine 3s infinite",
            }}
          />

          <div className="w-full h-full flex items-center justify-center text-2xl">
            ❤️
          </div>
        </div>

        {/* ================= BACK (CHOCOLATE) ================= */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "rgba(255,255,255,0.15)",
            boxShadow: isMatched
              ? "0 0 40px rgba(251,191,36,0.9)"
              : "0 18px 40px rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <img src={backImage} className="w-full h-full object-cover" alt="" />

          {/* 🍫 Chocolate depth emboss */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow:
                "inset 0 6px 10px rgba(255,255,255,0.15), inset 0 -6px 12px rgba(0,0,0,0.4)",
            }}
          />

          {/* 🌟 Match glow */}
          {isMatched && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background:
                  "radial-gradient(circle, rgba(251,191,36,0.4), transparent 70%)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
