export default function IconMasis({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <svg
      width="48"
      height="24"
      viewBox="0 0 100 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Left Mountain (Sis) */}
      <path d="M 5,42 L 35,18 L 45,26 L 50,22" />
      
      {/* Right Mountain (Masis) */}
      <path d="M 40,30 L 68,6 L 80,18 L 88,10 L 98,42" />
      
      {/* Center Leaves (solid) */}
      <path d="M 52,45 C 38,45 32,35 32,35 C 40,31 52,39 52,45 Z" fill="currentColor" stroke="none" />
      <path d="M 52,45 C 66,45 72,35 72,35 C 64,31 52,39 52,45 Z" fill="currentColor" stroke="none" />
      <path d="M 52,45 C 49,31 52,23 52,23 C 55,23 55,31 52,45 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
