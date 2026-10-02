// Visual sparkle: confetti, floating background bits, bouncy title, scenery, speech bubbles.
(() => {
  "use strict";

  const COLORS = ["#ff5fa2", "#ffd23f", "#19c3b3", "#7b5cff", "#ff9f1c", "#4cd964", "#5ac8fa"];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const calm = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  let layer = null;
  function fxLayer() {
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "fx-layer";
      document.body.appendChild(layer);
    }
    return layer;
  }

  function confetti(x, y, count = 40, opts = {}) {
    if (calm()) count = Math.min(count, 8);
    const root = fxLayer();
    const symbols = opts.symbols || null;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      const shape = symbols ? "sym" : pickOne(["rect", "circle", "rect", "star"]);
      p.className = `confetti ${shape}`;
      if (symbols) p.textContent = pickOne(symbols);
      const angle = rand(0, Math.PI * 2);
      const power = rand(120, opts.power || 360);
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.setProperty("--dx", `${Math.cos(angle) * power}px`);
      p.style.setProperty("--dy", `${Math.sin(angle) * power - rand(60, 180)}px`);
      p.style.setProperty("--rot", `${rand(-720, 720)}deg`);
      p.style.setProperty("--dur", `${rand(0.9, 1.6)}s`);
      p.style.setProperty("--c", pickOne(COLORS));
      root.appendChild(p);
      setTimeout(() => p.remove(), 1800);
    }
  }

  function burstAt(el, count, opts) {
    const r = el.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 2, count, opts);
  }

  function rain(count = 60) {
    const w = window.innerWidth;
    for (let i = 0; i < count; i++) {
      setTimeout(() => confetti(rand(0, w), rand(-20, 60), 1, { power: 140 }), i * 25);
    }
  }

  function floaties(container, n = 16) {
    if (!container || container.querySelector(".floaties")) return;
    const box = document.createElement("div");
    box.className = "floaties";
    const bits = ["\u2B50", "\u2728", "\u{1F49C}", "\u{1F31F}", "\u{1FA77}"];
    for (let i = 0; i < n; i++) {
      const f = document.createElement("span");
      const isBubble = i % 3 !== 0;
      f.className = isBubble ? "floaty bubble" : "floaty sym";
      if (!isBubble) f.textContent = pickOne(bits);
      const size = isBubble ? rand(18, 60) : rand(18, 34);
      f.style.left = `${rand(0, 100)}%`;
      f.style.setProperty("--size", `${size}px`);
      f.style.setProperty("--dur", `${rand(10, 22)}s`);
      f.style.setProperty("--delay", `${-rand(0, 22)}s`);
      f.style.setProperty("--drift", `${rand(-60, 60)}px`);
      f.style.setProperty("--c", pickOne(COLORS));
      box.appendChild(f);
    }
    container.prepend(box);
  }

  function bouncyTitle(el) {
    if (!el || el.dataset.bouncy) return;
    el.dataset.bouncy = "1";
    let i = 0;
    el.querySelectorAll("span.word-part").forEach((part) => {
      const text = part.textContent;
      part.textContent = "";
      [...text].forEach((ch) => {
        const s = document.createElement("span");
        s.className = "ltr";
        s.textContent = ch;
        s.style.setProperty("--i", i++);
        part.appendChild(s);
      });
    });
  }

  const SCENERY = {
    meadow: { ground: ["\u{1F337}", "\u{1F33C}", "\u{1F338}", "\u{1F33B}", "\u{1F340}"], air: ["\u{1F98B}", "\u{1F41D}"] },
    woods: { ground: ["\u{1F333}", "\u{1F344}", "\u{1F332}", "\u{1F33F}", "\u{1F344}"], air: ["\u{1F426}", "\u{1F343}"] },
    cave: { ground: ["\u{1F48E}", "\u{1F52E}", "\u{1FAA8}", "\u{1F48E}", "\u{1F344}"], air: ["\u{1F987}", "\u2728"] }
  };

  function scenery(stage, regionId) {
    stage.querySelectorAll(".scenery").forEach((s) => s.remove());
    const set = SCENERY[regionId] || SCENERY.meadow;
    const box = document.createElement("div");
    box.className = `scenery scenery-${regionId}`;
    let html = "";
    for (let i = 0; i < 3; i++) {
      html += `<span class="cloud" style="top:${6 + i * 13}%;--dur:${rand(40, 70)}s;--delay:${-rand(0, 60)}s;--scale:${rand(0.6, 1.2)}"></span>`;
    }
    const spots = [3, 13, 24, 76, 87, 95];
    spots.forEach((left, i) => {
      html += `<span class="deco ground-deco" style="left:${left}%;--size:${rand(34, 58)}px;--delay:${i * 0.3}s">${set.ground[i % set.ground.length]}</span>`;
    });
    set.air.forEach((sym, i) => {
      html += `<span class="deco air-deco" style="top:${18 + i * 22}%;--dur:${rand(9, 14)}s;--delay:${-rand(0, 10)}s">${sym}</span>`;
    });
    box.innerHTML = html;
    stage.prepend(box);
  }

  const LINES = {
    hello: ["Catch me!", "Hee hee!", "Boop!", "Wanna play?", "I'm sneaky!", "Wiggle wiggle!", "Peekaboo!", "Bet you can't!", "Yoo-hoo!"],
    hear: ["Find my word!", "Which one is me?", "Listen close!"],
    miss: ["Missed me!", "Nope! Hee hee!", "Too ticklish!", "Wheee!", "Try again!"],
    bye: ["Bye bye!", "See ya!", "Zoom zoom!"]
  };

  let bubbleTimer = null;
  function say(kind, anchor, text) {
    const host = anchor;
    let b = host.querySelector(".bubble-talk");
    if (!b) {
      b = document.createElement("div");
      b.className = "bubble-talk";
      host.appendChild(b);
    }
    b.textContent = text || pickOne(LINES[kind] || LINES.hello);
    b.classList.remove("show");
    void b.offsetWidth;
    b.classList.add("show");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => b.classList.remove("show"), 1600);
  }

  function shake(el) {
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }

  function flash(color = "#fff") {
    const f = document.createElement("div");
    f.className = "flash";
    f.style.background = color;
    fxLayer().appendChild(f);
    setTimeout(() => f.remove(), 600);
  }

  window.WM_FX = { confetti, burstAt, rain, floaties, bouncyTitle, scenery, say, shake, flash };
})();
