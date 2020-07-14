export const colors = {
  red: "#E9503C",
  orange: "#FF921B",
  yellow: "#FFC928",
  green: "#39BD0C",
  mint: "#56E8A2",
  teal: "#3FD8F4",
  blue: "#1B99FF",
  navy: "#2267CD",
  purple: "#8621D0",
  pink: "#FF8676",
  RAINBOW: "RAINBOW"
};

export type Color = keyof typeof colors;

export const colorNames = Object.keys(colors);

export const getNextColor = (name: string) => {
  const i = colorNames.indexOf(name);
  return colorNames[i + 1] ?? colorNames[0];
};
