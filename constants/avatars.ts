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
  // Check if it's a mapped name (e.g. "lion" -> "🦁")
  if (AVATAR_MAP[key]) {
    return AVATAR_MAP[key];
  }
  // Otherwise assume it's already an emoji (e.g. "🦁") or return distinct default if you prefer
  // We'll pass it through so DB emojis work
  return name;
}
