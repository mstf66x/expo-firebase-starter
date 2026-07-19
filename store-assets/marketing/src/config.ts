/**
 * Shared marketing-screenshot tokens (palette, gradients, typography,
 * slide schema). Device-specific tokens (canvas, frame asset, layout,
 * perspective) live in `src/devices/<device>.ts` and travel as a
 * `DeviceProfile` argument to the components.
 */

/** Vertical crimson gradient — fallback when a slide doesn't override. */
export const PALETTE = {
  bgTop: "rgb(45, 22, 22)",
  bgMid: "rgb(85, 18, 18)",
  bgBottom: "rgb(135, 12, 12)",
  headline: "#FFFFFF",
  badgeFill: "#FFFFFF",
  badgeAccent: "#F4E9C8",
} as const;

export const TYPOGRAPHY = {
  headlineFamily:
    "'Instrument Serif', 'Times New Roman', 'Hiragino Mincho ProN', serif",
  headlineLineHeight: 1.05,
  headlineLetterSpacing: -1,
  headlineWeight: 500,
  badgeFamily: "'Instrument Serif', 'Times New Roman', serif",
  badgeKickerSize: 32,
  badgeMainSize: 56,
} as const;

export type Perspective = {
  rotateYDeg: number;
  rotateXDeg: number;
  /** Optional override for `perspective()` depth. */
  perspectivePx?: number;
};

/** Three-stop vertical gradient. Values are any valid CSS colour string. */
export type Background = {
  top: string;
  mid: string;
  bottom: string;
};

export type HeadlineHighlight = {
  bg: string;
  /** Padding in px around the text. */
  padding?: number;
  /** Border radius in px. */
  radius?: number;
};

export type HeadlineStyle = {
  /** Override font-size in px. */
  fontSize?: number;
  /** Override CSS font-weight (300, 400, 500, 600, 700). */
  fontWeight?: number;
  /** Italic the headline. */
  italic?: boolean;
  /** Override colour of the headline text. */
  color?: string;
  /** Optional rounded highlight bar behind the headline. */
  highlight?: HeadlineHighlight;
};

export type Slide = {
  /** Filename suffix; output written to `<MASTER>_<n>.png`. */
  id: number;
  headline: string;
  /** Path under the device's `raw/` folder. */
  appScreenshot: string;
  /** Show the "Best of the App Store" laurel under the headline. */
  showLaurel?: boolean;
  /** Per-slide tilt override; falls back to the device's default. */
  perspective?: Perspective;
  /** Per-slide background gradient override. */
  background?: Background;
  /** Per-slide headline typography overrides. */
  headlineStyle?: HeadlineStyle;
};

/**
 * Built-in gradient presets — referenced by the SKILL when authoring
 * `slides.json`. Mirror the washi design system + a few warmer tones.
 */
export const GRADIENT_PRESETS: Record<string, Background> = {
  crimson: {
    top: "rgb(45, 22, 22)",
    mid: "rgb(85, 18, 18)",
    bottom: "rgb(135, 12, 12)",
  },
  sumi: {
    top: "#0d0d0f",
    mid: "#1a1a1f",
    bottom: "#28282f",
  },
  indigo: {
    top: "#0f1f3d",
    mid: "#15326b",
    bottom: "#1a4ba0",
  },
  gold: {
    top: "#3a2810",
    mid: "#7a521a",
    bottom: "#b8862c",
  },
  washi: {
    top: "#f5efe2",
    mid: "#ece4d2",
    bottom: "#dcd0b6",
  },
  forest: {
    top: "#0f1d12",
    mid: "#1f3a25",
    bottom: "#2e5c3a",
  },
} as const;
