import {
  type HeadlineStyle,
  PALETTE,
  TYPOGRAPHY,
} from "../config.ts";
import type { DeviceProfile } from "../devices/index.ts";

const HIGHLIGHT_DEFAULTS = {
  paddingX: 24,
  paddingY: 8,
  radius: 14,
} as const;

/** Top-of-canvas marketing headline. Newlines in the source become <br>. */
export function headlineHtml(text: string, style: HeadlineStyle | undefined): string {
  const escaped = escapeHtml(text).replaceAll("\n", "<br>");
  if (style?.highlight) {
    return `
      <h1 class="headline headline-with-highlight">
        <span class="headline-inner">${escaped}</span>
      </h1>
    `;
  }
  return `<h1 class="headline">${escaped}</h1>`;
}

export function headlineCss(
  device: DeviceProfile,
  style: HeadlineStyle | undefined,
): string {
  const fontSize = style?.fontSize ?? device.defaultHeadlineSize;
  const fontWeight = style?.fontWeight ?? TYPOGRAPHY.headlineWeight;
  const italic = style?.italic ? "italic" : "normal";
  const color = style?.color ?? PALETTE.headline;
  const highlight = style?.highlight;
  const highlightBg = highlight?.bg ?? "transparent";
  const highlightPad = highlight?.padding ?? HIGHLIGHT_DEFAULTS.paddingX;
  const highlightPadY = highlight?.padding
    ? Math.round(highlight.padding / 2)
    : HIGHLIGHT_DEFAULTS.paddingY;
  const highlightRadius = highlight?.radius ?? HIGHLIGHT_DEFAULTS.radius;

  return `
    .headline {
      position: absolute;
      top: ${device.layout.headlineTop}px;
      left: 50%;
      transform: translateX(-50%);
      width: ${device.layout.headlineMaxWidth}px;
      max-width: ${device.canvas.width - 80}px;
      margin: 0;
      padding: 0;
      color: ${color};
      font-family: ${TYPOGRAPHY.headlineFamily};
      font-size: ${fontSize}px;
      font-weight: ${fontWeight};
      font-style: ${italic};
      line-height: ${TYPOGRAPHY.headlineLineHeight};
      letter-spacing: ${TYPOGRAPHY.headlineLetterSpacing}px;
      text-align: center;
      text-wrap: balance;
    }

    .headline-with-highlight .headline-inner {
      display: inline-block;
      padding: ${highlightPadY}px ${highlightPad}px;
      background: ${highlightBg};
      border-radius: ${highlightRadius}px;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
  `;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
