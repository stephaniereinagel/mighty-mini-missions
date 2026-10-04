// Monster Hunt world map: a wide, side-scrolling storybook world of big
// tappable landmarks (two painted panels joined side by side), with caught
// monsters hanging out at their landmark and the buddy walking between them.

(() => {
  "use strict";

  const { monsterSVG } = window.WM_ART;

  const PANEL_W = 1024;
  const PANEL_H = 576;
  const OVERLAP = 56;
  const OX = PANEL_W - OVERLAP;
  const WORLD_W = OX + PANEL_W;
  const WORLD_H = PANEL_H;

  const PANELS = [
    { href: "images/world-1.jpg", x: 0 },
    { href: "images/world-2.jpg", x: OX }
  ];

  // Each landmark: tap area (ellipse), name tag, where the buddy stands, and
  // where caught monsters hang out. Coordinates are world units.
  const LANDMARKS = [
    { id: "meadow", title: "Giggle Meadow", sub: "Colors & Shapes", color: "#2e8b22",
      hit: [175, 300, 175, 205], tag: [125, 470], buddy: [300, 510], pals: [[40, 400], [330, 440]] },
    { id: "woods", title: "Wobble Woods", sub: "Numbers 1&#8211;10", color: "#1e7232",
      hit: [512, 235, 190, 240], tag: [600, 478], buddy: [440, 380], pals: [[372, 430], [690, 410]] },
    { id: "cave", title: "Sparkle Cave", sub: "Letters A&#8211;Z", color: "#613bbd",
      hit: [850, 260, 160, 270], tag: [770, 470], buddy: [880, 420], pals: [[700, 400], [850, 395]] },
    { id: "castle", title: "Shape Castle", sub: "Tricky Shapes", color: "#c2410c",
      hit: [OX + 130, 245, 125, 150], tag: [OX + 150, 438], buddy: [OX + 255, 470], pals: [[OX + 25, 395], [OX + 250, 375]] },
    { id: "garden", title: "Giant's Garden", sub: "Big & Small", color: "#b45309",
      hit: [OX + 390, 320, 135, 180], tag: [OX + 390, 480], buddy: [OX + 505, 500], pals: [[OX + 275, 470], [OX + 520, 455]] },
    { id: "reef", title: "Rainbow Reef", sub: "More Colors", color: "#0d8a84",
      hit: [OX + 650, 360, 125, 165], tag: [OX + 650, 478], buddy: [OX + 760, 505], pals: [[OX + 545, 470], [OX + 745, 420]] },
    { id: "lagoon", title: "Echo Lagoon", sub: "Letter Sounds", color: "#0369a1",
      hit: [OX + 885, 380, 130, 170], tag: [OX + 885, 478], buddy: [OX + 835, 425], pals: [[OX + 790, 300], [OX + 1000, 400]] }
  ];
  const landmark = (id) => LANDMARKS.find((l) => l.id === id) || LANDMARKS[0];

  function nested(word, stage, x, y, size, cls) {
    const svg = monsterSVG(word, stage, false)
      .replace("<svg ", `<svg x="${x - size / 2}" y="${y - size * 0.82}" width="${size}" height="${size}" overflow="visible" `);
    return `<g class="${cls}" data-w="${word}">${svg}</g>`;
  }

  // ---------------------------------------------------------------- world SVG

  function worldSVG({ regions, current, buddy }) {
    const region = (id) => regions.find((r) => r.id === id) || { caught: 0, total: 0, pals: [] };

    const images = (extra = "") => PANELS.map((p, i) =>
      `<image href="${p.href}" x="${p.x}" y="0" width="${PANEL_W}" height="${PANEL_H}" preserveAspectRatio="xMidYMid slice" ${i ? 'mask="url(#seam-fade)"' : ""} ${extra}/>`).join("");

    const defs = `<defs>
      <linearGradient id="seam-grad" x1="${OX}" x2="${OX + OVERLAP}" y1="0" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/>
      </linearGradient>
      <mask id="seam-fade" maskUnits="userSpaceOnUse" x="${OX}" y="0" width="${PANEL_W}" height="${PANEL_H}">
        <rect x="${OX}" y="0" width="${PANEL_W}" height="${PANEL_H}" fill="url(#seam-grad)"/>
      </mask>
      ${LANDMARKS.map((l) => `<clipPath id="clip-${l.id}"><ellipse cx="${l.hit[0]}" cy="${l.hit[1]}" rx="${l.hit[2]}" ry="${l.hit[3]}"/></clipPath>`).join("")}
    </defs>`;

    const hand = `<g class="tap-hand" transform="translate(-78 48)"><text font-size="54" text-anchor="middle" dominant-baseline="central">&#x1F446;</text></g>`;

    const tag = (l) => {
      const r = region(l.id);
      const [x, y] = l.tag;
      return `<g class="map-sign" transform="translate(${x} ${y})" pointer-events="none"><g class="sign-scale"><g class="illustrated-sign">
        <rect class="sign-board-bg" x="-86" y="-29" width="172" height="58" rx="15" fill="#fffdf6" stroke="${l.color}" stroke-width="4"/>
        <text y="-7" text-anchor="middle" font-size="17" font-weight="900" fill="${l.color}">${l.title}</text>
        <text y="10" text-anchor="middle" font-size="10.5" font-weight="700" fill="#665b78">${l.sub}</text>
        <g transform="translate(0 24)">
          <rect x="-35" y="-9" width="70" height="18" rx="9" fill="#ffd23f" stroke="#2b2440" stroke-width="1.5"/>
          <polygon points="-23,-4 -21,-1 -17,-1 -20,1 -19,5 -23,3 -27,5 -26,1 -29,-1 -25,-1" fill="#2b2440"/>
          <text x="7" y="4" text-anchor="middle" font-size="10.5" font-weight="900" fill="#2b2440">${r.caught} / ${r.total}</text>
        </g>
      </g>${current === l.id ? hand : ""}</g></g>`;
    };

    const zones = LANDMARKS.map((l) => {
      const [cx, cy, rx, ry] = l.hit;
      return `<g class="zone open illustrated-zone ${current === l.id ? "current" : ""}" data-region="${l.id}" role="button" tabindex="0" aria-label="${l.title}: ${l.sub}">
        <ellipse class="zone-hit" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffffff" fill-opacity=".001"/>
        <g class="landmark-pop" clip-path="url(#clip-${l.id})" style="transform-origin:${cx}px ${cy + ry * 0.8}px" pointer-events="none">${images()}</g>
        ${tag(l)}
      </g>`;
    }).join("");

    const pals = LANDMARKS.map((l) => region(l.id).pals.slice(0, l.pals.length).map((p, i) => {
      const [x, y] = l.pals[i];
      return `<g class="pal-idle" style="animation-delay:${-((x * 7) % 23) / 10}s">${nested(p.w, p.stage, x, y, 50, "map-mon")}</g>`;
    }).join("")).join("");

    const [bx, by] = landmark(current).buddy;
    return `<svg class="illustrated-map" viewBox="0 0 ${WORLD_W} ${WORLD_H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" font-family="Andika, sans-serif">
      ${defs}
      <g pointer-events="none">${images()}</g>
      ${zones}
      ${pals}
      <g class="buddy-travel">${buddyArt(buddy, bx, by)}</g>
    </svg>`;
  }

  const BUDDY_SIZE = 108;
  const star = (s) => {
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const r = i % 2 ? s * 0.32 : s, a = (Math.PI / 4) * i - Math.PI / 2;
      pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  // The child's own monster: golden spotlight, glowing outline and sparkles.
  function buddyArt(word, x, y) {
    const sparkles = [[-62, -70, 13, 0], [58, -88, 10, 0.5], [70, -30, 14, 1], [-70, -18, 9, 0.3], [4, -118, 11, 0.8], [-36, -108, 8, 1.2]]
      .map(([dx, dy, s, d]) => `<g transform="translate(${x + dx} ${y + dy})"><polygon class="buddy-sparkle" style="animation-delay:${d}s" points="${star(s)}" fill="${s > 10 ? "#fff6b0" : "#ffffff"}" stroke="#ffb400" stroke-width="1.5" stroke-linejoin="round"/></g>`).join("");
    return `<defs>
        <radialGradient id="buddy-spot-grad"><stop offset="0" stop-color="#fffbe0"/><stop offset=".45" stop-color="#ffe066" stop-opacity=".9"/><stop offset="1" stop-color="#ffb400" stop-opacity="0"/></radialGradient>
        <filter id="buddy-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="3.5" result="fat"/>
          <feFlood flood-color="#ffffff"/><feComposite in2="fat" operator="in" result="outline"/>
          <feMorphology in="SourceAlpha" operator="dilate" radius="6" result="fatter"/>
          <feGaussianBlur in="fatter" stdDeviation="8" result="blur"/>
          <feFlood flood-color="#ffcc00"/><feComposite in2="blur" operator="in" result="halo"/>
          <feMerge><feMergeNode in="halo"/><feMergeNode in="halo"/><feMergeNode in="halo"/><feMergeNode in="outline"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g pointer-events="none">
        <ellipse class="buddy-spot" cx="${x}" cy="${y + 6}" rx="${BUDDY_SIZE * 0.8}" ry="${BUDDY_SIZE * 0.26}" fill="url(#buddy-spot-grad)"/>
        <ellipse class="buddy-ring" cx="${x}" cy="${y + 6}" rx="${BUDDY_SIZE * 0.55}" ry="${BUDDY_SIZE * 0.16}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 8"/>
      </g>
      <g class="map-buddy"><g filter="url(#buddy-glow)">${nested(word, 2, x, y, BUDDY_SIZE, "buddy")}</g></g>
      <g class="buddy-sparkles" pointer-events="none">${sparkles}</g>`;
  }

  // ---------------------------------------------------------------- clouds

  function cloudShape(x, y, size, delay) {
    return `<g transform="translate(${x} ${y}) scale(${size})"><g class="fg-cloud" style="animation-delay:${delay}s">
      <ellipse cx="0" cy="16" rx="72" ry="16" fill="#d7e6f4"/>
      <ellipse cx="0" cy="10" rx="70" ry="20" fill="#ffffff"/>
      <circle cx="-34" cy="0" r="24" fill="#ffffff"/>
      <circle cx="4" cy="-12" r="34" fill="#ffffff"/>
      <circle cx="40" cy="0" r="24" fill="#ffffff"/>
      <ellipse cx="-6" cy="-24" rx="14" ry="7" fill="#ffffff" opacity=".9"/>
    </g></g>`;
  }

  // A few clouds float in the sky in front of the painting.
  const FG_CLOUDS = `<svg viewBox="0 0 ${WORLD_W} ${WORLD_H}" overflow="visible" xmlns="http://www.w3.org/2000/svg">
    ${cloudShape(260, 40, 0.7, 0)}
    ${cloudShape(820, 70, 0.6, -6)}
    ${cloudShape(OX + 20, 30, 0.9, -11)}
    ${cloudShape(1500, 60, 0.65, -3)}
    ${cloudShape(1900, 35, 0.8, -8)}
  </svg>`;

  // Two big cloud banks that cover the screen and slide apart on first open.
  function curtainSVG(flip) {
    const puffs = [[60, 20, 90], [40, 160, 110], [70, 300, 100], [30, 440, 120], [80, 580, 95], [50, 720, 110], [70, 860, 100],
      [170, 90, 80], [190, 250, 90], [160, 400, 85], [185, 540, 90], [170, 690, 85], [190, 830, 80]];
    return `<svg class="curtain-half ${flip ? "right" : "left"}" viewBox="0 0 260 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <g ${flip ? 'transform="translate(260 0) scale(-1 1)"' : ""}>
        <rect x="0" y="0" width="120" height="900" fill="#ffffff"/>
        ${puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff"/>`).join("")}
      </g>
    </svg>`;
  }

  // ---------------------------------------------------------------- camera

  // Full-screen pan & zoom viewport. The world always covers the whole
  // screen (no empty edges), so the smallest zoom is "cover".
  function panZoom(viewport, { zoomIn, zoomOut } = {}) {
    const MAX_ZOOM = 2.5;
    const FOCUS_ZOOM = 1;
    const TAP_SLOP = 10;
    const PARALLAX = 1.35;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const world = document.createElement("div");
    world.className = "map-world";
    const fg = document.createElement("div");
    fg.className = "map-fg";
    fg.innerHTML = FG_CLOUDS;
    for (const el of [world, fg]) {
      el.style.width = `${WORLD_W}px`;
      el.style.height = `${WORLD_H}px`;
    }
    viewport.replaceChildren(world, fg);

    let s = 1, tx = 0, ty = 0, minS = 1, vw = 0, vh = 0;
    let glideTimer = 0, raf = 0;

    const maxS = () => minS * MAX_ZOOM;
    const clampScale = (v) => Math.min(Math.max(v, minS), maxS());
    const lowX = () => vw - WORLD_W * s;
    const lowY = () => vh - WORLD_H * s;
    const clamp = () => {
      s = clampScale(s);
      tx = Math.min(0, Math.max(lowX(), tx));
      ty = Math.min(0, Math.max(lowY(), ty));
    };
    const inBounds = () => tx <= 0 && ty <= 0 && tx >= lowX() - 0.5 && ty >= lowY() - 0.5;

    // Name tags keep a steady on-screen size: they grow a little when zooming
    // in so the art can take over, and size themselves to the screen.
    const labelScale = () => {
      const base = Math.min(1.3, Math.max(0.8, Math.min(vw, vh) / 700));
      return (base / s) * Math.pow(s / minS, 0.4);
    };

    const apply = () => {
      world.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
      world.style.setProperty("--label-k", labelScale().toFixed(4));
      const fx = tx + (PARALLAX - 1) * (tx - lowX() / 2);
      const fy = ty + (PARALLAX - 1) * (ty - lowY() / 2);
      fg.style.transform = `translate(${fx}px, ${fy}px) scale(${s})`;
      if (zoomIn) zoomIn.disabled = s >= maxS() - 1e-3;
      if (zoomOut) zoomOut.disabled = s <= minS + 1e-3;
    };
    const measure = () => {
      vw = viewport.clientWidth;
      vh = viewport.clientHeight;
      if (!vw || !vh) return false;
      minS = Math.max(vw / WORLD_W, vh / WORLD_H);
      return true;
    };
    const local = (e) => {
      const r = viewport.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };

    const stopMotion = () => {
      cancelAnimationFrame(raf);
      clearTimeout(glideTimer);
      world.classList.remove("glide");
      fg.classList.remove("glide");
    };
    const glide = (ms = 450) => {
      stopMotion();
      for (const el of [world, fg]) {
        el.style.setProperty("--glide", `${reduceMotion ? 0 : ms}ms`);
        el.classList.add("glide");
      }
      glideTimer = setTimeout(() => { world.classList.remove("glide"); fg.classList.remove("glide"); }, ms + 50);
    };

    function zoomAt(target, cx, cy) {
      const k = clampScale(target) / s;
      tx = cx - (cx - tx) * k;
      ty = cy - (cy - ty) * k;
      s *= k;
      clamp();
      apply();
    }

    function zoomBy(factor) {
      if (!measure()) return;
      glide();
      zoomAt(s * factor, vw / 2, vh / 2);
    }

    function centerOn(x, y) {
      tx = vw / 2 - x * s;
      ty = vh / 2 - y * s;
      clamp();
      apply();
    }
    const viewCenter = (l) => [(l.hit[0] + l.tag[0]) / 2, (l.hit[1] + l.tag[1]) / 2];

    // Center the screen on a landmark. `animate` is false or a glide time in ms.
    function focus(regionId, { animate = false, zoom = FOCUS_ZOOM } = {}) {
      if (!measure()) return;
      if (animate) glide(animate === true ? 600 : animate); else stopMotion();
      if (zoom) s = clampScale(minS * zoom);
      centerOn(...viewCenter(landmark(regionId)));
    }

    // First open: clouds part, then the camera pans in from the start of the world.
    function intro(regionId) {
      if (!measure()) return;
      stopMotion();
      s = clampScale(minS * FOCUS_ZOOM);
      centerOn(0, WORLD_H / 2);
      if (reduceMotion) { focus(regionId); return; }
      const curtain = document.createElement("div");
      curtain.className = "cloud-curtain";
      curtain.innerHTML = curtainSVG(false) + curtainSVG(true);
      viewport.appendChild(curtain);
      setTimeout(() => curtain.remove(), 2200);
      setTimeout(() => { if (!pts.size) focus(regionId, { animate: 1500 }); }, 700);
    }

    // The buddy hops along to the tapped landmark while the camera follows.
    function travelTo(fromId, toId) {
      return new Promise((resolve) => {
        if (!measure()) return resolve();
        const from = landmark(fromId), to = landmark(toId);
        const dx = to.buddy[0] - from.buddy[0], dy = to.buddy[1] - from.buddy[1];
        const dist = Math.hypot(dx, dy);
        const dur = Math.min(1500, 450 + dist * 0.9);
        glide(Math.max(600, dur));
        centerOn(...viewCenter(to));
        const el = world.querySelector(".buddy-travel");
        if (!el || reduceMotion) { setTimeout(resolve, 300); return; }
        const hops = Math.max(1, Math.round(dist / 110));
        const t0 = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - t0) / dur);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const hop = Math.abs(Math.sin(Math.PI * hops * t)) * 28;
          el.setAttribute("transform", `translate(${dx * e} ${dy * e - hop})`);
          if (t < 1) requestAnimationFrame(step); else resolve();
        };
        requestAnimationFrame(step);
      });
    }

    // ---- touch / mouse: one finger drags, two fingers pinch
    const pts = new Map();
    let prev = null, travel = 0, dragged = false;
    let vx = 0, vy = 0, lastT = 0, rawX = 0, rawY = 0;

    // Past the edge the world stretches a little, then springs back on release.
    const rubber = (v, lo) => (v > 0 ? v * 0.3 : v < lo ? lo + (v - lo) * 0.3 : v);

    const gesture = () => {
      const p = [...pts.values()].slice(0, 2);
      const cx = p.reduce((a, q) => a + q.x, 0) / p.length;
      const cy = p.reduce((a, q) => a + q.y, 0) / p.length;
      const d = p.length > 1 ? Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) : 0;
      return { cx, cy, d, n: p.length };
    };
    const syncRaw = () => { rawX = tx; rawY = ty; };

    viewport.addEventListener("pointerdown", (e) => {
      if (e.button > 0) return;
      stopMotion();
      measure();
      if (!pts.size) { travel = 0; dragged = false; vx = vy = 0; }
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      prev = gesture();
      syncRaw();
      viewport.classList.add("grabbing");
    });

    window.addEventListener("pointermove", (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const g = gesture();
      if (prev && prev.n === g.n) {
        const dx = g.cx - prev.cx;
        const dy = g.cy - prev.cy;
        travel += Math.hypot(dx, dy);
        if (g.n > 1 || travel > TAP_SLOP) dragged = true;
        if (g.n > 1 && prev.d > 0) {
          tx += dx;
          ty += dy;
          const r = viewport.getBoundingClientRect();
          zoomAt(s * (g.d / prev.d), g.cx - r.left, g.cy - r.top);
          syncRaw();
        } else {
          rawX += dx;
          rawY += dy;
          tx = rubber(rawX, lowX());
          ty = rubber(rawY, lowY());
          apply();
        }
        const now = performance.now();
        const dt = Math.max(1, now - lastT);
        vx = vx * 0.6 + (dx / dt) * 0.4;
        vy = vy * 0.6 + (dy / dt) * 0.4;
        lastT = now;
      }
      prev = g;
    });

    const release = (e) => {
      if (!pts.delete(e.pointerId)) return;
      if (pts.size) { prev = gesture(); syncRaw(); vx = vy = 0; return; }
      prev = null;
      viewport.classList.remove("grabbing");
      if (!inBounds()) {
        glide(350);
        clamp();
        apply();
      } else if (dragged && performance.now() - lastT < 80) {
        coast();
      }
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);

    // Keep the swipe gliding a little after the finger lifts.
    function coast() {
      let t0 = performance.now();
      const step = (now) => {
        const dt = Math.min(32, now - t0);
        t0 = now;
        const bx = (tx += vx * dt), by = (ty += vy * dt);
        clamp();
        if (tx !== bx) vx = 0;
        if (ty !== by) vy = 0;
        apply();
        const f = Math.pow(0.95, dt / 16);
        vx *= f;
        vy *= f;
        if (Math.hypot(vx, vy) > 0.02) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    // A drag that ends over a landmark shouldn't count as tapping it.
    viewport.addEventListener("click", (e) => {
      if (!dragged) return;
      e.stopImmediatePropagation();
      e.preventDefault();
      dragged = false;
    }, true);

    // ---- mouse wheel / trackpad: scroll pans (sideways when there's no room
    // to go up or down), pinch (ctrl+wheel) zooms
    viewport.addEventListener("wheel", (e) => {
      e.preventDefault();
      stopMotion();
      measure();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vh : 1;
      if (e.ctrlKey) {
        const [x, y] = local(e);
        zoomAt(s * Math.exp(-e.deltaY * unit * 0.01), x, y);
        return;
      }
      let dx = e.deltaX * unit, dy = e.deltaY * unit;
      if (lowY() > -1 && Math.abs(dy) > Math.abs(dx)) { dx = dy; dy = 0; }
      tx -= dx;
      ty -= dy;
      clamp();
      apply();
    }, { passive: false });

    // Safari on Mac sends trackpad pinches as gesture events instead of ctrl+wheel.
    let gestureStart = 1;
    viewport.addEventListener("gesturestart", (e) => { e.preventDefault(); gestureStart = s; });
    viewport.addEventListener("gesturechange", (e) => {
      e.preventDefault();
      if (pts.size) return;
      const [x, y] = local(e);
      zoomAt(gestureStart * e.scale, x, y);
    });
    viewport.addEventListener("gestureend", (e) => e.preventDefault());
    viewport.addEventListener("dragstart", (e) => e.preventDefault());

    if (zoomIn) zoomIn.addEventListener("click", () => zoomBy(1.6));
    if (zoomOut) zoomOut.addEventListener("click", () => zoomBy(1 / 1.6));

    // Keep the same spot centered when the screen rotates or resizes.
    new ResizeObserver(() => {
      if (!vw || !vh) { if (measure()) { clamp(); apply(); } return; }
      const rel = s / minS;
      const mx = (vw / 2 - tx) / s;
      const my = (vh / 2 - ty) / s;
      if (!measure()) return;
      s = minS * rel;
      centerOn(mx, my);
    }).observe(viewport);

    return {
      setContent(html) { world.innerHTML = html; },
      focus,
      intro,
      travelTo,
      zoomBy
    };
  }

  window.WM_MAP = { mapSVG: worldSVG, panZoom, WORLD_W, WORLD_H };
})();
