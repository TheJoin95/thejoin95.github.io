export function BrandMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#d7ef36" />
      <path d="M12 43V21l11 12 11-12v22m10-22v22h9" fill="none" stroke="#111111" strokeWidth="5.5" strokeLinecap="square" strokeLinejoin="round" />
    </svg>
  );
}
