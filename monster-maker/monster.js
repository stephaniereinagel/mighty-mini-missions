// Draws a monster as SVG from a spec. Part counts must stay exactly countable, so every
// part is placed with geometry checks against the body shape rather than at fixed spots.
(() => {
  "use strict";

  const INK = "#3b2a4a";
  const MOUTH = "#5a2340";
  const HORN = "#fff1c7";
  const VB_W = 400;
  const VB_H = 430;
  const GROUND = 410;

  const COLORS = [
    { id: "teal", name: "teal", fill: "#4fd1c5", dark: "#2a9e93" },
    { id: "pink", name: "pink", fill: "#ff8fc1", dark: "#e0609c" },
    { id: "purple", name: "purple", fill: "#a98bff", dark: "#7a58e6" },
    { id: "orange", name: "orange", fill: "#ffa45c", dark: "#e07a28" },
    { id: "yellow", name: "yellow", fill: "#ffd84d", dark: "#d9a81a" },
    { id: "green", name: "green", fill: "#7ed957", dark: "#4fa82c" },
    { id: "blue", name: "blue", fill: "#5cb8ff", dark: "#2d86d6" },
    { id: "red", name: "red", fill: "#ff6b6b", dark: "#d23f3f" }
  ];

  // ---------------------------------------------------------------- shape outlines

  function ellipsePts(cx, cy, rx, ry, n = 96) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    return pts;
  }

  function regularPts(n, r, cx, cy, startDeg) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = ((startDeg + (360 / n) * i) * Math.PI) / 180;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function starPts(n, ro, ri, cx, cy) {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 === 0 ? ro : ri;
      const a = ((-90 + (180 / n) * i) * Math.PI) / 180;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function heartPts(cx, cy, s, n = 120) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      pts.push([cx + x * s, cy - y * s]);
    }
    return pts;
  }

  // Soft corners make straight-sided shapes look like squishy monsters instead of road signs.
  function roundPts(pts, r, steps = 8) {
    const out = [];
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const p = pts[i];
      const a = pts[(i - 1 + n) % n];
      const b = pts[(i + 1) % n];
      const la = Math.hypot(a[0] - p[0], a[1] - p[1]);
      const lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
      const rr = Math.min(r, la / 2.2, lb / 2.2);
      const p1 = [p[0] + ((a[0] - p[0]) / la) * rr, p[1] + ((a[1] - p[1]) / la) * rr];
      const p2 = [p[0] + ((b[0] - p[0]) / lb) * rr, p[1] + ((b[1] - p[1]) / lb) * rr];
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const u = 1 - t;
        out.push([u * u * p1[0] + 2 * u * t * p[0] + t * t * p2[0], u * u * p1[1] + 2 * u * t * p[1] + t * t * p2[1]]);
      }
    }
    return out;
  }

  const SHAPES = {
    circle: { name: "circle", sides: 0, corners: 0, pts: () => ellipsePts(200, 225, 112, 112), eyeY: 190, mouthY: 260 },
    square: { name: "square", sides: 4, corners: 4, pts: () => roundPts([[92, 118], [308, 118], [308, 334], [92, 334]], 30), eyeY: 192, mouthY: 262 },
    triangle: { name: "triangle", sides: 3, corners: 3, pts: () => roundPts([[200, 88], [328, 344], [72, 344]], 28), eyeY: 246, mouthY: 292 },
    rectangle: { name: "rectangle", sides: 4, corners: 4, pts: () => roundPts([[116, 92], [284, 92], [284, 350], [116, 350]], 26), eyeY: 178, mouthY: 262 },
    heart: { name: "heart", sides: 0, corners: 1, pts: () => heartPts(200, 212, 7.4), eyeY: 196, mouthY: 252 },
    star: { name: "star", sides: 10, corners: 10, points: 5, pts: () => roundPts(starPts(5, 136, 72, 200, 232), 10), eyeY: 222, mouthY: 260 },
    oval: { name: "oval", sides: 0, corners: 0, pts: () => ellipsePts(200, 225, 94, 124), eyeY: 186, mouthY: 262 },
    hexagon: { name: "hexagon", sides: 6, corners: 6, pts: () => roundPts(regularPts(6, 126, 200, 225, 0), 22), eyeY: 196, mouthY: 262 },
    pentagon: { name: "pentagon", sides: 5, corners: 5, pts: () => roundPts(regularPts(5, 130, 200, 234, -90), 22), eyeY: 212, mouthY: 272 },
    diamond: { name: "diamond", nameG2: "rhombus", sides: 4, corners: 4, pts: () => roundPts([[200, 90], [322, 225], [200, 360], [78, 225]], 22), eyeY: 206, mouthY: 262 }
  };

  // ---------------------------------------------------------------- geometry helpers

  const geomCache = {};

  function geom(shapeId) {
    if (geomCache[shapeId]) return geomCache[shapeId];
    const pts = SHAPES[shapeId].pts();
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [x, y] of pts) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    let area = 0, gx = 0, gy = 0;
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[(i + 1) % pts.length];
      const c = x1 * y2 - x2 * y1;
      area += c; gx += (x1 + x2) * c; gy += (y1 + y2) * c;
    }
    area /= 2;
    const cx = gx / (6 * area);
    const cy = gy / (6 * area);

    const inside = (x, y) => {
      let hit = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i];
        const [xj, yj] = pts[j];
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
      }
      return hit;
    };
    const topAt = (x) => { for (let y = minY; y <= maxY; y += 1) if (inside(x, y)) return y; return null; };
    const bottomAt = (x) => { for (let y = maxY; y >= minY; y -= 1) if (inside(x, y)) return y; return null; };
    const leftAt = (y) => { for (let x = minX; x <= maxX; x += 1) if (inside(x, y)) return x; return null; };
    const rightAt = (y) => { for (let x = maxX; x >= minX; x -= 1) if (inside(x, y)) return x; return null; };
    const widthAt = (y) => { const l = leftAt(y); const r = rightAt(y); return l === null ? 0 : r - l; };
    const rayHit = (deg) => {
      const a = (deg * Math.PI) / 180;
      const dx = Math.sin(a), dy = -Math.cos(a);
      let x = cx, y = cy;
      while (inside(x + dx * 2, y + dy * 2)) { x += dx * 2; y += dy * 2; }
      return { x, y, dx, dy };
    };
    const d = "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L") + " Z";

    return (geomCache[shapeId] = { pts, d, minX, maxX, minY, maxY, cx, cy, w: maxX - minX, h: maxY - minY, inside, topAt, bottomAt, leftAt, rightAt, widthAt, rayHit });
  }

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const f = (n) => n.toFixed(1);

  // ---------------------------------------------------------------- layout

  function layoutEyes(g, shape, n) {
    if (!n) return [];
    const rowsN = n <= 3 ? 1 : n <= 8 ? 2 : 3;
    const base = Math.floor(n / rowsN);
    const extra = n % rowsN;
    const per = [];
    for (let i = 0; i < rowsN; i++) per.push(base + (i >= rowsN - extra ? 1 : 0));
    const startR = n === 1 ? 34 : n === 2 ? 27 : 24;
    let r = startR;
    let ys = [];
    for (let iter = 0; iter < 8; iter++) {
      const gap = r * 2.45;
      ys = per.map((_, i) => shape.eyeY + (i - (rowsN - 1) / 2) * gap);
      const overlap = ys[ys.length - 1] + r - (shape.mouthY - 16);
      if (overlap > 0) ys = ys.map((y) => y - overlap);
      let maxR = startR;
      ys.forEach((y, i) => {
        const avail = Math.min(g.widthAt(y - r * 0.6), g.widthAt(y + r * 0.6)) - 26;
        maxR = Math.min(maxR, avail / (per[i] * 2.3));
      });
      r = Math.max(8, Math.min(startR, maxR));
    }
    const eyes = [];
    ys.forEach((y, i) => {
      const k = per[i];
      const step = r * 2.3;
      for (let j = 0; j < k; j++) eyes.push({ x: 200 + (j - (k - 1) / 2) * step, y, r, row: i });
    });
    return eyes;
  }

  function mouthWidth(g, shape, teeth) {
    const want = 70 + (teeth || 0) * 7;
    const max = g.widthAt(shape.mouthY) * 0.68;
    return Math.max(48, Math.min(want, max, 140));
  }

  function mouthGeom(g, shape, emotion, teeth) {
    const y = shape.mouthY;
    const W = mouthWidth(g, shape, teeth);
    const x0 = 200 - W / 2;
    const x1 = 200 + W / 2;
    const maxDepth = Math.max(14, (g.bottomAt(200) ?? g.maxY) - y - 14);
    const m = { W, x0, x1, y };

    if (emotion === "sad") {
      const h = Math.min(W * 0.4, maxDepth);
      const yb = y + h;
      m.d = `M${f(x0)} ${f(yb)} C${f(x0 + W * 0.1)} ${f(yb - h * 1.3)} ${f(x1 - W * 0.1)} ${f(yb - h * 1.3)} ${f(x1)} ${f(yb)} Z`;
      m.edge = () => yb; m.dir = -1; m.span = [x0 + W * 0.13, x1 - W * 0.13]; m.bottom = yb;
    } else if (emotion === "angry") {
      const h = Math.min(W * 0.3, maxDepth);
      m.d = `M${f(x0)} ${f(y)} L${f(x1)} ${f(y)} L${f(x1 - W * 0.1)} ${f(y + h)} L${f(x0 + W * 0.1)} ${f(y + h)} Z`;
      m.edge = () => y; m.dir = 1; m.span = [x0 + W * 0.06, x1 - W * 0.06]; m.bottom = y + h;
    } else if (emotion === "surprised") {
      const a = W * 0.4;
      const b = Math.min(W * 0.32, maxDepth / 2);
      const cy = y + b;
      m.d = `M${f(200 - a)} ${f(cy)} A${f(a)} ${f(b)} 0 1 0 ${f(200 + a)} ${f(cy)} A${f(a)} ${f(b)} 0 1 0 ${f(200 - a)} ${f(cy)} Z`;
      m.edge = (x) => cy - b * Math.sqrt(Math.max(0, 1 - ((x - 200) / a) ** 2)) + 1;
      m.dir = 1; m.span = [200 - a * 0.72, 200 + a * 0.72]; m.bottom = y + 2 * b; m.x0 = 200 - a; m.x1 = 200 + a;
    } else if (emotion === "scared") {
      const h = Math.min(W * 0.26, maxDepth);
      const k = 6;
      let d = `M${f(x0)} ${f(y)} L${f(x1)} ${f(y)}`;
      for (let i = 1; i <= k; i++) {
        const x = x1 - (W * i) / k;
        const yy = i === k ? y : y + (i % 2 ? h : h * 0.6);
        d += ` L${f(x)} ${f(yy)}`;
      }
      m.d = d + " Z";
      m.edge = () => y; m.dir = 1; m.span = [x0 + W * 0.08, x1 - W * 0.08]; m.bottom = y + h;
    } else {
      const depthK = emotion === "proud" ? 0.3 : emotion === "sleepy" ? 0.24 : 0.5;
      const h = Math.min(W * depthK, maxDepth);
      m.d = `M${f(x0)} ${f(y)} L${f(x1)} ${f(y)} Q200 ${f(y + h * 2)} ${f(x0)} ${f(y)} Z`;
      m.edge = () => y; m.dir = 1; m.span = [x0 + W * 0.1, x1 - W * 0.1]; m.bottom = y + h; m.depth = h;
    }
    return m;
  }

  // Spots stay clear of the face for every feeling, so changing the feeling never moves them.
  // Crowded monsters get smaller spots so the count always shows in full.
  function layoutSpots(g, shape, eyes, n, seed, teeth) {
    if (!n) return [];
    const rand = rng(seed * 7 + 13);
    const W = mouthWidth(g, shape, teeth);
    const maxDepth = Math.max(14, (g.bottomAt(200) ?? g.maxY) - shape.mouthY - 14);
    const y = shape.mouthY;
    const smile = Math.min(W * 0.5, maxDepth);
    const boxes = [
      [200 - W / 2 - 5, y - 7, 200 + W / 2 + 5, y + Math.max(smile * 1.7, Math.min(W * 0.64, maxDepth)) + 6],
      [200 - W / 2 - 36, y - 9, 200 + W / 2 + 36, y + 12]
    ];
    const topRow = eyes.length ? Math.min(...eyes.map((e) => e.row)) : 0;
    const blockers = eyes.map((e) => [e.x, e.y, e.r + 4]);
    eyes.filter((e) => e.row === topRow).forEach((e) => blockers.push([e.x, e.y - e.r * 1.4, e.r * 1.05]));
    const blocked = (x, yy, r) =>
      boxes.some(([x0, y0, x1, y1]) => x + r > x0 && x - r < x1 && yy + r > y0 && yy - r < y1) ||
      blockers.some(([bx, by, br]) => Math.hypot(x - bx, yy - by) < br + r);

    let best = [];
    for (const r of [11, 9.5, 8, 6.5, 5.5, 4.5]) {
      const cands = [];
      const step = r > 8 ? 6 : 4;
      for (let yy = g.minY + r; yy < g.maxY - r; yy += step) {
        for (let x = g.minX + r; x < g.maxX - r; x += step) {
          if (blocked(x, yy, r)) continue;
          const m = r + 4;
          if (![[0, 0], [m, 0], [-m, 0], [0, m], [0, -m], [m * 0.7, m * 0.7], [-m * 0.7, m * 0.7], [m * 0.7, -m * 0.7], [-m * 0.7, -m * 0.7]]
            .every(([dx, dy]) => g.inside(x + dx, yy + dy))) continue;
          cands.push([x, yy]);
        }
      }
      for (let i = cands.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [cands[i], cands[j]] = [cands[j], cands[i]];
      }
      for (const gap of [r * 2 + 14, r * 2 + 7, r * 2 + 3]) {
        const out = [];
        for (const [x, yy] of cands) {
          if (out.length >= n) break;
          if (out.every((s) => Math.hypot(s.x - x, s.y - yy) >= gap)) out.push({ x, y: yy, r: r * (0.88 + rand() * 0.12) });
        }
        if (out.length >= n) return out;
        if (out.length > best.length) best = out;
      }
    }
    return best;
  }

  // Horns sit evenly along the top edge of the body, pointing out and a little up, so they stay
  // clear of the arms and never lie flat against a slanted side where the body would hide them.
  function layoutHorns(g, n) {
    const armTop = g.cy - g.h * 0.2;
    const thr = Math.max(g.minY + g.h * 0.22, Math.min(g.minY + g.h * 0.45, armTop - 18));
    const pts = g.pts;
    const start = pts.findIndex((p) => p[1] >= thr);
    const loop = pts.slice(start).concat(pts.slice(0, start));
    const segs = [];
    let total = 0;
    const cut = (p, q) => {
      const t = (thr - p[1]) / (q[1] - p[1]);
      return [p[0] + (q[0] - p[0]) * t, thr];
    };
    for (let i = 0; i < loop.length; i++) {
      let a = loop[i], b = loop[(i + 1) % loop.length];
      if (a[1] >= thr && b[1] >= thr) continue;
      if (a[1] >= thr) a = cut(a, b);
      else if (b[1] >= thr) b = cut(a, b);
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (l < 0.01) continue;
      segs.push({ a, b, l, at: total });
      total += l;
    }
    const out = [];
    for (let k = 0; k < n; k++) {
      const target = total * (0.1 + (0.8 * (k + 0.5)) / n);
      const s = segs.find((sg) => target <= sg.at + sg.l) || segs[segs.length - 1];
      const t = Math.min(1, Math.max(0, (target - s.at) / s.l));
      const x = s.a[0] + (s.b[0] - s.a[0]) * t;
      const y = s.a[1] + (s.b[1] - s.a[1]) * t;
      let nx = -(s.b[1] - s.a[1]) / s.l, ny = (s.b[0] - s.a[0]) / s.l;
      if (g.inside(x + nx * 4, y + ny * 4)) { nx = -nx; ny = -ny; }
      let dx = nx, dy = ny - 0.7;
      const d = Math.hypot(dx, dy);
      dx /= d; dy /= d;
      out.push({ x, y, dx, dy });
    }
    return out.sort((p, q) => p.x - q.x);
  }

  // ---------------------------------------------------------------- drawing

  let uid = 0;

  const ARM_LIFT = { happy: -42, silly: -50, proud: -8, sad: 36, angry: -4, scared: -58, surprised: -48, sleepy: 34 };

  function popAttr(part, i, pop) {
    if (!pop || pop.part !== part || i < pop.from) return "";
    return ` class="pop" style="animation-delay:${((i - pop.from) * 0.5 + 0.1).toFixed(2)}s"`;
  }

  function renderMonster(spec, opts = {}) {
    const outline = !!opts.outline;
    const pop = opts.pop || null;
    const shape = SHAPES[spec.shape] || SHAPES.circle;
    const g = geom(spec.shape in SHAPES ? spec.shape : "circle");
    const col = COLORS.find((c) => c.id === spec.color) || COLORS[0];
    const fill = outline ? "#fff" : col.fill;
    const dark = outline ? "#fff" : col.dark;
    const emotion = spec.emotion || "happy";
    const id = `mm${++uid}`;
    const seed = spec.seed || 1;
    const rand = rng(seed);
    const lw = 6;
    const parts = [];

    // Legs (behind body)
    const nLegs = spec.legs || 0;
    let legSpan = 0;
    if (nLegs) {
      // Bodies that narrow at the bottom (heart, diamond) spread legs across their widest lower part.
      let widest = 0;
      for (let yy = g.cy; yy <= g.maxY; yy += 4) widest = Math.max(widest, g.widthAt(yy));
      const span = Math.min(widest * 0.78, nLegs * 62);
      legSpan = span;
      const legW = Math.min(30, (span / nLegs) * 0.68);
      for (let i = 0; i < nLegs; i++) {
        const x = 200 - span / 2 + (span * (i + 0.5)) / nLegs;
        const top = (g.bottomAt(x) ?? g.maxY) - 24;
        const footRx = legW * 0.8 + 5;
        parts.push(`<g${popAttr("legs", i, pop)}>
          <rect x="${f(x - legW / 2)}" y="${f(top)}" width="${f(legW)}" height="${f(GROUND - top)}" rx="${f(legW / 2)}" fill="${fill}" stroke="${INK}" stroke-width="5"/>
          <ellipse cx="${f(x)}" cy="${GROUND + 2}" rx="${f(footRx)}" ry="10" fill="${dark}" stroke="${INK}" stroke-width="5"/>
        </g>`);
      }
    }

    if (!outline && opts.shadow !== false) {
      const rx = Math.max(g.w * 0.42, legSpan / 2 + 26);
      parts.unshift(`<ellipse cx="200" cy="${GROUND + 9}" rx="${f(rx)}" ry="13" fill="${INK}" opacity="0.13"/>`);
    }

    // Horns (behind body)
    const nHorns = spec.horns || 0;
    if (nHorns) {
      const len = 44 - nHorns * 2;
      const bw = nHorns > 4 ? 17 : 23;
      layoutHorns(g, nHorns).forEach((h, i) => {
        const bx = h.x - h.dx * 10, by = h.y - h.dy * 10;
        const px = -h.dy, py = h.dx;
        const tx = bx + h.dx * (len + 10), ty = by + h.dy * (len + 10);
        const l1 = [bx + (px * bw) / 2, by + (py * bw) / 2];
        const l2 = [bx - (px * bw) / 2, by - (py * bw) / 2];
        const c1 = [(l1[0] + tx) / 2 + px * 4, (l1[1] + ty) / 2 + py * 4];
        const c2 = [(l2[0] + tx) / 2 - px * 2, (l2[1] + ty) / 2 - py * 2];
        parts.push(`<path${popAttr("horns", i, pop)} d="M${f(l1[0])} ${f(l1[1])} Q${f(c1[0])} ${f(c1[1])} ${f(tx)} ${f(ty)} Q${f(c2[0])} ${f(c2[1])} ${f(l2[0])} ${f(l2[1])} Z" fill="${outline ? "#fff" : HORN}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`);
      });
    }

    // Arms (behind body)
    const nArms = spec.arms || 0;
    if (nArms) {
      const left = Math.ceil(nArms / 2);
      const right = nArms - left;
      const lift = ARM_LIFT[emotion] ?? -20;
      const aw = nArms > 4 ? 13 : 17;
      const hr = nArms > 4 ? 11 : 13;
      let idx = 0;
      const side = (k, dir) => {
        const y0 = g.cy - g.h * 0.2;
        const y1 = g.cy + g.h * 0.24;
        for (let j = 0; j < k; j++) {
          const ay = k === 1 ? g.cy + g.h * 0.04 : y0 + ((y1 - y0) * j) / (k - 1);
          const edge = dir < 0 ? g.leftAt(ay) : g.rightAt(ay);
          const ax = (edge ?? 200) - dir * 16;
          const reach = 72;
          const myLift = lift * (1 - j * 0.18);
          const hx = ax + dir * reach;
          const hy = ay + myLift;
          const cx = ax + dir * reach * 0.55;
          const cy = ay + myLift * 0.1 + 6;
          const path = `M${f(ax)} ${f(ay)} Q${f(cx)} ${f(cy)} ${f(hx)} ${f(hy)}`;
          const fingers = emotion === "angry" ? "" : [-1, 0, 1].map((k2) => {
            const a = Math.atan2(hy - cy, hx - cx) + k2 * 0.7;
            return `<circle cx="${f(hx + Math.cos(a) * hr)}" cy="${f(hy + Math.sin(a) * hr)}" r="${f(hr * 0.42)}" fill="${fill}" stroke="${INK}" stroke-width="3.5"/>`;
          }).join("");
          parts.push(`<g${popAttr("arms", idx, pop)}>
            <path d="${path}" fill="none" stroke="${INK}" stroke-width="${aw + 10}" stroke-linecap="round"/>
            <path d="${path}" fill="none" stroke="${fill}" stroke-width="${aw}" stroke-linecap="round"/>
            ${fingers}
            <circle cx="${f(hx)}" cy="${f(hy)}" r="${hr}" fill="${fill}" stroke="${INK}" stroke-width="5"/>
          </g>`);
          idx++;
        }
      };
      side(left, -1);
      side(right, 1);
    }

    // Body
    parts.push(`<clipPath id="${id}b"><path d="${g.d}"/></clipPath>`);
    parts.push(`<path d="${g.d}" fill="${fill}" stroke="${INK}" stroke-width="${lw}" stroke-linejoin="round"/>`);
    if (!outline) {
      parts.push(`<ellipse clip-path="url(#${id}b)" cx="${f(g.minX + g.w * 0.3)}" cy="${f(g.minY + g.h * 0.24)}" rx="${f(g.w * 0.16)}" ry="${f(g.h * 0.09)}" transform="rotate(-25 ${f(g.minX + g.w * 0.3)} ${f(g.minY + g.h * 0.24)})" fill="#fff" opacity="0.28"/>`);
      parts.push(`<ellipse clip-path="url(#${id}b)" cx="${f(g.cx + g.w * 0.2)}" cy="${f(g.maxY + g.h * 0.05)}" rx="${f(g.w * 0.62)}" ry="${f(g.h * 0.34)}" fill="${dark}" opacity="0.22"/>`);
      parts.push(`<path d="${g.d}" fill="none" stroke="${INK}" stroke-width="${lw}" stroke-linejoin="round"/>`);
    }

    const eyes = layoutEyes(g, shape, spec.eyes || 0);

    // Spots
    layoutSpots(g, shape, eyes, spec.spots || 0, seed, spec.teeth || 0).forEach((s, i) => {
      parts.push(`<circle${popAttr("spots", i, pop)} cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.r)}" fill="${dark}" stroke="${outline ? INK : "none"}" stroke-width="3"/>`);
    });

    // Eyes
    const topRow = eyes.length ? Math.min(...eyes.map((e) => e.row)) : 0;
    eyes.forEach((e, i) => {
      const { x, y, r } = e;
      let pr = r * 0.5;
      let px = x, py = y + r * 0.08;
      if (emotion === "surprised" || emotion === "scared") pr = r * 0.3;
      if (emotion === "sad") py = y + r * 0.3;
      if (emotion === "proud") py = y - r * 0.22;
      if (emotion === "silly") { px = x + (rand() - 0.5) * r * 0.8; py = y + (rand() - 0.5) * r * 0.8; }
      if (emotion === "sleepy") py = y + r * 0.3;
      let s = `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#fff" stroke="${INK}" stroke-width="${r > 14 ? 4 : 3}"/>`;
      s += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(pr)}" fill="${INK}"/>`;
      s += `<circle cx="${f(px - pr * 0.35)}" cy="${f(py - pr * 0.4)}" r="${f(Math.max(1.5, pr * 0.35))}" fill="#fff"/>`;
      if (emotion === "sleepy") {
        s += `<path d="M${f(x - r)} ${f(y + 1)} A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y + 1)} Z" fill="${dark}" stroke="${INK}" stroke-width="3"/>`;
      }
      if (emotion === "proud") {
        s += `<path d="M${f(x - r)} ${f(y + r * 0.35)} Q${f(x)} ${f(y - r * 0.05)} ${f(x + r)} ${f(y + r * 0.35)} A${f(r)} ${f(r)} 0 0 1 ${f(x - r)} ${f(y + r * 0.35)} Z" fill="${fill}" stroke="${INK}" stroke-width="3"/>`;
      }
      const blink = outline ? s : `<g class="blink" style="animation-delay:${((seed % 37) / 10).toFixed(1)}s">${s}</g>`;
      parts.push(`<g${popAttr("eyes", i, pop)}>${blink}${e.row === topRow ? brow(x, y, r, emotion) : ""}</g>`);
    });

    // Mouth and teeth
    const m = mouthGeom(g, shape, emotion, spec.teeth || 0);
    parts.push(`<clipPath id="${id}m"><path d="${m.d}"/></clipPath>`);
    parts.push(`<path d="${m.d}" fill="${outline ? "#fff" : MOUTH}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`);
    if (!outline && m.depth && (emotion === "happy" || emotion === "silly")) {
      parts.push(`<ellipse clip-path="url(#${id}m)" cx="200" cy="${f(m.y + m.depth)}" rx="${f(m.W * 0.24)}" ry="${f(m.depth * 0.45)}" fill="#ff7d9c"/>`);
    }
    const nTeeth = spec.teeth || 0;
    if (nTeeth) {
      const [s0, s1] = m.span;
      const step = (s1 - s0) / nTeeth;
      const tw = Math.min(20, step * 0.92);
      const th = Math.min(tw * 1.15, 18);
      for (let i = 0; i < nTeeth; i++) {
        const x = s0 + step * (i + 0.5);
        const ey = m.edge(x);
        parts.push(`<path${popAttr("teeth", i, pop)} d="M${f(x - tw / 2)} ${f(ey)} L${f(x + tw / 2)} ${f(ey)} L${f(x)} ${f(ey + m.dir * th)} Z" fill="#fff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`);
      }
    }
    if (emotion === "silly" && m.depth) {
      parts.push(`<path d="M${f(200 + m.W * 0.02)} ${f(m.y + m.depth * 0.9)} q0 ${f(m.depth * 0.7)} ${f(m.W * 0.15)} ${f(m.depth * 0.7)} q${f(m.W * 0.15)} 0 ${f(m.W * 0.15)} ${f(-m.depth * 0.7)} Z" fill="${outline ? "#fff" : "#ff7d9c"}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`);
    }

    // Feeling extras
    if (!outline && ["happy", "silly", "proud", "surprised"].includes(emotion)) {
      for (const dir of [-1, 1]) {
        const cx = 200 + dir * (m.W / 2 + 20);
        if (g.inside(cx, m.y + 2) && g.inside(cx + dir * 14, m.y + 2)) {
          parts.push(`<ellipse cx="${f(cx)}" cy="${f(m.y + 2)}" rx="13" ry="7" fill="#ff7aa8" opacity="0.55"/>`);
        }
      }
    }
    if (emotion === "sad" && eyes.length) {
      const e = eyes.reduce((a, b) => (b.x > a.x ? b : a));
      const tx = e.x + e.r * 0.5, ty = e.y + e.r + 6;
      parts.push(`<path d="M${f(tx)} ${f(ty)} q-8 12 0 16 q8 -4 0 -16 Z" fill="${outline ? "#fff" : "#7cc8ff"}" stroke="${INK}" stroke-width="2.5"/>`);
    }
    if (emotion === "scared") {
      const sy = g.minY + g.h * 0.28;
      const sx = (g.rightAt(sy) ?? 300) - 18;
      parts.push(`<path d="M${f(sx)} ${f(sy)} q-9 13 0 18 q9 -5 0 -18 Z" fill="${outline ? "#fff" : "#9bd8ff"}" stroke="${INK}" stroke-width="2.5"/>`);
    }
    if (emotion === "sleepy") {
      parts.push(`<text x="${f(g.maxX - 6)}" y="${f(g.minY + 4)}" font-size="30" font-weight="700" fill="${INK}" font-family="Andika, sans-serif">z</text>`);
      parts.push(`<text x="${f(g.maxX + 16)}" y="${f(g.minY - 22)}" font-size="40" font-weight="700" fill="${INK}" font-family="Andika, sans-serif">Z</text>`);
    }
    if (emotion === "angry") {
      const sy = g.minY + 4;
      parts.push(`<path d="M${f(g.maxX - 4)} ${f(sy)} l10 -10 m4 18 l14 -4 m-30 -18 l2 -14" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"/>`);
    }

    const vb = opts.viewBox || `0 0 ${VB_W} ${VB_H}`;
    return `<svg class="monster-svg" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escAttr(spec.name || "monster")}">${parts.join("")}</svg>`;
  }

  function brow(x, y, r, emotion) {
    const by = y - r * 1.38;
    const w = r * 0.85;
    const sw = Math.max(3, r * 0.17);
    const line = (d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${f(sw)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const inner = x < 199 ? 1 : x > 201 ? -1 : 0;
    if (emotion === "angry" || emotion === "sad") {
      const t = (emotion === "angry" ? 1 : -1) * r * 0.4;
      if (inner === 0) return line(`M${f(x - w)} ${f(by - t)} L${f(x)} ${f(by + t * 0.6)} L${f(x + w)} ${f(by - t)}`);
      const xi = x + inner * w, xo = x - inner * w;
      return line(`M${f(xo)} ${f(by - t * 0.6)} L${f(xi)} ${f(by + t * 0.6)}`);
    }
    if (emotion === "surprised") return line(`M${f(x - w)} ${f(by - r * 0.15)} Q${f(x)} ${f(by - r * 0.75)} ${f(x + w)} ${f(by - r * 0.15)}`);
    if (emotion === "scared") return line(`M${f(x - w)} ${f(by)} q${f(w / 2)} ${f(-r * 0.35)} ${f(w)} 0 q${f(w / 2)} ${f(r * 0.35)} ${f(w)} 0`);
    if (emotion === "sleepy") return "";
    return line(`M${f(x - w * 0.8)} ${f(by + r * 0.1)} Q${f(x)} ${f(by - r * 0.3)} ${f(x + w * 0.8)} ${f(by + r * 0.1)}`);
  }

  function escAttr(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function renderShape(shapeId, colorId) {
    const g = geom(shapeId);
    const col = COLORS.find((c) => c.id === colorId) || COLORS[0];
    const pad = 12;
    return `<svg viewBox="${f(g.minX - pad)} ${f(g.minY - pad)} ${f(g.w + pad * 2)} ${f(g.h + pad * 2)}" xmlns="http://www.w3.org/2000/svg"><path d="${g.d}" fill="${col.fill}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></svg>`;
  }

  // Small pictures used to show counting problems.
  function renderIcon(kind, colorId) {
    const col = COLORS.find((c) => c.id === colorId) || COLORS[0];
    const wrap = (inner) => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
    switch (kind) {
      case "eyes":
        return wrap(`<circle cx="20" cy="20" r="15" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="21" cy="22" r="7" fill="${INK}"/><circle cx="18.5" cy="19" r="2.4" fill="#fff"/>`);
      case "teeth":
        return wrap(`<path d="M9 8 L31 8 Q32 20 26 33 Q20 26 14 33 Q8 20 9 8 Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`);
      case "arms":
        return wrap(`<circle cx="12" cy="13" r="5" fill="${col.fill}" stroke="${INK}" stroke-width="2.5"/><circle cx="20" cy="9" r="5" fill="${col.fill}" stroke="${INK}" stroke-width="2.5"/><circle cx="28" cy="13" r="5" fill="${col.fill}" stroke="${INK}" stroke-width="2.5"/><circle cx="20" cy="24" r="11" fill="${col.fill}" stroke="${INK}" stroke-width="3"/>`);
      case "legs":
        return wrap(`<rect x="13" y="4" width="13" height="24" rx="6" fill="${col.fill}" stroke="${INK}" stroke-width="3"/><ellipse cx="20" cy="31" rx="13" ry="6" fill="${col.dark}" stroke="${INK}" stroke-width="3"/>`);
      case "horns":
        return wrap(`<path d="M10 35 Q14 18 24 4 Q24 22 30 35 Z" fill="${HORN}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`);
      case "spots":
        return wrap(`<circle cx="20" cy="20" r="13" fill="${col.dark}" stroke="${INK}" stroke-width="2.5"/>`);
      default:
        return wrap(`<circle cx="20" cy="20" r="14" fill="${col.fill}" stroke="${INK}" stroke-width="3"/>`);
    }
  }

  window.MM = { COLORS, SHAPES, renderMonster, renderShape, renderIcon, INK };
})();
