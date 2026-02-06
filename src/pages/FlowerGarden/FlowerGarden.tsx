import { useRef, useState } from 'react';
import DayCountdown from '../../components/DayCountdown/DayCountdown';
import FlowerUI from './FlowerUI';
import { useAutoBloom } from './hooks/useAutoBloom';
import { useFlowerRenderer } from './hooks/useFlowerRenderer';
import { useInteraction } from './hooks/useInteraction.';
import './styles/index.css';

const FlowerGarden = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [autoBloom, setAutoBloom] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const { plantFlower, clearGarden } = useFlowerRenderer(canvasRef);

  const handlePlantFlower = (x: number, y: number) => {
    plantFlower(x, y);
    if (!autoBloom) {
      setHideUI(true);
      setTimeout(() => setHideUI(false), 5000);
    }
  };

  useInteraction(handlePlantFlower);
  useAutoBloom(autoBloom, plantFlower);

  // Hide UI when auto bloom is on
  const shouldHideUI = hideUI || autoBloom;

  return (
    <div className="flower-container">
      <canvas ref={canvasRef} />

      <FlowerUI
        onClear={clearGarden}
        autoBloom={autoBloom}
        toggleAuto={() => setAutoBloom((v) => !v)}
        hideUI={shouldHideUI}
      />
      
      <DayCountdown currentDay={1} />
    </div>
  );
};

export default FlowerGarden;
