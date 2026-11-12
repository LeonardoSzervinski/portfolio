export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const lerp = (from, to, t) => from + (to - from) * t;

export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/** Fraction of `t` already covered between `start` and `end`, clamped to 0..1. */
export const progressBetween = (t, start, end) => clamp((t - start) / (end - start));
