// ============================================================
// VIEW LAYER — components/IconRenderer.tsx
// Renders an icon from the ICON_MAP by key.
// ============================================================

import React from 'react';
import { IconKey } from '../types';
import { ICON_MAP } from '../icons';

interface IconRendererProps {
  iconKey: IconKey;
  size?: number;
  className?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ iconKey, size = 20, className = '' }) => {
  const icon = ICON_MAP[iconKey];
  if (!icon) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={icon.fill ? 'none' : 'currentColor'}
      fill={icon.fill ? 'currentColor' : 'none'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icon.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
};

export default IconRenderer;
