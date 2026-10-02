// The home-screen island map.
(() => {
  "use strict";

  const { monsterSVG } = window.WM_ART;
  const INK = "#2b2440";
  const ISLAND = "M120 520 C50 430 100 300 220 270 C290 150 460 80 610 110 C760 60 950 120 935 270 C990 390 910 540 760 575 C600 640 290 625 120 520Z";

  const ZONES = {
    meadow: {
      x: 250, y: 430,
      art: `
        <ellipse cx="250" cy="440" rx="170" ry="105" fill="#c8f5a0" stroke="#86cf6a" stroke-width="5"/>
        <ellipse cx="200" cy="410" rx="70" ry="30" fill="#dcffbf" opacity=".8"/>
        <g class="map-sun"><circle cx="130" cy="330" r="34" fill="#ffd23f" stroke="#f0a500" stroke-width="5"/>
          <path d="M130 282 V268 M130 378 V392 M82 330 H68 M178 330 H192 M96 296 L86 286 M164 364 L174 374 M96 364 L86 374 M164 296 L174 286" stroke="#f0a500" stroke-width="6" stroke-linecap="round"/></g>
        <text x="150" y="470" font-size="44">\u{1F337}</text>
        <text x="330" y="420" font-size="40">\u{1F33C}</text>
        <text x="300" y="500" font-size="42">\u{1F338}</text>
        <text x="190" y="515" font-size="36">\u{1F33B}</text>
        <text x="370" y="480" font-size="34">\u{1F337}</text>
        <text class="map-flyer" x="270" y="370" font-size="38">\u{1F98B}</text>`,
      mons: [[175, 395], [290, 445], [215, 455]]
    },
    woods: {
      x: 520, y: 240,
      art: `
        <ellipse cx="520" cy="250" rx="180" ry="112" fill="#62c46c" stroke="#3e9a4b" stroke-width="5"/>
        <ellipse cx="470" cy="220" rx="80" ry="34" fill="#7fd888" opacity=".7"/>
        <text x="370" y="250" font-size="70">\u{1F332}</text>
        <text x="600" y="235" font-size="76">\u{1F333}</text>
        <text x="460" y="205" font-size="62">\u{1F332}</text>
        <text x="640" y="320" font-size="56">\u{1F332}</text>
        <text x="390" y="330" font-size="40">\u{1F344}</text>
        <text x="575" y="335" font-size="34">\u{1F344}</text>
        <text class="map-flyer map-flyer2" x="540" y="160" font-size="34">\u{1F426}</text>`,
      mons: [[445, 255], [560, 260], [500, 300]]
    },
    cave: {
      x: 800, y: 420,
      art: `
        <path d="M640 530 L715 340 L760 390 L825 270 L885 360 L950 530 Z" fill="#a491e0" stroke="#6d58b0" stroke-width="6" stroke-linejoin="round"/>
        <path d="M825 270 L800 318 L820 310 L835 326 L851 306 Z" fill="#fff" opacity=".85"/>
        <path d="M715 340 L703 372 L716 366 L728 376Z" fill="#fff" opacity=".8"/>
        <path d="M748 530 C748 445 852 445 852 530Z" fill="${INK}"/>
        <circle cx="782" cy="492" r="6" fill="#ffd23f"/><circle cx="812" cy="492" r="6" fill="#ffd23f"/>
        <text x="650" y="525" font-size="42">\u{1F48E}</text>
        <text x="880" y="520" font-size="46">\u{1F48E}</text>
        <text x="900" y="430" font-size="34">\u{1F52E}</text>
        <text class="map-twinkle" x="700" y="440" font-size="34">\u2728</text>
        <text class="map-twinkle map-twinkle2" x="860" y="330" font-size="30">\u2728</text>
        <text class="map-flyer map-flyer3" x="740" y="300" font-size="36">\u{1F987}</text>`,
      mons: [[690, 455], [880, 455], [800, 395]]
    }
  };

  const LABEL_Y = { meadow: 560, woods: 385, cave: 572 };
  const BUDDY_AT = { meadow: [395, 520], woods: [700, 215], cave: [605, 480] };

  function nested(word, stage, x, y, size, cls, silhouette) {
    const svg = monsterSVG(word, stage, silhouette)
      .replace("<svg ", `<svg x="${x - size / 2}" y="${y - size * 0.82}" width="${size}" height="${size}" overflow="visible" `);
    return `<g class="${cls}" data-w="${word}">${svg}</g>`;
  }

  function label(r, z) {
    const y = LABEL_Y[r.id];
    const w = Math.max(230, r.name.length * 19 + 50);
    const sub = r.open
      ? `<g transform="translate(${z.x} ${y + 40})"><rect x="-62" y="-20" width="124" height="38" rx="19" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>
          <text y="9" text-anchor="middle" font-size="24" font-weight="700" fill="${INK}">\u2B50 ${r.caught}/${r.total}</text></g>`
      : `<g transform="translate(${z.x} ${y + 40})"><rect x="-110" y="-20" width="220" height="38" rx="19" fill="#fff" stroke="${INK}" stroke-width="4"/>
          <text y="9" text-anchor="middle" font-size="22" font-weight="700" fill="${INK}">\u{1F512} Catch ${r.need} more</text></g>`;
    return `<g class="map-label">
      <rect x="${z.x - w / 2}" y="${y - 30}" width="${w}" height="54" rx="27" fill="#fff" stroke="${INK}" stroke-width="5"/>
      <text x="${z.x}" y="${y + 7}" text-anchor="middle" font-size="31" font-weight="700" fill="${r.color}">${r.name}</text>
      ${sub}</g>`;
  }

  function mapSVG({ regions, current, buddy }) {
    const waves = [[60, 80], [880, 60], [40, 600], [940, 610], [500, 30], [330, 615], [960, 330], [30, 300]]
      .map(([x, y], i) => `<path class="map-wave" style="animation-delay:${-i * 0.4}s" d="M${x - 30} ${y} q15 -12 30 0 t30 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>`)
      .join("");

    const zones = regions.map((r) => {
      const z = ZONES[r.id];
      const mons = r.open ? r.mons.slice(0, 3).map((m, i) => nested(m.w, m.stage, z.mons[i][0], z.mons[i][1] + 40, 74, "map-mon", false)).join("") : "";
      const lock = r.open ? "" : `<g class="map-lock"><circle cx="${z.x}" cy="${z.y}" r="52" fill="#fff" stroke="${INK}" stroke-width="5"/>
        <text x="${z.x}" y="${z.y + 20}" text-anchor="middle" font-size="56">\u{1F512}</text></g>`;
      return `<g class="zone ${r.open ? "open" : "locked"} ${r.id === current ? "current" : ""}" data-region="${r.id}" role="button" aria-label="${r.name}">
        <g class="zone-art">${z.art}</g>${mons}${lock}${label(r, z)}</g>`;
    }).join("");

    const spot = BUDDY_AT[current];
    const buddySvg = spot ? `<g class="map-buddy">${nested(buddy, 2, spot[0], spot[1], 104, "buddy", false)}</g>` : "";

    return `<svg viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" font-family="Andika, sans-serif">
      <defs>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fe0ff"/><stop offset="1" stop-color="#4fb0ef"/></linearGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="640" rx="44" fill="url(#sea)"/>
      ${waves}
      <path d="${ISLAND}" fill="none" stroke="#f2c063" stroke-width="48" stroke-linejoin="round"/>
      <path d="${ISLAND}" fill="#a7e88a" stroke="#ffe7a1" stroke-width="36" stroke-linejoin="round"/>
      <path class="map-trail" d="M270 410 C300 300 380 250 450 262 S640 300 700 340 S760 400 790 430" fill="none" stroke="#c98a3a" stroke-width="10" stroke-dasharray="4 22" stroke-linecap="round"/>
      <text x="905" y="125" font-size="60" class="map-compass">\u{1F9ED}</text>
      <text x="60" y="185" font-size="46" class="map-boat">\u26F5</text>
      ${zones}
      ${buddySvg}
    </svg>`;
  }

  window.WM_MAP = { mapSVG };
})();
