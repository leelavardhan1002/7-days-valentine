import './styles.css';

type PageTextProps = {
  line1?: string;
  highlight: string;
  line2?: string;
  hideUI?: boolean;
  position?: 'center' | 'center-left' | 'top' | 'bottom';
};

export const PageText = ({ line1, highlight, line2, hideUI, position = 'center' }: PageTextProps) => {
  return (
    <div className={`page-text page-text-${position} ${hideUI ? 'fade-out' : ''}`}>
      {line1 && <span className="text-line">{line1}</span>}
      <span className="text-highlight">{highlight}</span>
      {line2 && <span className="text-line">{line2}</span>}
    </div>
  );
};
