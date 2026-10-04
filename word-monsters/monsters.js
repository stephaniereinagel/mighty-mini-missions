// Painted monster art. Every word, color, shape, number, or letter gets its own monster:
// one of ten painted species, tinted to its color.
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

  // Per species, per stage: [width, height]. Sprites live in images/monsters/m{species}-{stage}{b|f}.webp:
  // "b" is the grayscale fur that gets tinted, "f" is everything painted on top (eyes, tummy, crown, wings).
  const SPRITES = [
    [[325, 360], [288, 360], [293, 360]],
    [[271, 360], [270, 360], [291, 360]],
    [[310, 360], [286, 360], [304, 360]],
    [[250, 360], [250, 360], [251, 360]],
    [[309, 360], [273, 360], [258, 360]],
    [[309, 360], [295, 360], [309, 360]],
    [[280, 360], [289, 360], [291, 360]],
    [[282, 360], [295, 360], [306, 360]],
    [[257, 360], [278, 360], [271, 360]],
    [[329, 360], [347, 360], [340, 360]]
  ];
  // The fur layer's main tone is stored at this gray level, so tinting by color/FUR_GRAY lands on the color exactly.
  const FUR_GRAY = 0.82;
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

  let uid = 0;

  // plain: hide the true color while the question is being asked.
  function monsterSVG(word, stage, silhouette = false, plain = false) {
    const key = String(word).toLowerCase();
    const st = Math.max(1, Math.min(3, stage | 0));
    const species = hash(key, 1) % SPRITES.length;
    const [w, h] = SPRITES[species][st - 1];
    const delay = -((hash(key, 7) % 4000) / 1000);
    const id = `wm${++uid}`;

    const scale = [0.8, 0.91, 1][st - 1];
    const k = Math.min(186 / w, 186 / h) * scale;
    const dw = w * k, dh = h * k;
    const x = 100 - dw / 2, y = 196 - dh;
    const src = `images/monsters/m${species + 1}-${st}`;
    const imgs = `<image href="${src}b.webp" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${dw.toFixed(1)}" height="${dh.toFixed(1)}"${silhouette ? "" : ` filter="url(#${id})"`}/>
      <image href="${src}f.webp" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${dw.toFixed(1)}" height="${dh.toFixed(1)}"/>`;

    let defs, art, extra = "";
    if (silhouette) {
      defs = `<filter id="${id}" color-interpolation-filters="sRGB"><feComponentTransfer in="SourceAlpha" result="a"><feFuncA type="linear" slope="3"/></feComponentTransfer>
        <feFlood flood-color="#4a4868"/><feComposite in2="a" operator="in"/></filter>`;
      art = `<g filter="url(#${id})">${imgs}</g>`;
    } else {
      const hue = hash(key, 9) % 360;
      const rgb = plain ? hslRgb(hue, 0.22, 0.74) : COLOR_RGB[key] || hslRgb(hue, 0.72, 0.6);
      const [r, g, b] = rgb.map(c => (c / 255 / FUR_GRAY).toFixed(3));
      defs = `<filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 0 0 0 0 1 0"/></filter>`;
      art = imgs;
      if (st >= 3) {
        extra = `<g transform="translate(176 40)"><polygon class="m-twinkle" points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#ffd23f" stroke="#fff" stroke-width="1.5"/></g>
          <g transform="translate(22 150)"><polygon class="m-twinkle m-twinkle2" points="0,-10 2,-2 10,0 2,2 0,10 -2,2 -10,0 -2,-2" fill="#ffd23f" stroke="#fff" stroke-width="1.5"/></g>`;
      }
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs}</defs>
      <g class="m-bob" style="animation-delay:${delay / 2}s">${art}${extra}</g></svg>`;
  }

  window.WM_ART = { hash, monsterSVG };
})();
