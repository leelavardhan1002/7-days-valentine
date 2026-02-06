import type { HTMLAttributes, ReactNode } from 'react';
import './styles/index.css';

interface GlassButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const GlassButtonGroup = ({ children, className = '', ...props }: GlassButtonGroupProps) => {
  return (
    <div className={`glass-button-group ${className}`} {...props}>
      {children}
    </div>
  );
};
