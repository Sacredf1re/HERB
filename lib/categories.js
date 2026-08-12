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

export const categoryLabels = Object.fromEntries(categories.map((c) => [c.value, c.label]));
