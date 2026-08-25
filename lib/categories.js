export const categories = [
  { value: "Herbal Tea", label: "Chá Herbal" },
  { value: "Tincture", label: "Tintura" },
  { value: "Salve & Balm", label: "Bálsamo" },
  { value: "Essential Oil", label: "Óleo Essencial" },
  { value: "Body Oil", label: "Óleo Corporal" },
  { value: "Skincare", label: "Skincare" },
  { value: "Sleep", label: "Sono" },
  { value: "Hair", label: "Cabelo" },
  { value: "Nutrition", label: "Nutrição" }
];

// Categories actually shown to customers (filter chips, nav, footer).
// The legacy set (Herbal Tea, Tincture, etc.) stays available in `categories`
// above only so old/admin-entered products keep a valid label — it's not
// offered as a browsing option anymore.
export const storefrontCategories = categories.filter((c) =>
  ["Skincare", "Sleep", "Hair", "Nutrition"].includes(c.value)
);

export const categoryLabels = Object.fromEntries(categories.map((c) => [c.value, c.label]));
