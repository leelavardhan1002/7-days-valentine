import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './styles/index.css';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  active?: boolean;
}

export const GlassButton = ({
  icon,
  children,
  active,
  className = '',
  ...props
}: GlassButtonProps) => {
  return (
    <button className={`glass-button ${active ? 'active' : ''} ${className}`} {...props}>
      {icon && <span className="glass-button-icon">{icon}</span>}
      {children && <span className="glass-button-text">{children}</span>}
    </button>
  );
};
