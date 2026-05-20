import { useState } from 'react';

function VipLogoSVG({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: { w: 80, h: 32 }, md: { w: 116, h: 46 }, lg: { w: 188, h: 75 } };
  const { w, h } = dims[size];
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg width={w} height={h} viewBox="0 0 280 112" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      {/* Drop shadow */}
      <ellipse cx="142" cy="59" rx="134" ry="51" fill="rgba(0,0,0,0.2)" />
      {/* Main oval */}
      <ellipse cx="140" cy="56" rx="135" ry="52" fill="#1B3D8F" />
      {/* Outer gold border */}
      <ellipse cx="140" cy="56" rx="135" ry="52" fill="none" stroke="#F5A623" strokeWidth="3.5" />
      {/* Inner gold border */}
      <ellipse cx="140" cy="56" rx="127" ry="44" fill="none" stroke="#F5A623" strokeWidth="1.2" opacity="0.5" />
      {/* Green leaf cluster — top left */}
      <g transform="translate(24,14)">
        <path d="M9,15 C3,7 1,1 9,-1 C17,1 19,9 11,15 Z" fill="#5A9E3A" />
        <path d="M15,13 C9,5 10,-1 18,0 C23,5 21,13 15,13 Z" fill="#5A9E3A" opacity="0.72" />
        <path d="M4,11 C0,5 2,0 8,1 C10,6 8,13 4,11 Z" fill="#5A9E3A" opacity="0.58" />
        <line x1="9" y1="13" x2="14" y2="4" stroke="#2e6b19" strokeWidth="0.9" />
      </g>
      {/* Yellow sun — top right */}
      <g transform="translate(239,19)">
        <circle r="9" fill="#F5A623" />
        <circle r="5.5" fill="#FFD45C" />
        {rays.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={Math.cos(rad) * 11} y1={Math.sin(rad) * 11}
              x2={Math.cos(rad) * 15} y2={Math.sin(rad) * 15}
              stroke="#F5A623" strokeWidth="2" strokeLinecap="round"
            />
          );
        })}
      </g>
      {/* Large white VIP */}
      <text x="140" y="55" fontFamily="Georgia,'Times New Roman',serif" fontSize="50"
        fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle" letterSpacing="5">VIP</text>
      {/* Gold italic pools */}
      <text x="140" y="83" fontFamily="Georgia,'Times New Roman',serif" fontSize="21"
        fontStyle="italic" fontWeight="600" fill="#F5A623" textAnchor="middle" letterSpacing="2">pools</text>
      {/* Light blue wave */}
      <path d="M48,95 Q72,88 96,95 Q120,102 144,95 Q168,88 192,95 Q208,100 220,97"
        stroke="#5BB8F5" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

export function VipLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const [imgFailed, setImgFailed] = useState(false);
  const heights = { sm: 32, md: 46, lg: 75 };
  const h = heights[size];

  if (!imgFailed) {
    return (
      <img
        src="/pool-safety-inspection/vip-pools-logo.jpeg"
        alt="VIP Pools"
        style={{ height: h, objectFit: 'contain', display: 'block' }}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return <VipLogoSVG size={size} />;
}
