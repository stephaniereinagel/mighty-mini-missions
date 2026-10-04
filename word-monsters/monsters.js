// Painted monster art. Every word, color, shape, number, or letter gets its own monster:
// one of ten painted species, tinted to its color, with the clue drawn on its tummy.
(() => {
  "use strict";

  function hash(str, salt = 0) {
    let h = (2166136261 ^ (salt * 2654435761)) >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h ^= h >>> 13;
    h = Math.imul(h, 2246822507);
    h ^= h >>> 16;
    return h >>> 0;
  }

  // Per species, per stage: [width, height, belly center x, belly center y, belly width, belly height]
  // (belly values are fractions of the sprite). Sprites live in images/monsters/m{species}-{stage}{b|f}.webp:
  // "b" is the grayscale fur that gets tinted, "f" is everything painted on top (eyes, tummy, crown, wings).
  const SPRITES = [
    [[325, 360, 0.505, 0.729, 0.461, 0.338], [288, 360, 0.459, 0.676, 0.409, 0.331], [293, 360, 0.489, 0.693, 0.399, 0.323]],
    [[271, 360, 0.494, 0.761, 0.513, 0.265], [270, 360, 0.464, 0.73, 0.418, 0.288], [291, 360, 0.496, 0.735, 0.399, 0.298]],
    [[310, 360, 0.5, 0.726, 0.295, 0.236], [286, 360, 0.512, 0.681, 0.322, 0.286], [304, 360, 0.494, 0.711, 0.295, 0.273]],
    [[250, 360, 0.641, 0.664, 0.33, 0.281], [250, 360, 0.574, 0.642, 0.32, 0.291], [251, 360, 0.639, 0.656, 0.287, 0.283]],
    [[309, 360, 0.544, 0.738, 0.429, 0.309], [273, 360, 0.48, 0.69, 0.388, 0.346], [258, 360, 0.488, 0.7, 0.397, 0.321]],
    [[309, 360, 0.503, 0.659, 0.418, 0.291], [295, 360, 0.535, 0.645, 0.429, 0.313], [309, 360, 0.474, 0.693, 0.357, 0.273]],
    [[280, 360, 0.633, 0.702, 0.295, 0.239], [289, 360, 0.573, 0.645, 0.268, 0.267], [291, 360, 0.375, 0.634, 0.265, 0.281]],
    [[282, 360, 0.494, 0.695, 0.397, 0.287], [295, 360, 0.537, 0.68, 0.356, 0.294], [306, 360, 0.464, 0.692, 0.319, 0.277]],
    [[257, 360, 0.498, 0.686, 0.443, 0.297], [278, 360, 0.544, 0.646, 0.39, 0.318], [271, 360, 0.458, 0.669, 0.352, 0.281]],
    [[329, 360, 0.54, 0.745, 0.385, 0.277], [347, 360, 0.495, 0.706, 0.371, 0.306], [340, 360, 0.438, 0.725, 0.324, 0.274]]
  ];
  // The fur layer's main tone is stored at this gray level, so tinting by color/FUR_GRAY lands on the color exactly.
  const FUR_GRAY = 0.82;
  const INK = "#2b2440";

  const COLOR_RGB = {
    red: [232, 52, 64],
    orange: [255, 140, 36],
    yellow: [255, 214, 40],
    green: [64, 190, 86],
    blue: [52, 124, 236],
    purple: [150, 84, 222],
    pink: [255, 120, 182],
    brown: [160, 100, 54],
    black: [60, 58, 72],
    white: [250, 250, 246],
    gray: [164, 170, 182],
    teal: [28, 182, 172],
    peach: [255, 188, 152],
    lavender: [196, 168, 255],
    gold: [242, 192, 40],
    navy: [44, 64, 152],
    lime: [166, 226, 46],
    maroon: [143, 35, 64]
  };

  function hslRgb(h, s, l) {
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0), f(8), f(4)].map(v => Math.round(v * 255));
  }

  function tummyBadge(word, key) {
    const t = (s, size = 28) => `<text x="100" y="159" text-anchor="middle" font-size="${size}" font-weight="900" fill="${INK}" font-family="Andika, sans-serif">${s}</text>`;
    const sound = /^\/([a-z])\/$/.exec(word);
    if (sound) return t(sound[1], 32);
    if (/^[0-9]+$/.test(word) || /^[A-Za-z]$/.test(word)) return t(String(word).toUpperCase());
    const poly = (pts, fill) => `<polygon points="${pts}" fill="${fill}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    switch (key) {
      case "heart": return `<path d="M100 142 C92 130 80 144 100 160 C120 144 108 130 100 142 Z" fill="#ff70a6" stroke="${INK}" stroke-width="2"/>`;
      case "star": return poly("100,136 103,145 112,145 105,150 108,159 100,154 92,159 95,150 88,145 97,145", "#ffd23f");
      case "circle": return `<circle cx="100" cy="150" r="11" fill="#ff3b5c" stroke="${INK}" stroke-width="2"/>`;
      case "oval": return `<ellipse cx="100" cy="150" rx="15" ry="10" fill="#ff9f1c" stroke="${INK}" stroke-width="2"/>`;
      case "square": return `<rect x="90" y="140" width="20" height="20" rx="3" fill="#2f80ed" stroke="${INK}" stroke-width="2"/>`;
      case "triangle": return poly("100,138 112,158 88,158", "#27ae60");
      case "diamond": return poly("100,138 112,150 100,162 88,150", "#8338ec");
      case "rectangle": return `<rect x="84" y="142" width="32" height="17" rx="3" fill="#3a86ff" stroke="${INK}" stroke-width="2"/>`;
      case "pentagon": return poly("100,138 112,147 107,161 93,161 88,147", "#ff70a6");
      case "hexagon": return poly("88,150 94,139 106,139 112,150 106,161 94,161", "#ffbe0b");
      case "octagon": return poly("95,138 105,138 112,145 112,155 105,162 95,162 88,155 88,145", "#e63946");
      case "trapezoid": return poly("93,140 107,140 115,160 85,160", "#27ae60");
      case "parallelogram": return poly("92,141 117,141 108,159 83,159", "#8338ec");
      case "crescent": return `<path d="M104.5 139.4 A11.2 11.2 0 1 0 104.5 160.6 A16.2 16.2 0 0 1 104.5 139.4 Z" fill="#f4c430" stroke="${INK}" stroke-width="2"/>`;
      case "semicircle": return `<path d="M86 156 A14 14 0 0 1 114 156 Z" fill="#00b4d8" stroke="${INK}" stroke-width="2"/>`;
      case "big": case "biggest": return `<circle cx="100" cy="150" r="13" fill="#ffd23f" stroke="${INK}" stroke-width="2"/>`;
      case "small": case "smallest": return `<circle cx="100" cy="153" r="5" fill="#ffd23f" stroke="${INK}" stroke-width="2"/>`;
      case "tall": case "tallest": return `<rect x="95" y="136" width="10" height="26" rx="2" fill="#19c3b3" stroke="${INK}" stroke-width="2"/>`;
      case "short": case "shortest": return `<rect x="95" y="152" width="10" height="10" rx="2" fill="#19c3b3" stroke="${INK}" stroke-width="2"/>`;
      case "more": return [88, 100, 112, 94, 106].map((x, i) => `<circle cx="${x}" cy="${i < 3 ? 146 : 157}" r="4.5" fill="#ff5fa2" stroke="${INK}" stroke-width="1.5"/>`).join("");
      case "less": return `<circle cx="100" cy="151" r="4.5" fill="#ff5fa2" stroke="${INK}" stroke-width="1.5"/>`;
      case "full": return `<path d="M89 140 H111 L108 162 H92 Z" fill="#4dabf7" stroke="${INK}" stroke-width="2"/>`;
      case "empty": return `<path d="M89 140 H111 L108 162 H92 Z" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
      default: return "";
    }
  }

  let uid = 0;

  // plain: hide the answer clues (true color and tummy badge) while the question is being asked.
  function monsterSVG(word, stage, silhouette = false, plain = false) {
    const key = String(word).toLowerCase();
    const st = Math.max(1, Math.min(3, stage | 0));
    const species = hash(key, 1) % SPRITES.length;
    const [w, h, bx, by, bw, bh] = SPRITES[species][st - 1];
    const delay = -((hash(key, 7) % 4000) / 1000);
    const id = `wm${++uid}`;

    const scale = [0.8, 0.91, 1][st - 1];
    const k = Math.min(186 / w, 186 / h) * scale;
    const dw = w * k, dh = h * k;
    const x = 100 - dw / 2, y = 196 - dh;
    const src = `images/monsters/m${species + 1}-${st}`;
    const imgs = `<image href="${src}b.webp" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${dw.toFixed(1)}" height="${dh.toFixed(1)}"${silhouette ? "" : ` filter="url(#${id})"`}/>
      <image href="${src}f.webp" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${dw.toFixed(1)}" height="${dh.toFixed(1)}"/>`;

    const cx = x + bx * dw, cy = y + by * dh;
    const bs = Math.min((bw * dw) / 42, (bh * dh) / 30);
    const onTummy = inner => `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${bs.toFixed(3)}) translate(-100 -150)">${inner}</g>`;

    let defs, art, extra = "";
    if (silhouette) {
      defs = `<filter id="${id}" color-interpolation-filters="sRGB"><feComponentTransfer in="SourceAlpha" result="a"><feFuncA type="linear" slope="3"/></feComponentTransfer>
        <feFlood flood-color="#4a4868"/><feComposite in2="a" operator="in"/></filter>`;
      art = `<g filter="url(#${id})">${imgs}</g>`;
      extra = onTummy(`<text x="100" y="166" text-anchor="middle" font-size="44" font-weight="700" fill="#8e8ab8" font-family="Andika, sans-serif">?</text>`);
    } else {
      const hue = hash(key, 9) % 360;
      const rgb = plain ? hslRgb(hue, 0.22, 0.74) : COLOR_RGB[key] || hslRgb(hue, 0.72, 0.6);
      const [r, g, b] = rgb.map(c => (c / 255 / FUR_GRAY).toFixed(3));
      defs = `<filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 0 0 0 0 1 0"/></filter>`;
      art = imgs;
      const badge = plain
        ? `<text x="100" y="161" text-anchor="middle" font-size="30" font-weight="900" fill="#9a8a78" font-family="Andika, sans-serif">?</text>`
        : tummyBadge(String(word), key);
      if (badge) extra = onTummy(badge);
      if (st >= 3) {
        extra += `<g transform="translate(176 40)"><polygon class="m-twinkle" points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#ffd23f" stroke="#fff" stroke-width="1.5"/></g>
          <g transform="translate(22 150)"><polygon class="m-twinkle m-twinkle2" points="0,-10 2,-2 10,0 2,2 0,10 -2,2 -10,0 -2,-2" fill="#ffd23f" stroke="#fff" stroke-width="1.5"/></g>`;
      }
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs}</defs>
      <g class="m-bob" style="animation-delay:${delay / 2}s">${art}${extra}</g></svg>`;
  }

  window.WM_ART = { hash, monsterSVG };
})();
