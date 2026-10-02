// Procedural monster art. Every word, color, shape, number, or letter gets a cute unique monster.
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

  const BODIES = [
    "M100 46 C150 40 170 80 162 120 C170 160 140 182 100 178 C60 182 28 160 38 120 C30 80 50 50 100 46Z",
    "M100 40 C140 40 160 90 165 130 C170 170 140 180 100 180 C60 180 30 170 35 130 C40 90 60 40 100 40Z",
    "M40 110 C40 60 70 42 100 42 C130 42 160 60 160 110 L160 176 L140 163 L120 176 L100 163 L80 176 L60 163 L40 176Z",
    "M100 52 C148 52 166 78 166 116 C166 158 140 180 100 180 C60 180 34 158 34 116 C34 78 52 52 100 52Z"
  ];
  const EYES = [
    [[100, 96, 23]],
    [[77, 98, 17], [123, 98, 17]],
    [[69, 102, 13], [100, 84, 15], [131, 102, 13]]
  ];
  const INK = "#2b2440";

  const COLOR_HUES = {
    red: 350,
    orange: 25,
    yellow: 48,
    green: 140,
    blue: 215,
    purple: 275,
    pink: 335
  };

  // Colors that can't be made from a hue alone: [body, outline, belly]
  const COLOR_PAL = {
    brown: ["#a8693a", "#6b4022", "#e3b88c"],
    black: ["#3a3846", "#15141c", "#6e6a84"],
    white: ["#f6f5fb", "#9a98ad", "#ffffff"],
    gray: ["#a9adb8", "#6b7080", "#dfe2e8"],
    teal: ["#1fb5ac", "#0d7a74", "#a4f0e8"],
    peach: ["#ffbd9b", "#d9805a", "#ffe4d4"],
    lavender: ["#c4a8ff", "#8a6bd1", "#ede3ff"],
    gold: ["#f2c230", "#b98a00", "#fff0a8"],
    navy: ["#2f4296", "#16224f", "#8ea0e0"],
    lime: ["#a6e22e", "#6c9c10", "#e4ffad"],
    maroon: ["#8f2340", "#561226", "#e08aa2"]
  };

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

  // plain: hide the answer clues (true color and tummy badge) while the question is being asked.
  function monsterSVG(word, stage, silhouette = false, plain = false) {
    const key = String(word).toLowerCase();
    const pick = (n, salt) => hash(key, salt) % n;

    const pal = plain ? null : COLOR_PAL[key];
    const hue = !plain && COLOR_HUES[key] !== undefined ? COLOR_HUES[key] : (hash(key, 9) % 360);
    const body = silhouette ? "#4a4868" : pal ? pal[0] : `hsl(${hue} 85% 62%)`;
    const dark = silhouette ? "#3a3856" : pal ? pal[1] : `hsl(${hue} 65% 38%)`;
    const light = silhouette ? "#4a4868" : pal ? pal[2] : `hsl(${(hue + 25) % 360} 95% 85%)`;
    const horn = silhouette ? body : "#fff3c4";
    const s = stage >= 3 ? 1 : stage === 2 ? 0.92 : 0.82;
    const shape = BODIES[pick(BODIES.length, 1)];
    const eyes = EYES[pick(EYES.length, 2)];
    const mouth = pick(6, 3);
    const top = pick(4, 4);
    const spots = pick(2, 5) === 1;
    const extra = pick(6, 6);
    const delay = -((hash(key, 7) % 4000) / 1000);

    let back = "";
    if (stage >= 3) {
      back += `<g class="m-wings">
        <ellipse cx="40" cy="94" rx="38" ry="21" transform="rotate(-30 40 94)" fill="${light}" stroke="${dark}" stroke-width="3"/>
        <ellipse cx="160" cy="94" rx="38" ry="21" transform="rotate(30 160 94)" fill="${light}" stroke="${dark}" stroke-width="3"/></g>`;
    }
    const tops = [
      `<g class="m-antennae">
       <path d="M84 60 Q72 40 70 20" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>
       <path d="M116 60 Q128 40 130 20" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>
       <circle cx="70" cy="18" r="9" fill="${light}" stroke="${dark}" stroke-width="3"/>
       <circle cx="130" cy="18" r="9" fill="${light}" stroke="${dark}" stroke-width="3"/></g>`,
      `<path d="M68 66 L60 24 L90 54Z" fill="${horn}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>
       <path d="M132 66 L140 24 L110 54Z" fill="${horn}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>`,
      `<circle cx="60" cy="62" r="21" fill="${body}" stroke="${dark}" stroke-width="3"/>
       <circle cx="140" cy="62" r="21" fill="${body}" stroke="${dark}" stroke-width="3"/>
       <circle cx="60" cy="62" r="11" fill="${light}"/><circle cx="140" cy="62" r="11" fill="${light}"/>`,
      `<path d="M100 60 C88 34 94 20 100 12 C106 20 112 34 100 60Z" fill="${light}" stroke="${dark}" stroke-width="3"/>
       <path d="M96 60 C76 44 74 30 76 22 C86 26 96 38 96 60Z" fill="${light}" stroke="${dark}" stroke-width="3"/>
       <path d="M104 60 C124 44 126 30 124 22 C114 26 104 38 104 60Z" fill="${light}" stroke="${dark}" stroke-width="3"/>`
    ];
    back += tops[top];
    if (stage >= 2 && top !== 1) {
      back += `<path d="M80 58 L76 36 L92 52Z" fill="${horn}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>
               <path d="M120 58 L124 36 L108 52Z" fill="${horn}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>`;
    }

    let front = `
      <ellipse cx="38" cy="128" rx="11" ry="19" transform="rotate(25 38 128)" fill="${body}" stroke="${dark}" stroke-width="3"/>
      <g class="m-wave"><ellipse cx="162" cy="128" rx="11" ry="19" transform="rotate(-25 162 128)" fill="${body}" stroke="${dark}" stroke-width="3"/></g>
      <ellipse cx="76" cy="180" rx="18" ry="9" fill="${dark}"/>
      <ellipse cx="124" cy="180" rx="18" ry="9" fill="${dark}"/>
      <path d="${shape}" fill="${body}" stroke="${dark}" stroke-width="4" stroke-linejoin="round"/>`;

    if (silhouette) {
      front += `<text x="100" y="138" text-anchor="middle" font-size="66" font-weight="700" fill="#8e8ab8" font-family="Andika, sans-serif">?</text>`;
    } else {
      front += `<ellipse cx="70" cy="70" rx="15" ry="8" transform="rotate(-35 70 70)" fill="#fff" opacity=".45"/>
                <circle cx="86" cy="60" r="3.5" fill="#fff" opacity=".55"/>`;

      // Belly Patch
      front += `<ellipse cx="100" cy="150" rx="30" ry="20" fill="${light}" opacity=".92"/>`;

      const badge = plain ? `<text x="100" y="161" text-anchor="middle" font-size="30" font-weight="900" fill="${dark}" font-family="Andika, sans-serif">?</text>` : tummyBadge(String(word), key);
      if (badge) {
        front += badge;
      } else if (spots) {
        front += `<circle cx="58" cy="140" r="7" fill="${dark}" opacity=".25"/>
                  <circle cx="146" cy="116" r="5" fill="${dark}" opacity=".25"/>`;
      }

      // Friendly Big Eyes
      let eyeSvg = "";
      eyes.forEach(([x, y, r]) => {
        eyeSvg += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
          <circle cx="${x + r * 0.12}" cy="${y + r * 0.18}" r="${r * 0.6}" fill="${INK}"/>
          <circle cx="${x + r * 0.34}" cy="${y - r * 0.08}" r="${r * 0.22}" fill="#fff"/>
          <circle cx="${x - r * 0.1}" cy="${y + r * 0.42}" r="${r * 0.1}" fill="#fff"/>`;
      });
      front += `<g class="m-eyes" style="animation-delay:${delay}s">${eyeSvg}</g>`;
      // Cheerful Blushing Cheeks
      front += `<ellipse cx="62" cy="126" rx="11" ry="7" fill="#ff7aa8" opacity=".65"/>
                <ellipse cx="138" cy="126" rx="11" ry="7" fill="#ff7aa8" opacity=".65"/>`;

      const mouths = [
        `<path d="M84 128 Q100 146 116 128" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
        `<path d="M84 126 Q100 154 116 126 Z" fill="${INK}"/><ellipse cx="100" cy="141" rx="8" ry="5" fill="#ff6f91"/>`,
        `<path d="M82 126 Q100 152 118 126 Z" fill="${INK}"/><rect x="89" y="126" width="9" height="9" rx="2" fill="#fff"/><rect x="102" y="126" width="9" height="9" rx="2" fill="#fff"/>`,
        `<ellipse cx="100" cy="134" rx="8" ry="10" fill="${INK}"/>`,
        `<path d="M84 128 Q100 142 116 128" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
         <path d="M94 134 Q94 150 101 150 Q108 150 108 134 Z" fill="#ff6f91" stroke="${INK}" stroke-width="2.5"/>`,
        `<path d="M82 126 Q100 148 118 126" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
         <path d="M88 129 L92 138 L95 131Z" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
         <path d="M112 129 L108 138 L105 131Z" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`
      ];
      front += mouths[mouth];

      if (stage < 3) {
        const extras = [
          "",
          `<g transform="translate(136 50) rotate(15)"><path d="M0 0 L-16 -10 L-16 10Z M0 0 L16 -10 L16 10Z" fill="#ff5fa2" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><circle r="5" fill="#ff9ccb" stroke="${INK}" stroke-width="2"/></g>`,
          top === 1 || top === 2
            ? `<path d="M100 6 L84 52 L116 52Z" fill="#ffd23f" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
               <path d="M92 30 L108 30 M88 42 L112 42" stroke="#ff5fa2" stroke-width="4"/><circle cx="100" cy="6" r="6" fill="#19c3b3" stroke="${INK}" stroke-width="2"/>`
            : "",
          `<g transform="translate(138 54)"><circle cx="0" cy="-8" r="6" fill="#fff"/><circle cx="8" cy="-2" r="6" fill="#fff"/><circle cx="5" cy="7" r="6" fill="#fff"/><circle cx="-5" cy="7" r="6" fill="#fff"/><circle cx="-8" cy="-2" r="6" fill="#fff"/><circle r="5" fill="#ffd23f"/></g>`,
          "",
          ""
        ];
        front += extras[extra];
      } else {
        // Stage 3 Crown and Sparkles
        front += `<path d="M76 50 L80 26 L91 40 L100 20 L109 40 L120 26 L124 50Z" fill="#ffd23f" stroke="#d89c00" stroke-width="3" stroke-linejoin="round"/>
                  <circle cx="100" cy="40" r="4" fill="#ff5fa2"/>
                  <g class="m-twinkle" transform="translate(170 35)">
                    <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#ffd23f"/>
                  </g>
                  <g class="m-twinkle m-twinkle2" transform="translate(25 155)">
                    <polygon points="0,-10 2,-2 10,0 2,2 0,10 -2,2 -10,0 -2,-2" fill="#ffd23f"/>
                  </g>`;
      }
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="translate(100 112) scale(${s}) translate(-100 -112)">
        <g class="m-bob" style="animation-delay:${delay / 2}s">${back}${front}</g></g></svg>`;
  }

  window.WM_ART = { hash, monsterSVG };
})();
