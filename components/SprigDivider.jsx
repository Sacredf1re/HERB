export default function SprigDivider({ className = "" }) {
  return (
    <div className={`flex items-center justify-center py-10 ${className}`} aria-hidden="true">
      <svg width="220" height="24" viewBox="0 0 220 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 12 C 40 2, 60 22, 100 12 S 160 2, 218 12"
          stroke="#4B5E45"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="60" cy="9" r="2.5" fill="#C17F5C" />
        <circle cx="110" cy="14" r="2.5" fill="#D9A9A6" />
        <circle cx="160" cy="8" r="2.5" fill="#C17F5C" />
      </svg>
    </div>
  );
}
