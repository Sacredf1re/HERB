export default function StarRating({ value = 0, size = "text-sm" }) {
  const rounded = Math.round(value);
  return (
    <span className={`${size} text-clay tracking-tight`} aria-label={`${value} out of 5 stars`}>
      {"★".repeat(rounded)}
      <span className="text-sage-light">{"★".repeat(5 - rounded)}</span>
    </span>
  );
}
