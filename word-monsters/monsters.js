// Procedural monster art. Every word always gets the same monster.
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

  function monsterSVG(word, stage, silhouette = false) {
    const pick = (n, salt) => hash(word, salt) % n;
    const hue = hash(word, 9) % 360;
    const body = silhouette ? "#4a4868" : `hsl(${hue} 82% 64%)`;
    const dark = silhouette ? "#3a3856" : `hsl(${hue} 62% 40%)`;
    const light = silhouette ? "#4a4868" : `hsl(${(hue + 35) % 360} 95% 83%)`;
    const horn = silhouette ? body : "#fff3c4";
    const s = stage >= 3 ? 1 : stage === 2 ? 0.92 : 0.82;
    const shape = BODIES[pick(BODIES.length, 1)];
    const eyes = EYES[pick(EYES.length, 2)];
    const mouth = pick(6, 3);
    const top = pick(4, 4);
    const spots = pick(2, 5) === 1;
    const extra = pick(6, 6);
    const delay = -((hash(word, 7) % 4000) / 1000);

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
      if (stage >= 2) front += `<ellipse cx="100" cy="150" rx="32" ry="21" fill="${light}" opacity=".9"/>`;
      if (spots) {
        front += `<circle cx="58" cy="140" r="7" fill="${dark}" opacity=".25"/>
                  <circle cx="146" cy="116" r="5" fill="${dark}" opacity=".25"/>
                  <circle cx="138" cy="158" r="6" fill="${dark}" opacity=".25"/>`;
      }
      let eyeSvg = "";
      eyes.forEach(([x, y, r]) => {
        eyeSvg += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
          <circle cx="${x + r * 0.12}" cy="${y + r * 0.18}" r="${r * 0.6}" fill="${INK}"/>
          <circle cx="${x + r * 0.34}" cy="${y - r * 0.08}" r="${r * 0.22}" fill="#fff"/>
          <circle cx="${x - r * 0.1}" cy="${y + r * 0.42}" r="${r * 0.1}" fill="#fff"/>`;
      });
      front += `<g class="m-eyes" style="animation-delay:${delay}s">${eyeSvg}</g>`;
      front += `<ellipse cx="62" cy="126" rx="11" ry="7" fill="#ff7aa8" opacity=".6"/>
                <ellipse cx="138" cy="126" rx="11" ry="7" fill="#ff7aa8" opacity=".6"/>`;
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
        front += `<path d="M76 50 L80 26 L91 40 L100 20 L109 40 L120 26 L124 50Z" fill="#ffd23f" stroke="#d89c00" stroke-width="3" stroke-linejoin="round"/>
                  <circle cx="100" cy="40" r="4" fill="#ff5fa2"/>
                  <text class="m-twinkle" x="166" y="40" font-size="26">\u2728</text>
                  <text class="m-twinkle m-twinkle2" x="10" y="168" font-size="22">\u2728</text>`;
      }
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="translate(100 112) scale(${s}) translate(-100 -112)">
        <g class="m-bob" style="animation-delay:${delay / 2}s">${back}${front}</g></g></svg>`;
  }

  window.WM_ART = { hash, monsterSVG };
})();
