import { type Background, PALETTE } from "../config.ts";

/**
 * Vertical 3-stop gradient that fills the canvas. Falls back to the
 * default crimson palette when the slide doesn't specify one.
 */
export function backgroundCss(override: Background | undefined): string {
  const top = override?.top ?? PALETTE.bgTop;
  const mid = override?.mid ?? PALETTE.bgMid;
  const bottom = override?.bottom ?? PALETTE.bgBottom;
  return `
    .bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        ${top} 0%,
        ${mid} 55%,
        ${bottom} 100%
      );
    }
  `;
}

export function backgroundHtml(): string {
  return `<div class="bg" aria-hidden="true"></div>`;
}
