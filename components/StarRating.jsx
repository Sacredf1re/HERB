export default function StarRating({ value = 0, size = "text-sm" }) {
  const rounded = Math.round(value);
  return (
    <span className={`${size} text-clay tracking-tight`} aria-label={`${value} de 5 estrelas`}>
      {"★".repeat(rounded)}
      <span className="text-sage-light">{"★".repeat(5 - rounded)}</span>
    </span>
  );
}
