export function VipLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const heights = { sm: 32, md: 48, lg: 72 };
  const h = heights[size];
  return (
    <div style={{ height: h }} className="flex items-center gap-2">
      <svg height={h} viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
        {/* Wave background circle */}
        <circle cx="30" cy="30" r="28" fill="#0077B6"/>
        {/* Wave paths */}
        <path d="M10 32 Q17 24 24 32 Q31 40 38 32 Q45 24 50 32" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M10 38 Q17 30 24 38 Q31 46 38 38 Q45 30 50 38" stroke="#F5A623" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
        {/* VIP text */}
        <text x="65" y="22" fontFamily="Georgia, serif" fontSize="22" fontWeight="bold" fill="#0077B6">VIP</text>
        <text x="65" y="42" fontFamily="Georgia, serif" fontSize="13" fill="#1a4a6e" letterSpacing="2">POOLS</text>
        {/* Gold underline accent */}
        <line x1="65" y1="46" x2="130" y2="46" stroke="#F5A623" strokeWidth="2"/>
      </svg>
    </div>
  );
}
