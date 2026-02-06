import { GlassButton } from '../../components/GlassButton';
import { GlassButtonGroup } from '../../components/GlassButtonGroup';

type FlowerUIProps = {
  onClear: () => void;
  autoBloom: boolean;
  toggleAuto: () => void;
  hideUI: boolean;
};

const FlowerUI = ({ onClear, autoBloom, toggleAuto, hideUI }: FlowerUIProps) => {
  return (
    <>
      {/* Header */}
      <header className={`flower-header ${hideUI ? 'fade-out' : ''}`}>
        <h1 className="flower-logo">🌸 A Lovely Rose Garden for You</h1>
      </header>

      {/* Instructions */}
      <div className={`flower-name ${hideUI ? 'fade-out' : ''}`}>
        <span className="text-line">Click Anywhere to start your Rose Day to</span>
        <span className="text-highlight">Plant Flowers</span>
        <span className="text-line">✨ or turn on Auto Bloom</span>
      </div>

      {/* Controls */}
      <div className={`flower-controls ${hideUI ? 'fade-out' : ''}`}>
        <GlassButtonGroup>
          <GlassButton icon="🧹" onClick={onClear}>
            Clear Garden
          </GlassButton>

          <GlassButton icon="✨" active={autoBloom} onClick={toggleAuto}>
            {autoBloom ? 'Stop Bloom' : 'Auto Bloom'}
          </GlassButton>
        </GlassButtonGroup>
      </div>

      {/* Footer */}
      <footer className={`flower-footer ${hideUI ? 'fade-out' : ''}`}>
        <span>Made with Love | Tap to grow flowers</span>
      </footer>
    </>
  );
};

export default FlowerUI;
