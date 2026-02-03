export const AVATAR_MAP: Record<string, string> = {
  lion: "🦁",
  panda: "🐼",
  fox: "🦊",
  koala: "🐨",
  tiger: "🐯",
  bear: "🐻",
  rabbit: "🐰",
  cat: "🐱",
  dog: "🐶",
  mouse: "🐭",
  cow: "🐮",
  pig: "🐷",
  frog: "🐸",
  monkey: "🐵",
  chicken: "🐔",
  penguin: "🐧",
  bird: "🐦",
  duck: "🦆",
  eagle: "🦅",
  owl: "🦉",
  default: "👤"
};

export function getAvatarEmoji(name?: string | null): string {
  if (!name) return AVATAR_MAP.default;
  const key = name.toLowerCase();
  return AVATAR_MAP[key] || AVATAR_MAP.default;
}
