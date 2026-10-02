// Hand-crafted Cartoon Storybook Island Map for Word Monsters.
// 100% pure SVG vector illustration — NO emojis.
// Designed for Connor (3), Kyler (almost 3), and Ethan (2).

(() => {
  "use strict";

  const { monsterSVG } = window.WM_ART;
  const INK = "#2b2440";

  // Reusable vector art components for the map
  const ART = {
    // A smiling cartoon daisy
    flower(x, y, petalColor = "#ffffff", centerColor = "#ffd23f", size = 1) {
      return `<g transform="translate(${x} ${y}) scale(${size})" class="map-flower" pointer-events="none">
        <circle cx="-14" cy="0" r="10" fill="${petalColor}" stroke="${INK}" stroke-width="2.5"/>
        <circle cx="14" cy="0" r="10" fill="${petalColor}" stroke="${INK}" stroke-width="2.5"/>
        <circle cx="0" cy="-14" r="10" fill="${petalColor}" stroke="${INK}" stroke-width="2.5"/>
        <circle cx="0" cy="14" r="10" fill="${petalColor}" stroke="${INK}" stroke-width="2.5"/>
        <circle cx="-10" cy="-10" r="10" fill="${petalColor}" stroke="${INK}" stroke-width="2.5"/>
        <circle cx="10" cy="-10" r="10" fill="${petalColor}" stroke="${INK}" stroke-width="2.5"/>
        <circle cx="-10" cy="10" r="10" fill="${petalColor}" stroke="${INK}" stroke-width="2.5"/>
        <circle cx="10" cy="10" r="10" fill="${petalColor}" stroke="${INK}" stroke-width="2.5"/>
        <circle cx="0" cy="0" r="12" fill="${centerColor}" stroke="${INK}" stroke-width="2.5"/>
        <circle cx="-3" cy="-2" r="2" fill="${INK}"/>
        <circle cx="3" cy="-2" r="2" fill="${INK}"/>
        <path d="M-3 3 Q0 6 3 3" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
      </g>`;
    },

    // A cute spotted toadstool mushroom
    mushroom(x, y, capColor = "#ff3b5c", size = 1) {
      return `<g transform="translate(${x} ${y}) scale(${size})" pointer-events="none">
        <path d="M-9 16 C-9 6 -6 4 0 4 C6 4 9 6 9 16 Z" fill="#fff5ea" stroke="${INK}" stroke-width="2.5"/>
        <path d="M-22 6 C-22 -14 22 -14 22 6 C14 8 -14 8 -22 6 Z" fill="${capColor}" stroke="${INK}" stroke-width="2.5"/>
        <circle cx="-9" cy="-3" r="3.5" fill="#ffffff"/>
        <circle cx="4" cy="-5" r="4.5" fill="#ffffff"/>
        <circle cx="13" cy="2" r="2.5" fill="#ffffff"/>
        <circle cx="-4" cy="3" r="2" fill="#ffffff"/>
      </g>`;
    },

    // A layered cartoon pine tree
    pineTree(x, y, color = "#2d8048", size = 1) {
      return `<g transform="translate(${x} ${y}) scale(${size})" pointer-events="none">
        <rect x="-6" y="24" width="12" height="14" rx="3" fill="#8b5a2b" stroke="${INK}" stroke-width="2.5"/>
        <path d="M-28 28 L0 -4 L28 28 C18 24 -18 24 -28 28 Z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M-24 12 L0 -14 L24 12 C16 9 -16 9 -24 12 Z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M-18 -4 L0 -26 L18 -4 C12 -6 -12 -6 -18 -4 Z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="0" cy="-26" r="3.5" fill="#ffd23f"/>
      </g>`;
    },

    // A fluffy round deciduous tree
    roundTree(x, y, color = "#42b86c", size = 1) {
      return `<g transform="translate(${x} ${y}) scale(${size})" pointer-events="none">
        <path d="M-5 12 L-6 32 C-6 34 6 34 6 32 L5 12 Z" fill="#8b5a2b" stroke="${INK}" stroke-width="2.5"/>
        <circle cx="-15" cy="0" r="16" fill="${color}" stroke="${INK}" stroke-width="3"/>
        <circle cx="15" cy="0" r="16" fill="${color}" stroke="${INK}" stroke-width="3"/>
        <circle cx="0" cy="-14" r="18" fill="${color}" stroke="${INK}" stroke-width="3"/>
        <circle cx="0" cy="4" r="18" fill="${color}" stroke="${INK}" stroke-width="3"/>
        <ellipse cx="-4" cy="-8" rx="8" ry="4" fill="#ffffff" opacity=".35" transform="rotate(-20 -4 -8)"/>
      </g>`;
    },

    // A cartoon crystal shard
    crystal(x, y, rot = 0, color = "#00f0ff", size = 1) {
      return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${size})" pointer-events="none">
        <polygon points="0,-36 10,-12 10,24 -10,24 -10,-12" fill="${color}" stroke="${INK}" stroke-width="2.5"/>
        <polygon points="0,-36 10,-12 0,24 0,-12" fill="#ffffff" opacity=".45"/>
        <polygon points="0,-36 -10,-12 -6,-8" fill="#ffffff" opacity=".7"/>
      </g>`;
    },

    // A wooden signpost for each zone with a crisp vector golden star
    sign(x, y, title, subtitle, caught, total, accentColor) {
      const w = 224;
      return `<g class="map-sign" transform="translate(${x} ${y})">
        <!-- Wooden Post -->
        <rect x="-9" y="16" width="18" height="42" rx="4" fill="#9c6634" stroke="${INK}" stroke-width="3"/>
        <rect x="-6" y="20" width="4" height="34" fill="#b87b42"/>
        <!-- Main Board -->
        <g class="sign-board">
          <rect x="-112" y="-36" width="${w}" height="56" rx="18" fill="#fffdf6" stroke="${INK}" stroke-width="4.5"/>
          <path d="M-108 -32 H108" stroke="${accentColor}" stroke-width="4" stroke-linecap="round"/>
          <text y="-10" text-anchor="middle" font-size="23" font-weight="800" fill="${accentColor}">${title}</text>
          <text y="12" text-anchor="middle" font-size="14.5" font-weight="700" fill="#665b78">${subtitle}</text>
          <!-- Star Badge Pill with Vector Star -->
          <g transform="translate(0 30)">
            <rect x="-62" y="-13" width="124" height="26" rx="13" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/>
            <!-- Vector Star Icon -->
            <polygon points="-28,-5 -25,-1 -20,-1 -24,2 -22,7 -28,3 -34,7 -32,2 -36,-1 -31,-1" fill="${INK}"/>
            <text x="6" y="5" text-anchor="middle" font-size="15" font-weight="800" fill="${INK}">${caught} / ${total}</text>
          </g>
        </g>
      </g>`;
    }
  };

  function nested(word, stage, x, y, size, cls) {
    const svg = monsterSVG(word, stage, false)
      .replace("<svg ", `<svg x="${x - size / 2}" y="${y - size * 0.82}" width="${size}" height="${size}" overflow="visible" `);
    return `<g class="${cls}" data-w="${word}">${svg}</g>`;
  }

  function mapSVG({ regions, current, buddy }) {
    const rMeadow = regions.find((r) => r.id === "meadow") || { caught: 0, total: 14 };
    const rWoods = regions.find((r) => r.id === "woods") || { caught: 0, total: 10 };
    const rCave = regions.find((r) => r.id === "cave") || { caught: 0, total: 26 };

    // Buddy position for each zone
    const BUDDY_POS = {
      meadow: [320, 480],
      woods: [510, 185],
      cave: [685, 470]
    };
    const bPos = BUDDY_POS[current] || BUDDY_POS.meadow;

    return `<svg viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" font-family="Andika, sans-serif">
      <defs>
        <!-- Ocean gradient -->
        <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#72e2ff"/>
          <stop offset="45%" stop-color="#46c8fc"/>
          <stop offset="100%" stop-color="#1ea8f0"/>
        </linearGradient>

        <!-- Island Grass Gradient -->
        <linearGradient id="grassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#b8f26a"/>
          <stop offset="40%" stop-color="#8ee249"/>
          <stop offset="100%" stop-color="#5fb32e"/>
        </linearGradient>

        <!-- Meadow Hill Gradient -->
        <linearGradient id="meadowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c9f87a"/>
          <stop offset="100%" stop-color="#8ad840"/>
        </linearGradient>

        <!-- Mountain Rock Gradient -->
        <linearGradient id="rockGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#bca8f5"/>
          <stop offset="50%" stop-color="#8e74db"/>
          <stop offset="100%" stop-color="#5a42a8"/>
        </linearGradient>

        <!-- Sand Beach Gradient -->
        <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffeaa7"/>
          <stop offset="100%" stop-color="#f4c865"/>
        </linearGradient>
      </defs>

      <!-- ==================== 1. TROPICAL SEA (NON-INTERACTIVE) ==================== -->
      <g pointer-events="none">
        <rect x="0" y="0" width="1000" height="640" rx="36" fill="url(#oceanGrad)"/>

        <!-- Shallow Water Coral / Sandbar Glows -->
        <path d="M120 480 C60 380 90 260 210 220 C320 100 480 60 640 80 C800 50 960 120 950 300 C990 420 900 560 760 600 C580 660 260 630 120 480 Z"
              fill="#a6f1ff" opacity=".5"/>

        <!-- Gentle Water Waves -->
        <g stroke="#ffffff" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".75">
          <path class="map-wave" d="M70 120 Q85 108 100 120 T130 120"/>
          <path class="map-wave" style="animation-delay:-0.8s" d="M850 90 Q865 78 880 90 T910 90"/>
          <path class="map-wave" style="animation-delay:-1.6s" d="M90 560 Q105 548 120 560 T150 560"/>
          <path class="map-wave" style="animation-delay:-0.4s" d="M880 580 Q895 568 910 580 T940 580"/>
          <path class="map-wave" style="animation-delay:-1.2s" d="M490 35 Q505 23 520 35 T550 35"/>
          <path class="map-wave" style="animation-delay:-2.0s" d="M920 330 Q935 318 950 330 T980 330"/>
          <path class="map-wave" style="animation-delay:-0.6s" d="M40 320 Q55 308 70 320 T100 320"/>
        </g>

        <!-- Cartoon Sailboat in Sea -->
        <g class="map-boat" transform="translate(110 185) scale(0.92)">
          <!-- Wooden Hull -->
          <path d="M-28 14 C-18 26 18 26 28 14 L24 2 L-24 2 Z" fill="#8e5828" stroke="${INK}" stroke-width="2.5"/>
          <!-- Mast -->
          <line x1="0" y1="2" x2="0" y2="-36" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
          <!-- Main Sail (Pink & White Stripes) -->
          <path d="M2 -34 L2 0 L24 0 Z" fill="#ff70a6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M2 -22 L14 0 L2 0 Z" fill="#ffffff"/>
          <!-- Jib Sail -->
          <path d="M-2 -30 L-2 -2 L-20 -2 Z" fill="#ffffff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
          <!-- Pennant Flag -->
          <polygon points="0,-36 12,-32 0,-28" fill="#ffd23f"/>
          <!-- Ripple -->
          <path d="M-32 20 Q0 24 32 20" stroke="#ffffff" stroke-width="3" fill="none" opacity=".8"/>
        </g>

        <!-- Friendly Jumping Baby Whale / Dolphin -->
        <g class="map-whale" transform="translate(900 230)">
          <path d="M-16 10 C-16 -12 12 -12 16 6 C10 12 -10 16 -16 10 Z" fill="#3a86ff" stroke="${INK}" stroke-width="2.5"/>
          <path d="M-16 10 L-26 4 L-24 14 Z" fill="#3a86ff" stroke="${INK}" stroke-width="2.5"/>
          <circle cx="8" cy="0" r="2.5" fill="${INK}"/>
          <circle cx="9" cy="-1" r="1" fill="#fff"/>
          <ellipse cx="6" cy="4" rx="3" ry="1.5" fill="#ff70a6" opacity=".7"/>
          <!-- Water Spout -->
          <path d="M0 -10 Q-4 -20 -8 -22 M0 -10 Q0 -22 0 -25 M0 -10 Q4 -20 8 -22" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>
        </g>

        <!-- Cartoon Compass Rose -->
        <g class="map-compass" transform="translate(895 85) scale(0.85)">
          <circle cx="0" cy="0" r="30" fill="#fffef8" stroke="${INK}" stroke-width="4"/>
          <circle cx="0" cy="0" r="25" fill="#ffeaa7" stroke="${INK}" stroke-width="1.5"/>
          <!-- Star points -->
          <polygon points="0,-22 5,-5 22,0 5,5 0,22 -5,5 -22,0 -5,-5" fill="#ff70a6" stroke="${INK}" stroke-width="1.5"/>
          <polygon points="0,-22 5,-5 0,0 -5,-5" fill="#e63946"/>
          <polygon points="22,0 5,5 0,0 5,-5" fill="#ffd23f"/>
          <circle cx="0" cy="0" r="5" fill="#ffffff" stroke="${INK}" stroke-width="2"/>
          <text y="-25" text-anchor="middle" font-size="12" font-weight="900" fill="${INK}">N</text>
        </g>

        <!-- ==================== 2. MAIN ISLAND (NON-INTERACTIVE BASE) ==================== -->
        <!-- Sandy Shore (Broad golden beach border) -->
        <path d="M140 480 C70 390 100 280 230 240 C330 130 490 85 640 105 C790 75 940 140 925 290 C965 410 885 545 745 580 C585 635 285 610 140 480 Z"
              fill="url(#sandGrad)" stroke="#d99f32" stroke-width="14" stroke-linejoin="round"/>

        <!-- Beach Shells & Starfish on the shoreline -->
        <g fill="#ff70a6" stroke="${INK}" stroke-width="1.5">
          <polygon points="120,380 123,387 130,387 125,392 127,399 120,395 113,399 115,392 110,387 117,387" transform="scale(0.8)"/>
          <polygon points="760,570 763,575 770,575 765,580 767,586 760,582 753,586 755,580 750,575 757,575" transform="scale(0.8)"/>
        </g>

        <!-- Lush Island Grass Interior -->
        <path d="M165 460 C105 380 130 285 245 250 C340 150 485 110 625 125 C765 100 895 160 885 285 C920 390 850 515 725 545 C580 595 295 575 165 460 Z"
              fill="url(#grassGrad)" stroke="#3f8818" stroke-width="6" stroke-linejoin="round"/>

        <!-- ==================== 3. WINDING EXPEDITION TRAIL ==================== -->
        <path class="map-trail"
              d="M260 410 C320 330 380 290 440 270 C520 250 580 280 650 330 C710 375 740 400 780 410"
              fill="none" stroke="#d4944c" stroke-width="14" stroke-linecap="round"/>
        <path class="map-trail"
              d="M260 410 C320 330 380 290 440 270 C520 250 580 280 650 330 C710 375 740 400 780 410"
              fill="none" stroke="#fff4cf" stroke-width="8" stroke-dasharray="2 18" stroke-linecap="round"/>
      </g>

      <!-- ==================== 4. REGION 1: GIGGLE MEADOW (Colors & Shapes) ==================== -->
      <g class="zone open" data-region="meadow" role="button" tabindex="0" aria-label="Giggle Meadow: Colors and Shapes" pointer-events="auto">
        <!-- Meadow Rolling Knolls -->
        <path d="M160 450 C180 340 280 320 360 370 C420 410 400 520 330 550 C240 580 150 530 160 450 Z"
              fill="url(#meadowGrad)" stroke="#67b824" stroke-width="4"/>
        <ellipse cx="260" cy="440" rx="95" ry="60" fill="#d8ff8a" opacity=".5"/>

        <!-- Whimsical Cartoon Rainbow Arching Over Meadow -->
        <g class="map-rainbow" opacity=".92">
          <path d="M160 370 C200 240 330 240 380 360" stroke="#ff70a6" stroke-width="9" fill="none" stroke-linecap="round"/>
          <path d="M166 370 C204 249 326 249 374 360" stroke="#ffd23f" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="M172 370 C208 258 322 258 368 360" stroke="#06d6a0" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="M178 370 C212 267 318 267 362 360" stroke="#3a86ff" stroke-width="7" fill="none" stroke-linecap="round"/>
          <path d="M183 370 C215 275 315 275 357 360" stroke="#8338ec" stroke-width="6" fill="none" stroke-linecap="round"/>
        </g>

        <!-- Cute Toadstool Mushroom Cottage -->
        <g transform="translate(205 385)" pointer-events="none">
          <!-- Stem / House walls -->
          <rect x="-18" y="10" width="36" height="30" rx="10" fill="#fff9ee" stroke="${INK}" stroke-width="3"/>
          <!-- Arched Wooden Door -->
          <path d="M-8 40 L-8 24 C-8 18 8 18 8 24 L8 40 Z" fill="#9c6634" stroke="${INK}" stroke-width="2.5"/>
          <circle cx="5" cy="30" r="2" fill="#ffd23f"/>
          <!-- Round Window -->
          <circle cx="-1" cy="18" r="5" fill="#72e2ff" stroke="${INK}" stroke-width="2"/>
          <!-- Mushroom Cap Roof (Red with white spots) -->
          <path d="M-34 14 C-34 -18 34 -18 34 14 C20 18 -20 18 -34 14 Z" fill="#ff3b5c" stroke="${INK}" stroke-width="3.5"/>
          <circle cx="-16" cy="0" r="5" fill="#ffffff"/>
          <circle cx="12" cy="-4" r="6" fill="#ffffff"/>
          <circle cx="-2" cy="7" r="4" fill="#ffffff"/>
          <circle cx="20" cy="8" r="3" fill="#ffffff"/>
          <!-- Tiny Chimney -->
          <rect x="14" y="-22" width="8" height="12" rx="2" fill="#e63946" stroke="${INK}" stroke-width="2"/>
          <ellipse cx="22" cy="-26" rx="4" ry="2.5" fill="#ffffff" opacity=".7"/>
        </g>

        <!-- Giant Illustrated Shapes in the Meadow -->
        <!-- Giant Heart -->
        <g transform="translate(165 470) scale(0.9)" class="map-shape-bounce" pointer-events="none">
          <path d="M0 8 C-18 -18 -32 4 0 28 C32 4 18 -18 0 8 Z" fill="#ff70a6" stroke="${INK}" stroke-width="3"/>
          <ellipse cx="-7" cy="4" rx="4" ry="2.5" fill="#ffffff" opacity=".6"/>
        </g>
        <!-- Giant Star -->
        <g transform="translate(355 410) scale(0.95)" class="map-shape-bounce" style="animation-delay:-0.5s" pointer-events="none">
          <polygon points="0,-24 7,-7 24,-7 11,4 16,21 0,11 -16,21 -11,4 -24,-7 -7,-7" fill="#ffd23f" stroke="${INK}" stroke-width="3"/>
          <circle cx="-4" cy="2" r="2" fill="${INK}"/><circle cx="4" cy="2" r="2" fill="${INK}"/>
          <path d="M-3 6 Q0 8 3 6" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
        </g>
        <!-- Giant Round Circle Pond -->
        <g transform="translate(265 490)" pointer-events="none">
          <ellipse cx="0" cy="0" rx="34" ry="20" fill="#38b6ff" stroke="${INK}" stroke-width="3"/>
          <ellipse cx="-8" cy="-3" rx="14" ry="7" fill="#88dcff" opacity=".6"/>
          <!-- Lily pad -->
          <circle cx="14" cy="2" r="6" fill="#27ae60" stroke="${INK}" stroke-width="1.5"/>
        </g>
        <!-- Giant Triangle Sculpture -->
        <g transform="translate(320 355) scale(0.85)" pointer-events="none">
          <polygon points="0,-24 22,14 -22,14" fill="#27ae60" stroke="${INK}" stroke-width="3"/>
          <polygon points="0,-18 16,10 -16,10" fill="#70e000" opacity=".6"/>
        </g>

        <!-- Cheerful Flowers & Toadstools -->
        ${ART.flower(180, 520, "#ffffff", "#ffd23f", 0.9)}
        ${ART.flower(345, 475, "#ff70a6", "#ffffff", 0.85)}
        ${ART.flower(220, 480, "#ffd23f", "#ff3b5c", 0.8)}
        ${ART.mushroom(295, 440, "#fb5607", 0.9)}
        ${ART.mushroom(150, 420, "#ff3b5c", 0.75)}

        <!-- Illustrated Wooden Sign: Giggle Meadow -->
        ${ART.sign(255, 545, "Giggle Meadow", "Colors & Shapes", rMeadow.caught, rMeadow.total, "#2e8b22")}
      </g>

      <!-- ==================== 5. REGION 2: WOBBLE WOODS (Numbers 1-10) ==================== -->
      <g class="zone open" data-region="woods" role="button" tabindex="0" aria-label="Wobble Woods: Numbers 1 to 10" pointer-events="auto">
        <!-- Forest Clearing Base -->
        <ellipse cx="520" cy="240" rx="170" ry="115" fill="#4ea93b" stroke="#2f7820" stroke-width="4"/>
        <ellipse cx="480" cy="225" rx="100" ry="55" fill="#6bc256" opacity=".5"/>

        <!-- Cozy Giant Oak Treehouse -->
        <g transform="translate(520 220)" pointer-events="none">
          <!-- Giant Trunk -->
          <path d="M-22 40 C-26 10 -24 -10 0 -20 C24 -10 26 10 22 40 Z" fill="#8b5a2b" stroke="${INK}" stroke-width="3.5"/>
          <path d="M-10 18 Q0 22 10 18" stroke="#5c3818" stroke-width="2.5" fill="none"/>
          <!-- Treehouse Door -->
          <path d="M-8 38 L-8 22 C-8 17 8 17 8 22 L8 38 Z" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/>
          <!-- Glowing Round Window -->
          <circle cx="0" cy="2" r="7" fill="#ffd23f" stroke="${INK}" stroke-width="2"/>
          <line x1="0" y1="-5" x2="0" y2="9" stroke="${INK}" stroke-width="1.5"/>
          <line x1="-7" y1="2" x2="7" y2="2" stroke="${INK}" stroke-width="1.5"/>
          <!-- Hanging Lantern -->
          <line x1="22" y1="-2" x2="22" y2="12" stroke="${INK}" stroke-width="2"/>
          <circle cx="22" cy="16" r="5" fill="#ffeaa7" stroke="${INK}" stroke-width="2"/>
          <!-- Huge Foliage Canopies (Three Layered Green Puffs) -->
          <circle cx="-32" cy="-28" r="28" fill="#2d8048" stroke="${INK}" stroke-width="3.5"/>
          <circle cx="32" cy="-28" r="28" fill="#2d8048" stroke="${INK}" stroke-width="3.5"/>
          <circle cx="0" cy="-48" r="34" fill="#389b58" stroke="${INK}" stroke-width="3.5"/>
          <circle cx="-16" cy="-36" r="26" fill="#42b86c" stroke="${INK}" stroke-width="3"/>
          <circle cx="16" cy="-36" r="26" fill="#42b86c" stroke="${INK}" stroke-width="3"/>
          <!-- Cute Owl in Tree -->
          <g transform="translate(-18 -42) scale(0.7)">
            <ellipse cx="0" cy="0" rx="8" ry="10" fill="#9c6634" stroke="${INK}" stroke-width="2"/>
            <circle cx="-3" cy="-3" r="3" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
            <circle cx="3" cy="-3" r="3" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
            <circle cx="-3" cy="-3" r="1.5" fill="${INK}"/>
            <circle cx="3" cy="-3" r="1.5" fill="${INK}"/>
            <polygon points="0,0 -2,-2 2,-2" fill="#ffd23f"/>
          </g>
        </g>

        <!-- Surrounding Forest Pine & Round Trees -->
        ${ART.pineTree(410, 190, "#1f683a", 1.15)}
        ${ART.roundTree(375, 260, "#389b58", 1.05)}
        ${ART.pineTree(445, 280, "#2d8048", 0.95)}
        ${ART.roundTree(615, 200, "#42b86c", 1.15)}
        ${ART.pineTree(645, 265, "#1f683a", 1.1)}
        ${ART.roundTree(590, 275, "#389b58", 0.95)}

        <!-- Wooden Stepping Stumps with Numbers (1, 2, 3) -->
        <g transform="translate(450 325)" pointer-events="none">
          <ellipse cx="0" cy="0" rx="14" ry="9" fill="#c48a48" stroke="${INK}" stroke-width="2.5"/>
          <text y="5" text-anchor="middle" font-size="14" font-weight="900" fill="${INK}">1</text>
        </g>
        <g transform="translate(490 335)" pointer-events="none">
          <ellipse cx="0" cy="0" rx="14" ry="9" fill="#c48a48" stroke="${INK}" stroke-width="2.5"/>
          <text y="5" text-anchor="middle" font-size="14" font-weight="900" fill="${INK}">2</text>
        </g>
        <g transform="translate(535 330)" pointer-events="none">
          <ellipse cx="0" cy="0" rx="14" ry="9" fill="#c48a48" stroke="${INK}" stroke-width="2.5"/>
          <text y="5" text-anchor="middle" font-size="14" font-weight="900" fill="${INK}">3</text>
        </g>

        <!-- Forest Floor Mushrooms -->
        ${ART.mushroom(400, 310, "#ff3b5c", 1)}
        ${ART.mushroom(420, 325, "#fb5607", 0.75)}
        ${ART.mushroom(610, 320, "#ff3b5c", 0.9)}

        <!-- Illustrated Wooden Sign: Wobble Woods -->
        ${ART.sign(520, 365, "Wobble Woods", "Numbers 1 to 10", rWoods.caught, rWoods.total, "#1e7232")}
      </g>

      <!-- ==================== 6. REGION 3: SPARKLE CAVE (Letters A-Z) ==================== -->
      <g class="zone open" data-region="cave" role="button" tabindex="0" aria-label="Sparkle Cave: Letters A to Z" pointer-events="auto">
        <!-- Mountain Range Silhouette / Base -->
        <path d="M630 520 L710 310 L765 370 L830 230 L895 330 L965 520 Z"
              fill="url(#rockGrad)" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>

        <!-- Mountain Peak Highlights & Facets -->
        <!-- Center Tall Peak -->
        <polygon points="830,230 805,280 825,270 840,290 855,265" fill="#ffffff" opacity=".9"/>
        <polygon points="830,230 895,330 850,390 830,310" fill="#4f3596" opacity=".5"/>
        <!-- Left Peak -->
        <polygon points="710,310 695,345 710,340 722,352" fill="#ffffff" opacity=".85"/>
        <polygon points="710,310 765,370 735,410" fill="#4f3596" opacity=".5"/>

        <!-- Big Inviting Arched Cave Mouth -->
        <g transform="translate(795 480)" pointer-events="none">
          <!-- Outer Stone Archway -->
          <path d="M-52 35 C-52 -45 52 -45 52 35 Z" fill="#432c7e" stroke="${INK}" stroke-width="4.5"/>
          <!-- Glowing Deep Cave Interior -->
          <path d="M-40 35 C-40 -30 40 -30 40 35 Z" fill="#201044"/>
          <!-- Warm Glowing Light from inside -->
          <ellipse cx="0" cy="20" rx="26" ry="14" fill="#ff70a6" opacity=".55"/>
          <!-- Stalactites hanging down -->
          <polygon points="-24,-24 -18,-10 -12,-24" fill="#a491e0"/>
          <polygon points="12,-24 18,-8 24,-24" fill="#a491e0"/>
          <polygon points="-4,-28 0,-14 4,-28" fill="#ffffff"/>
          <!-- Friendly Glowing Eyes inside cave -->
          <circle cx="-10" cy="8" r="3.5" fill="#ffd23f"/><circle cx="10" cy="8" r="3.5" fill="#ffd23f"/>
        </g>

        <!-- Giant Glowing Crystals Sprouting from Mountains -->
        ${ART.crystal(660, 475, -25, "#00f0ff", 1.25)}
        ${ART.crystal(675, 500, -10, "#ff70a6", 1)}
        ${ART.crystal(910, 480, 20, "#ffd23f", 1.3)}
        ${ART.crystal(930, 450, 35, "#00f0ff", 1)}
        ${ART.crystal(735, 360, 15, "#ff70a6", 0.9)}
        ${ART.crystal(875, 305, -30, "#ffd23f", 0.85)}

        <!-- Cute Cartoon Bat hanging upside-down -->
        <g transform="translate(730 440)" pointer-events="none">
          <path d="M-14 8 C-10 -2 -2 2 0 6 C2 2 10 -2 14 8 C6 4 2 12 0 16 C-2 12 -6 4 -14 8 Z" fill="#6d58b0" stroke="${INK}" stroke-width="2"/>
          <ellipse cx="0" cy="10" rx="4" ry="6" fill="#8e74db"/>
          <circle cx="-2" cy="9" r="1.5" fill="#fff"/><circle cx="2" cy="9" r="1.5" fill="#fff"/>
        </g>

        <!-- Floating Magic Sparkles -->
        <g class="map-sparkles" fill="#ffd23f" pointer-events="none">
          <polygon points="695,405 698,414 707,414 700,419 702,428 695,423 688,428 690,419 683,414 692,414"/>
          <polygon points="885,390 887,396 893,396 888,400 890,406 885,402 880,406 882,400 877,396 883,396" transform="scale(0.85) translate(110 50)"/>
          <polygon points="760,285 762,291 768,291 763,295 765,301 760,297 755,301 757,295 752,291 758,291"/>
        </g>

        <!-- Illustrated Wooden Sign: Sparkle Cave -->
        ${ART.sign(795, 545, "Sparkle Cave", "Letters A to Z", rCave.caught, rCave.total, "#613bbd")}
      </g>

      <!-- ==================== 7. THE BUDDY MONSTER ==================== -->
      <g class="map-buddy">
        ${nested(buddy, 2, bPos[0], bPos[1], 106, "buddy")}
      </g>
    </svg>`;
  }

  window.WM_MAP = { mapSVG };
})();
