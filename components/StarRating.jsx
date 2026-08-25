export default function StarRating({ value = 0, size = "text-sm", showValue = false }) {
  const rounded = Math.round(value);
  return (
    <span className={`inline-flex items-center gap-1.5 ${size}`}>
      <span className="text-clay tracking-tight" aria-label={`${value} de 5 estrelas`}>
        {"★".repeat(rounded)}
        <span className="text-sage-light">{"★".repeat(5 - rounded)}</span>
      </span>
      {showValue && value > 0 && <span className="text-ink/50 text-xs">{value.toFixed(1)}</span>}
    </span>
  );
}
