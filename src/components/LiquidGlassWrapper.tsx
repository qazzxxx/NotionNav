import React from 'react';

interface LiquidGlassWrapperProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  style?: React.CSSProperties;
}

const LiquidGlassWrapper: React.FC<LiquidGlassWrapperProps> = ({
  children,
  className = '',
  isActive = true,
  style
}) => {
  if (!isActive) {
    return <div className={`relative nav-item ${className}`}>{children}</div>;
  }

  return (
    <div style={{...style}} className={`liquidGlass ${className}`}>
      <div className="liquidGlass-effect" />
      <div className="liquidGlass-tint" />
      <div className="liquidGlass-shine rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default LiquidGlassWrapper;