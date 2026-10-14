/** Small uses of the motif: the mark, the section divider, the loader. */
export function ArcMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M 7.2 25 A 13 13 0 1 1 24.8 25" fill="none" stroke="var(--hair-strong)" strokeWidth="3" strokeLinecap="round" />
      <path d="M 7.2 25 A 13 13 0 0 1 8 9.5" fill="none" stroke="var(--amber)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function ArcDivider({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 24" preserveAspectRatio="none" aria-hidden="true" style={{ width: "100%", height: 24, display: "block" }}>
      <path d="M 0 22 Q 160 -8 320 22" fill="none" stroke="var(--hair-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <circle cx="160" cy="7" r="3" fill="var(--amber)" />
    </svg>
  );
}

export function ArcLoader({ size = 36 }: { size?: number }) {
  return (
    <span className="arc-loading" role="status" aria-label="Loading" style={{ display: "inline-flex" }}>
      <ArcMark size={size} />
    </span>
  );
}
