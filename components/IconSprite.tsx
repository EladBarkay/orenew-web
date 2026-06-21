// Brand "aperture" icon family, lifted verbatim from the desktop app's
// orenew-lens-preview.html. Rendered once (hidden) per page; components reference a
// symbol with <svg><use href="#lens" /></svg>. All paths use currentColor so the
// existing text-accent styling recolors them.
export function IconSprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
      <defs>
        <symbol id="lens" viewBox="0 0 512 512">
          <path fill="currentColor" fillOpacity="0.50" d="M189 139.95 A134 134 0 0 1 323 139.95 L281.98 241 L256 226 Z" />
          <path fill="currentColor" fillOpacity="0.60" d="M323 139.95 A134 134 0 0 1 390 256 L281.98 271 L281.98 241 Z" />
          <path fill="currentColor" fillOpacity="0.70" d="M390 256 A134 134 0 0 1 323 372.05 L256 286 L281.98 271 Z" />
          <path fill="currentColor" fillOpacity="0.80" d="M323 372.05 A134 134 0 0 1 189 372.05 L230.02 271 L256 286 Z" />
          <path fill="currentColor" fillOpacity="0.90" d="M189 372.05 A134 134 0 0 1 122 256 L230.02 241 L230.02 271 Z" />
          <path fill="currentColor" fillOpacity="0.97" d="M122 256 A134 134 0 0 1 189 139.95 L256 226 L230.02 241 Z" />
          <path fill="currentColor" d="M187.6 444 A200 200 0 1 1 324.4 444 L308 398.9 A152 152 0 1 0 204 398.9 Z" />
        </symbol>

        <symbol id="lensFlat" viewBox="0 0 512 512">
          <path fill="currentColor" fillRule="evenodd" d="M390 256 A134 134 0 1 0 122 256 A134 134 0 1 0 390 256 Z M281.98 271 L256 286 L230.02 271 L230.02 241 L256 226 L281.98 241 Z" />
          <path fill="currentColor" d="M187.6 444 A200 200 0 1 1 324.4 444 L308 398.9 A152 152 0 1 0 204 398.9 Z" />
        </symbol>

        <clipPath id="mkA">
          <path d="M106 436 L106 232 A150 150 0 0 1 406 232 L406 436 L342 436 L342 232 A86 86 0 0 0 170 232 L170 436 Z" />
          <path clipRule="evenodd" d="M210 279 H302 A14 14 0 0 1 316 293 V351 A14 14 0 0 1 302 365 H210 A14 14 0 0 1 196 351 V293 A14 14 0 0 1 210 279 Z M288 291 a11 11 0 1 0 0 22 a11 11 0 1 0 0 -22 Z" />
        </clipPath>

        <clipPath id="barB">
          <path clipRule="evenodd" transform="translate(256 256) rotate(45)" d="M-126 -60 H126 A24 24 0 0 1 150 -36 V36 A24 24 0 0 1 126 60 H-126 A24 24 0 0 1 -150 36 V-36 A24 24 0 0 1 -126 -60 Z M106 0 L97 15.59 L79 15.59 L70 0 L79 -15.59 L97 -15.59 Z M112 0 L134 5 L134 -5 Z M100 20.78 L106.67 42.34 L115.33 37.34 Z M76 20.78 L60.67 37.34 L69.33 42.34 Z M64 0 L42 -5 L42 5 Z M76 -20.78 L69.33 -42.34 L60.67 -37.34 Z M100 -20.78 L115.33 -37.34 L106.67 -42.34 Z" />
        </clipPath>

        <symbol id="aDepth" viewBox="0 0 512 512">
          <g clipPath="url(#mkA)">
            <polygon points="0,0 256,0 0,256" fill="currentColor" fillOpacity="0.62" />
            <polygon points="256,0 512,0 0,512 0,256" fill="currentColor" fillOpacity="0.74" />
            <polygon points="512,0 512,256 256,512 0,512" fill="currentColor" fillOpacity="0.86" />
            <polygon points="512,256 512,512 256,512" fill="currentColor" fillOpacity="1" />
          </g>
        </symbol>

        <symbol id="bDepth" viewBox="0 0 512 512">
          <g clipPath="url(#barB)">
            <polygon points="0,0 256,0 0,256" fill="currentColor" fillOpacity="0.62" />
            <polygon points="256,0 512,0 0,512 0,256" fill="currentColor" fillOpacity="0.74" />
            <polygon points="512,0 512,256 256,512 0,512" fill="currentColor" fillOpacity="0.86" />
            <polygon points="512,256 512,512 256,512" fill="currentColor" fillOpacity="1" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}

export type IconName = "lens" | "lensFlat" | "aDepth" | "bDepth";

/** Render a sprite symbol at the given size, recolored by the current text color. */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" className={className}>
      <use href={`#${name}`} />
    </svg>
  );
}
