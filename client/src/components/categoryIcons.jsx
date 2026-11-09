/**
 * Premium monoline category icons.
 * Consistent 24x24 grid, 1.75px stroke, rounded caps.
 * Used by CategoryCard3D and any category display.
 */

const base = {
  width: 32,
  height: 32,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const CategoryIcons = {
  "baby-clothing": (props) => (
    <svg {...base} {...props}>
      {/* onesie / bodysuit */}
      <path d="M8 3l4 2 4-2 3 4-2 2v9a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-9L5 7l3-4z" />
      <path d="M10 15h4" />
      <circle cx="12" cy="11" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  "diapers-changing": (props) => (
    <svg {...base} {...props}>
      {/* diaper */}
      <path d="M4 6h16v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6z" />
      <path d="M4 10c2 0 3 1 3 3s1 3 3 3" />
      <path d="M20 10c-2 0-3 1-3 3s-1 3-3 3" />
    </svg>
  ),
  feeding: (props) => (
    <svg {...base} {...props}>
      {/* baby bottle */}
      <path d="M9 8h6v11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8z" />
      <path d="M10 8V6a2 2 0 0 1 4 0v2" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  ),
  "bath-hygiene": (props) => (
    <svg {...base} {...props}>
      {/* bathtub */}
      <path d="M4 11h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z" />
      <path d="M6 11V7a2 2 0 0 1 2-2h1" />
      <path d="M8 19l-1 2M16 19l1 2" />
    </svg>
  ),
  toys: (props) => (
    <svg {...base} {...props}>
      {/* teddy / toy block */}
      <circle cx="8" cy="7" r="2" />
      <circle cx="16" cy="7" r="2" />
      <path d="M6 12a6 6 0 0 1 12 0v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-4z" />
      <circle cx="10" cy="13" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="14" cy="13" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  "baby-care": (props) => (
    <svg {...base} {...props}>
      {/* lotion bottle */}
      <path d="M10 3h4v2h-4z" />
      <path d="M9 5h6l1 3v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8l1-3z" />
      <path d="M9 11h6" />
    </svg>
  ),
  "mother-maternity": (props) => (
    <svg {...base} {...props}>
      {/* heart + baby */}
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" />
      <circle cx="12" cy="11" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  accessories: (props) => (
    <svg {...base} {...props}>
      {/* sock */}
      <path d="M8 3h4v8a4 4 0 0 1-4 4 4 4 0 0 1-4-4V9h4V3z" />
      <path d="M8 15v3" />
    </svg>
  ),
  "gift-sets": (props) => (
    <svg {...base} {...props}>
      {/* gift box */}
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M4 13h16" />
      <path d="M12 9v11" />
      <path d="M12 9c-2 0-3.5-1-3.5-2.5S9.5 4 12 6c2.5-2 3.5 0 3.5 0.5S14 9 12 9z" />
    </svg>
  ),
};

export function getCategoryIcon(slugOrIcon) {
  const key = slugOrIcon || "";
  const Icon = CategoryIcons[key];
    if (!Icon) {
    // fallback: simple shopping bag (for custom categories without a matching icon)
    return (
      <svg {...base}>
        <path d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    );
  }
  return <Icon />;
}