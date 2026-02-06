import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassButton } from '../GlassButton';
import { GlassButtonGroup } from '../GlassButtonGroup';
import './DayCountdown.css';

interface DayCountdownProps {
  currentDay: number;
}

const DayCountdown = ({ currentDay }: DayCountdownProps) => {
  const [countdown, setCountdown] = useState('00:00:00');
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      if (diff <= 0) {
        setIsComplete(true);
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleProceed = () => {
    if (currentDay < 7) {
      navigate('/');
    }
  };

  return (
    <div className="day-countdown">
      {isComplete ? (
        <GlassButtonGroup>
          <GlassButton onClick={handleProceed}>
            {currentDay < 7 ? 'Proceed to Next Day' : 'Journey Complete'}
          </GlassButton>
        </GlassButtonGroup>
      ) : (
        <GlassButtonGroup
          style={{ flexDirection: 'column', gap: '4px', alignItems: 'center', padding: '1rem' }}
        >
          <span className="countdown-label">Next day unlocks in</span>
          <span className="countdown-time">{countdown}</span>
        </GlassButtonGroup>
      )}
    </div>
  );
};

export default DayCountdown;
