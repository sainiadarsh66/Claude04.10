/**
 * Built-in jigsaw pictures as inline SVG, so they work offline and print crisply.
 * Bold shapes and strong colour contrast make the pieces easier to tell apart.
 */
export interface Scene {
  id: string;
  title: string;
  svg: string;
}

const wrap = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">${body}</svg>`;

export const SCENES: Scene[] = [
  {
    id: 'seaside',
    title: 'Day at the Seaside',
    svg: wrap(`
      <rect width="800" height="340" fill="#7cc6ee"/>
      <circle cx="650" cy="110" r="70" fill="#ffd23f"/>
      <ellipse cx="180" cy="100" rx="90" ry="32" fill="#ffffff"/>
      <ellipse cx="250" cy="120" rx="70" ry="26" fill="#ffffff"/>
      <rect y="300" width="800" height="120" fill="#1f6fb2"/>
      <path d="M0 330 Q50 310 100 330 T200 330 T300 330 T400 330 T500 330 T600 330 T700 330 T800 330" stroke="#ffffff" stroke-width="8" fill="none"/>
      <path d="M470 300 L540 300 L520 330 L490 330 Z" fill="#8b4513"/>
      <path d="M505 300 L505 210 L560 290 Z" fill="#e63946"/>
      <rect y="410" width="800" height="190" fill="#f4d58d"/>
      <path d="M120 600 L200 420 L280 600 Z" fill="#e63946"/>
      <path d="M200 420 L240 600 L160 600 Z" fill="#ffffff"/>
      <rect x="560" y="470" width="70" height="60" fill="#2a9d8f"/>
      <path d="M555 470 L635 470 L620 450 L570 450 Z" fill="#264653"/>
      <circle cx="420" cy="520" r="34" fill="#ff8fab"/>
      <circle cx="420" cy="520" r="14" fill="#ffffff"/>`),
  },
  {
    id: 'garden',
    title: 'Summer Garden',
    svg: wrap(`
      <rect width="800" height="600" fill="#bde0fe"/>
      <circle cx="120" cy="100" r="60" fill="#ffd23f"/>
      <rect y="380" width="800" height="220" fill="#52b788"/>
      <rect x="500" y="200" width="220" height="190" fill="#f1faee"/>
      <path d="M480 210 L610 110 L740 210 Z" fill="#9d0208"/>
      <rect x="585" y="290" width="50" height="100" fill="#6a4c93"/>
      <rect x="520" y="230" width="50" height="45" fill="#90e0ef"/>
      <rect x="650" y="230" width="50" height="45" fill="#90e0ef"/>
      ${[80, 180, 280, 380].map((x, i) => `
        <rect x="${x - 4}" y="400" width="8" height="130" fill="#2d6a4f"/>
        <circle cx="${x}" cy="400" r="38" fill="${['#ff006e', '#ffbe0b', '#fb5607', '#8338ec'][i]}"/>
        <circle cx="${x}" cy="400" r="14" fill="#ffd23f"/>`).join('')}
      <path d="M0 560 Q200 520 400 560 T800 560 L800 600 L0 600 Z" fill="#40916c"/>`),
  },
  {
    id: 'countryside',
    title: 'Country Lane',
    svg: wrap(`
      <rect width="800" height="600" fill="#ffd6a5"/>
      <circle cx="400" cy="250" r="110" fill="#ff9f1c"/>
      <path d="M0 320 Q200 220 400 300 T800 280 L800 600 L0 600 Z" fill="#8ac926"/>
      <path d="M0 400 Q250 330 500 400 T800 380 L800 600 L0 600 Z" fill="#4c956c"/>
      <path d="M340 600 Q380 480 420 400 L450 400 Q440 480 480 600 Z" fill="#e9c46a"/>
      <rect x="140" y="330" width="16" height="90" fill="#6f4518"/>
      <circle cx="148" cy="310" r="55" fill="#2d6a4f"/>
      <rect x="620" y="300" width="14" height="80" fill="#6f4518"/>
      <circle cx="627" cy="285" r="45" fill="#2d6a4f"/>
      <ellipse cx="250" cy="500" rx="40" ry="24" fill="#ffffff"/>
      <circle cx="285" cy="488" r="14" fill="#333333"/>
      <ellipse cx="580" cy="520" rx="40" ry="24" fill="#ffffff"/>
      <circle cx="615" cy="508" r="14" fill="#333333"/>`),
  },
  {
    id: 'harbour',
    title: 'Harbour at Sunset',
    svg: wrap(`
      <rect width="800" height="330" fill="#ffafcc"/>
      <rect y="150" width="800" height="180" fill="#ffc8dd"/>
      <circle cx="400" cy="330" r="120" fill="#ff7b00"/>
      <rect y="330" width="800" height="270" fill="#023e8a"/>
      <rect y="380" width="800" height="12" fill="#0077b6"/>
      <rect y="440" width="800" height="12" fill="#0077b6"/>
      <path d="M120 420 L300 420 L270 470 L150 470 Z" fill="#d00000"/>
      <rect x="205" y="300" width="8" height="120" fill="#2b2d42"/>
      <path d="M213 305 L213 410 L285 410 Z" fill="#fefae0"/>
      <path d="M520 450 L700 450 L670 500 L550 500 Z" fill="#ffba08"/>
      <rect x="605" y="330" width="8" height="120" fill="#2b2d42"/>
      <path d="M613 335 L613 440 L680 440 Z" fill="#fefae0"/>
      <rect x="720" y="200" width="40" height="130" fill="#ffffff"/>
      <rect x="720" y="240" width="40" height="25" fill="#d00000"/>
      <path d="M710 200 L740 170 L770 200 Z" fill="#2b2d42"/>`),
  },
];

export function sceneUrl(scene: Scene) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(scene.svg)}`;
}
