import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const startDate = new Date('2026-02-07T00:00:00').getTime();

const days = [
  { emoji: '🌹', label: 'Day 1' },
  { emoji: '💍', label: 'Day 2' },
  { emoji: '🍫', label: 'Day 3' },
  { emoji: '🧸', label: 'Day 4' },
  { emoji: '🤞', label: 'Day 5' },
  { emoji: '🤗', label: 'Day 6' },
  { emoji: '😘', label: 'Day 7' },
];

const Landing = () => {
  const [countdown, setCountdown] = useState('18:32:11');
  const [currentDay, setCurrentDay] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const daysPassed = Math.floor((now.getTime() - startDate) / (1000 * 60 * 60 * 24));
      setCurrentDay(Math.max(0, Math.min(daysPassed + 1, 7)));

      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDayClick = (dayNum: number) => {
    if (dayNum === currentDay) {
      navigate(`/day${dayNum}`);
    }
  };

  return (
    <div className="landing">
      <div className="hero">
        <h1 className="hero-title">
          7 Days.
          <br />
          One Feeling.
        </h1>
        {currentDay === 1 && (
          <button className="glass-btn" onClick={() => navigate('/day1')}>
            Begin the Journey
          </button>
        )}
        <p className="subtext">A new surprise blooms every midnight.</p>
      </div>

      <div className="day-strip">
        {days.map((day, i) => {
          const dayNum = i + 1;
          const isToday = dayNum === currentDay;
          return (
            <div
              key={i}
              className={`day-card ${dayNum !== currentDay ? 'locked' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => handleDayClick(dayNum)}
            >
              <span className="day-emoji">{day.emoji}</span>
              <span className="day-label">{day.label}</span>
              {dayNum !== currentDay && <span className="lock">🔒</span>}
              {dayNum !== currentDay && <div className="unlock-hint">Unlocks in {countdown}</div>}
            </div>
          );
        })}
      </div>

      <div className="countdown-global">Next unlock in {countdown}</div>

      <footer className="footer">Made with intention ❤️</footer>
    </div>
  );
};

export default Landing;
