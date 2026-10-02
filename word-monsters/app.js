(() => {
  "use strict";

  const REGIONS = window.WM_REGIONS;
  const STORE_KEY = "wordMonsters.v1";
  const TRIP_LEN = 8;
  const MAX_REQUEUE = 2;
  const STAGE_AT = [1, 6, 12]; // points needed for caught / evolved / mega
  const READ_MODE_AT = 3;      // points before a sight word switches from "hear & find" to "read & pick"
  const LEARNING_SLOTS = 3;    // how many not-yet-solid sight words can be in play at once
  const UNLOCK_CAUGHT = 12;    // monsters caught in a region to open the next one
  const EASY_SHARE = 0.3;
  const AWARD = { hear: [1, 0], read: [2, 1] }; // [first try, second try]

  const ALL = [];
  const SAY = {};
  REGIONS.forEach((r, ri) => r.words.forEach((e) => {
    e.region = r.id;
    e.regionIndex = ri;
    ALL.push(e);
    if (e.say) SAY[e.w] = e.say;
  }));

  const $ = (id) => document.getElementById(id);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------------------------------------------------------------- state

  let state = load();

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && s.words) return withDefaults(s);
    } catch (e) { /* fall through */ }
    return withDefaults({});
  }
  function withDefaults(s) {
    return {
      words: s.words || {},
      settings: Object.assign({ rate: 0.8, voice: "", unlockAll: false, sfx: true }, s.settings || {}),
      region: s.region || REGIONS[0].id,
      trips: s.trips || 0
    };
  }
  function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
  function rec(w) { return state.words[w] || (state.words[w] = { pts: 0, seen: false, tries: 0, firstTry: 0, helps: 0 }); }
  function pts(w) { return (state.words[w] || {}).pts || 0; }
  function stageOf(p) { return p >= STAGE_AT[2] ? 3 : p >= STAGE_AT[1] ? 2 : p >= STAGE_AT[0] ? 1 : 0; }
  function isCaught(w) { return pts(w) >= STAGE_AT[0]; }
  function caughtIn(region) { return region.words.filter((e) => isCaught(e.w)).length; }
  function totalCaught() { return ALL.filter((e) => isCaught(e.w)).length; }
  function isUnlocked(ri) {
    if (ri === 0 || state.settings.unlockAll) return true;
    return caughtIn(REGIONS[ri - 1]) >= UNLOCK_CAUGHT;
  }
  function currentRegion() {
    const ri = REGIONS.findIndex((r) => r.id === state.region);
    return ri >= 0 && isUnlocked(ri) ? REGIONS[ri] : REGIONS[0];
  }
  function modeFor(e) { return e.easy || pts(e.w) >= READ_MODE_AT ? "read" : "hear"; }

  // ---------------------------------------------------------------- speech

  const Speech = {
    voices: [],
    init() {
      if (!("speechSynthesis" in window)) return;
      const load = () => { this.voices = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)); };
      load();
      speechSynthesis.onvoiceschanged = load;
    },
    pickVoice() {
      const v = this.voices;
      if (state.settings.voice) {
        const m = v.find((x) => x.name === state.settings.voice);
        if (m) return m;
      }
      return v.find((x) => /en[-_]US/i.test(x.lang) && /google/i.test(x.name)) ||
        v.find((x) => /en[-_]US/i.test(x.lang)) || v[0] || null;
    },
    say(text) {
      if (!("speechSynthesis" in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = this.pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "en-US"; }
      u.rate = state.settings.rate;
      u.pitch = 1.05;
      // Chrome on Android sometimes drops an utterance queued right after cancel().
      setTimeout(() => speechSynthesis.speak(u), 60);
    }
  };
  // Grown-up voice recordings, stored per device in IndexedDB. A recording always wins over text-to-speech.
  const Clips = {
    db: null,
    urls: new Map(),
    current: null,
    async init() {
      if (!window.indexedDB) return;
      try {
        this.db = await new Promise((res, rej) => {
          const r = indexedDB.open("wordMonsters", 1);
          r.onupgradeneeded = () => r.result.createObjectStore("clips");
          r.onsuccess = () => res(r.result);
          r.onerror = () => rej(r.error);
        });
        await new Promise((res) => {
          const req = this.db.transaction("clips").objectStore("clips").openCursor();
          req.onsuccess = () => {
            const c = req.result;
            if (!c) { res(); return; }
            this.urls.set(c.key, URL.createObjectURL(c.value));
            c.continue();
          };
          req.onerror = () => res();
        });
      } catch (e) { this.db = null; }
    },
    has(w) { return this.urls.has(w); },
    play(w) {
      if (this.current) this.current.pause();
      this.current = new Audio(this.urls.get(w));
      this.current.play().catch(() => {});
    },
    write(w, blob) {
      if (!this.db) return Promise.resolve();
      return new Promise((res) => {
        const tx = this.db.transaction("clips", "readwrite");
        if (blob) tx.objectStore("clips").put(blob, w); else tx.objectStore("clips").delete(w);
        tx.oncomplete = tx.onerror = () => res();
      });
    },
    async save(w, blob) {
      await this.write(w, blob);
      if (this.urls.has(w)) URL.revokeObjectURL(this.urls.get(w));
      this.urls.set(w, URL.createObjectURL(blob));
    },
    async remove(w) {
      await this.write(w, null);
      if (this.urls.has(w)) URL.revokeObjectURL(this.urls.get(w));
      this.urls.delete(w);
    }
  };

  const sayWord = (w) => {
    if (Clips.has(w)) {
      if (window.speechSynthesis) speechSynthesis.cancel();
      Clips.play(w);
    } else {
      Speech.say(SAY[w] || w);
    }
  };

  const Recorder = {
    active: null,
    async start(w, onDone) {
      if (this.active) { this.stop(); return; }
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        alert("The microphone isn't available. Allow microphone access for this site and try again.");
        return;
      }
      const chunks = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (ev) => { if (ev.data.size) chunks.push(ev.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        clearTimeout(this.active && this.active.timer);
        this.active = null;
        if (chunks.length) {
          await Clips.save(w, new Blob(chunks, { type: mr.mimeType || "audio/webm" }));
          Clips.play(w);
        }
        onDone();
      };
      mr.start();
      this.active = { mr, timer: setTimeout(() => this.stop(), 3000) };
    },
    stop() { if (this.active && this.active.mr.state !== "inactive") this.active.mr.stop(); }
  };

  // ---------------------------------------------------------------- sound effects

  const Sfx = {
    ctx: null,
    ensure() {
      if (!this.ctx) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (C) this.ctx = new C();
      }
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    },
    tone(freq, start, dur, type = "sine", vol = 0.15, slideTo) {
      if (!state.settings.sfx) return;
      const c = this.ensure();
      if (!c) return;
      const t = c.currentTime + start;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(c.destination);
      o.start(t);
      o.stop(t + dur + 0.05);
    },
    pop() { this.tone(700, 0, 0.09, "triangle", 0.12); },
    catch() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.08, 0.2, "triangle")); },
    evolve() { [392, 523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, i * 0.1, 0.3, "triangle", 0.18)); },
    boing() { this.tone(320, 0, 0.35, "sine", 0.22, 110); },
    escape() { this.tone(500, 0, 0.12, "square", 0.05); this.tone(900, 0.1, 0.5, "sine", 0.12, 200); },
    fanfare() { [523, 523, 784, 659, 1047].forEach((f, i) => this.tone(f, i * 0.14, 0.28, "triangle", 0.16)); }
  };

  // ---------------------------------------------------------------- monster art

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
    [[100, 98, 20]],
    [[78, 98, 15], [122, 98, 15]],
    [[70, 102, 12], [100, 86, 13], [130, 102, 12]]
  ];

  function monsterSVG(word, stage, silhouette = false) {
    const pick = (n, salt) => hash(word, salt) % n;
    const hue = hash(word, 9) % 360;
    const body = silhouette ? "#4a4868" : `hsl(${hue} 78% 63%)`;
    const dark = silhouette ? "#3a3856" : `hsl(${hue} 62% 40%)`;
    const light = silhouette ? "#4a4868" : `hsl(${(hue + 30) % 360} 90% 82%)`;
    const ink = "#2b2440";
    const s = stage >= 3 ? 1 : stage === 2 ? 0.92 : 0.82;
    const shape = BODIES[pick(BODIES.length, 1)];
    const eyes = EYES[pick(EYES.length, 2)];
    const mouth = pick(4, 3);
    const top = pick(4, 4);
    const spots = pick(2, 5) === 1;

    let back = "";
    if (stage >= 3) {
      back += `<ellipse cx="42" cy="96" rx="36" ry="20" transform="rotate(-30 42 96)" fill="${light}" stroke="${dark}" stroke-width="3"/>
               <ellipse cx="158" cy="96" rx="36" ry="20" transform="rotate(30 158 96)" fill="${light}" stroke="${dark}" stroke-width="3"/>`;
    }
    const tops = [
      `<line x1="84" y1="60" x2="70" y2="20" stroke="${dark}" stroke-width="5" stroke-linecap="round"/>
       <line x1="116" y1="60" x2="130" y2="20" stroke="${dark}" stroke-width="5" stroke-linecap="round"/>
       <circle cx="70" cy="18" r="8" fill="${light}" stroke="${dark}" stroke-width="3"/>
       <circle cx="130" cy="18" r="8" fill="${light}" stroke="${dark}" stroke-width="3"/>`,
      `<path d="M68 66 L60 24 L90 54Z" fill="${silhouette ? body : "#fff3c4"}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>
       <path d="M132 66 L140 24 L110 54Z" fill="${silhouette ? body : "#fff3c4"}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>`,
      `<circle cx="60" cy="62" r="21" fill="${body}" stroke="${dark}" stroke-width="3"/>
       <circle cx="140" cy="62" r="21" fill="${body}" stroke="${dark}" stroke-width="3"/>
       <circle cx="60" cy="62" r="11" fill="${light}"/><circle cx="140" cy="62" r="11" fill="${light}"/>`,
      `<path d="M100 60 C88 34 94 20 100 12 C106 20 112 34 100 60Z" fill="${light}" stroke="${dark}" stroke-width="3"/>
       <path d="M96 60 C76 44 74 30 76 22 C86 26 96 38 96 60Z" fill="${light}" stroke="${dark}" stroke-width="3"/>
       <path d="M104 60 C124 44 126 30 124 22 C114 26 104 38 104 60Z" fill="${light}" stroke="${dark}" stroke-width="3"/>`
    ];
    back += tops[top];
    if (stage >= 2 && top !== 1) {
      back += `<path d="M80 58 L76 36 L92 52Z" fill="${silhouette ? body : "#fff3c4"}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>
               <path d="M120 58 L124 36 L108 52Z" fill="${silhouette ? body : "#fff3c4"}" stroke="${dark}" stroke-width="3" stroke-linejoin="round"/>`;
    }

    let front = `
      <ellipse cx="38" cy="128" rx="11" ry="19" transform="rotate(25 38 128)" fill="${body}" stroke="${dark}" stroke-width="3"/>
      <ellipse cx="162" cy="128" rx="11" ry="19" transform="rotate(-25 162 128)" fill="${body}" stroke="${dark}" stroke-width="3"/>
      <ellipse cx="76" cy="180" rx="17" ry="9" fill="${dark}"/>
      <ellipse cx="124" cy="180" rx="17" ry="9" fill="${dark}"/>
      <path d="${shape}" fill="${body}" stroke="${dark}" stroke-width="4" stroke-linejoin="round"/>`;

    if (silhouette) {
      front += `<text x="100" y="136" text-anchor="middle" font-size="64" font-weight="700" fill="#8e8ab8" font-family="Andika, sans-serif">?</text>`;
    } else {
      if (stage >= 2) front += `<ellipse cx="100" cy="148" rx="32" ry="22" fill="${light}" opacity=".9"/>`;
      if (spots) {
        front += `<circle cx="62" cy="122" r="7" fill="${dark}" opacity=".3"/>
                  <circle cx="142" cy="112" r="5" fill="${dark}" opacity=".3"/>
                  <circle cx="134" cy="156" r="6" fill="${dark}" opacity=".3"/>`;
      }
      eyes.forEach(([x, y, r]) => {
        front += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${ink}" stroke-width="2.5"/>
                  <circle cx="${x + r * 0.15}" cy="${y + r * 0.2}" r="${r * 0.52}" fill="${ink}"/>
                  <circle cx="${x + r * 0.35}" cy="${y - r * 0.1}" r="${r * 0.18}" fill="#fff"/>`;
      });
      front += `<ellipse cx="64" cy="126" rx="10" ry="6" fill="#ff8fb1" opacity=".65"/>
                <ellipse cx="136" cy="126" rx="10" ry="6" fill="#ff8fb1" opacity=".65"/>`;
      const mouths = [
        `<path d="M84 128 Q100 146 116 128" stroke="${ink}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
        `<path d="M84 126 Q100 154 116 126 Z" fill="${ink}"/><ellipse cx="100" cy="140" rx="8" ry="5" fill="#ff6f91"/>`,
        `<path d="M82 126 Q100 152 118 126 Z" fill="${ink}"/><rect x="88" y="126" width="8" height="8" rx="2" fill="#fff"/><rect x="104" y="126" width="8" height="8" rx="2" fill="#fff"/>`,
        `<ellipse cx="100" cy="134" rx="8" ry="10" fill="${ink}"/>`
      ];
      front += mouths[mouth];
      if (stage >= 3) {
        front += `<path d="M76 50 L80 26 L91 40 L100 20 L109 40 L120 26 L124 50Z" fill="#ffd23f" stroke="#d89c00" stroke-width="3" stroke-linejoin="round"/>
                  <text x="170" y="40" font-size="26">\u2728</text><text x="12" y="170" font-size="22">\u2728</text>`;
      }
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="translate(100 112) scale(${s}) translate(-100 -112)">${back}${front}</g></svg>`;
  }

  function trickyHTML(e) {
    const src = e.tricky || e.w;
    const parts = [];
    const re = /\[([^\]]+)\]|([^\[]+)/g;
    let m;
    while ((m = re.exec(src))) {
      if (m[1]) parts.push(`<span class="seg tricky">${esc(m[1])}<i class="heart">\u2764\uFE0F</i></span>`);
      else parts.push(`<span class="seg">${esc(m[2])}</span>`);
    }
    return `<span class="word">${parts.join("")}</span>`;
  }

  // ---------------------------------------------------------------- screens

  function show(name) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === `screen-${name}`));
    if (name === "home") renderHome();
    if (name === "dex") renderDex();
  }

  function renderHome() {
    const caught = ALL.filter((e) => isCaught(e.w));
    const parade = $("parade");
    if (caught.length) {
      parade.innerHTML = shuffle(caught).slice(0, 5)
        .map((e) => `<div class="mon">${monsterSVG(e.w, stageOf(pts(e.w)))}</div>`).join("");
    } else {
      parade.innerHTML = ["x1", "x2", "x3"].map((w) => `<div class="mon">${monsterSVG(w, 1, true)}</div>`).join("") +
        `<p class="parade-hint">Monsters are hiding. Go find them!</p>`;
    }

    const cur = currentRegion();
    $("regions").innerHTML = REGIONS.map((r, ri) => {
      const open = isUnlocked(ri);
      const cls = ["region-card", open ? "" : "locked", r.id === cur.id ? "selected" : ""].join(" ");
      const count = open
        ? `${caughtIn(r)} / ${r.words.length} caught`
        : `Catch ${Math.max(0, UNLOCK_CAUGHT - caughtIn(REGIONS[ri - 1]))} more`;
      return `<button class="${cls}" data-region="${r.id}" data-ri="${ri}">
        <span class="emoji">${r.emoji}</span><span>${esc(r.name)}</span><span class="count">${count}</span></button>`;
    }).join("");
    $("dex-count").textContent = caught.length;
  }

  $("regions").addEventListener("click", (ev) => {
    const btn = ev.target.closest(".region-card");
    if (!btn) return;
    Sfx.pop();
    const ri = Number(btn.dataset.ri);
    if (!isUnlocked(ri)) {
      btn.classList.remove("wiggle");
      void btn.offsetWidth;
      btn.classList.add("wiggle");
      return;
    }
    state.region = btn.dataset.region;
    save();
    renderHome();
  });

  // ---------------------------------------------------------------- trip planning

  function weightedPick(list, prev, counts) {
    const ok = list.filter((x) => x.e !== prev && (counts[x.e.w] || 0) < (x.e.easy ? 1 : 3));
    const total = ok.reduce((sum, x) => sum + x.wt, 0);
    if (!total) return null;
    let r = Math.random() * total;
    for (const x of ok) {
      r -= x.wt;
      if (r <= 0) return x.e;
    }
    return ok[ok.length - 1].e;
  }

  function buildTrip(region) {
    const ri = REGIONS.indexOf(region);
    const sight = region.words.filter((e) => !e.easy);
    const easy = region.words.filter((e) => e.easy);

    const learning = sight.filter((e) => rec(e.w).seen && pts(e.w) < STAGE_AT[1]);
    for (const e of sight) {
      if (learning.length >= LEARNING_SLOTS) break;
      if (!rec(e.w).seen && !learning.includes(e)) learning.push(e);
    }

    const sightPool = [];
    sight.forEach((e) => {
      if (learning.includes(e)) sightPool.push({ e, wt: 5 });
      else if (rec(e.w).seen) sightPool.push({ e, wt: pts(e.w) >= STAGE_AT[2] ? 1 : 2 });
    });
    REGIONS.slice(0, ri).forEach((r) => r.words.forEach((e) => {
      if (!e.easy && isCaught(e.w)) sightPool.push({ e, wt: 0.5 });
    }));
    const easyPool = easy.map((e) => {
      const base = !isCaught(e.w) ? 3 : pts(e.w) >= STAGE_AT[2] ? 1 : 2;
      return { e, wt: rec(e.w).lastTrip === state.trips ? base * 0.25 : base };
    });

    const trip = [];
    const counts = {};
    for (let i = 0; i < TRIP_LEN; i++) {
      const prev = trip[trip.length - 1];
      const wantEasy = i === 0 || Math.random() < EASY_SHARE;
      const e = weightedPick(wantEasy ? easyPool : sightPool, prev, counts) ||
        weightedPick(wantEasy ? sightPool : easyPool, prev, counts);
      if (!e) break;
      trip.push(e);
      counts[e.w] = (counts[e.w] || 0) + 1;
    }

    learning.forEach((e) => {
      if (trip.includes(e)) return;
      const slots = trip.map((x, i) => i).filter((i) => i > 0 && !learning.includes(trip[i]) &&
        trip[i - 1] !== e && trip[i + 1] !== e);
      if (slots.length) trip[slots[Math.floor(Math.random() * slots.length)]] = e;
    });
    return trip;
  }

  // ---------------------------------------------------------------- play

  let trip = null;
  let enc = null;
  let busy = false;

  function startTrip() {
    Sfx.ensure();
    const region = currentRegion();
    trip = { region, queue: buildTrip(region), i: 0, requeues: 0, results: [] };
    state.trips++;
    save();
    $("screen-play").style.setProperty("--sky1", region.sky[0]);
    $("screen-play").style.setProperty("--sky2", region.sky[1]);
    $("screen-play").style.setProperty("--ground", region.ground);
    show("play");
    nextEncounter();
  }

  function renderDots() {
    $("trip-dots").innerHTML = trip.queue.map((e, i) => {
      const r = trip.results[i];
      const icon = r ? (r.escaped ? "\u{1F4A8}" : "\u2B50") : "";
      return `<span class="dot ${i === trip.i ? "now" : ""}">${icon}</span>`;
    }).join("");
  }

  function nextEncounter() {
    if (trip.i >= trip.queue.length) { endTrip(); return; }
    const e = trip.queue[trip.i];
    rec(e.w).seen = true;
    rec(e.w).lastTrip = state.trips;
    save();
    enc = { e, mode: modeFor(e), wrong: 0, selected: null, done: false };
    busy = false;
    renderDots();
    renderEncounter();
  }

  function renderEncounter() {
    const { e, mode } = enc;
    const mon = $("monster");
    mon.className = "monster";
    mon.innerHTML = monsterSVG(e.w, Math.max(1, stageOf(pts(e.w))));
    void mon.offsetWidth;
    mon.classList.add("enter");
    setTimeout(() => { if (enc && enc.e === e && !enc.done) mon.className = "monster idle"; }, 650);

    const sign = $("sign");
    const choices = shuffle([e.w, ...shuffle(e.alts).slice(0, 2)]);
    const opts = $("options");
    const catchBtn = $("btn-catch");

    if (mode === "hear") {
      sign.className = "sign mystery";
      sign.textContent = "?";
      opts.innerHTML = choices.map((w) => `<button class="opt" data-w="${esc(w)}">${esc(w)}</button>`).join("");
      catchBtn.classList.add("hidden");
      $("btn-hear").classList.remove("hidden");
      $("btn-help").classList.add("hidden");
      setTimeout(() => { if (enc && enc.e === e && !enc.done) sayWord(e.w); }, 700);
    } else {
      sign.className = "sign";
      sign.textContent = e.w;
      opts.innerHTML = choices.map((w) => `<button class="opt sound" data-w="${esc(w)}" aria-label="Listen">\u{1F50A}</button>`).join("");
      catchBtn.classList.remove("hidden");
      catchBtn.disabled = true;
      $("btn-hear").classList.add("hidden");
      $("btn-help").classList.remove("hidden");
    }
  }

  $("options").addEventListener("click", (ev) => {
    const btn = ev.target.closest(".opt");
    if (!btn || !enc || enc.done || busy) return;
    const w = btn.dataset.w;
    if (enc.mode === "hear") {
      if (w === enc.e.w) doCatch(btn); else doWrong(btn);
    } else {
      document.querySelectorAll(".opt.sound").forEach((b) => b.classList.toggle("selected", b === btn));
      enc.selected = btn;
      sayWord(w);
      $("btn-catch").disabled = false;
    }
  });

  $("btn-catch").addEventListener("click", () => {
    if (!enc || enc.done || busy || !enc.selected) return;
    const btn = enc.selected;
    if (btn.dataset.w === enc.e.w) doCatch(btn); else doWrong(btn);
  });

  $("btn-hear").addEventListener("click", () => {
    if (enc && !enc.done) sayWord(enc.e.w);
  });

  $("btn-help").addEventListener("click", () => {
    if (!enc || enc.done || busy) return;
    rec(enc.e.w).helps++;
    save();
    escapeAndReturn();
  });

  $("btn-quit").addEventListener("click", () => {
    if (window.speechSynthesis) speechSynthesis.cancel();
    trip = null;
    enc = null;
    $("catch-card").classList.add("hidden");
    show("home");
  });

  async function doWrong(btn) {
    busy = true;
    enc.wrong++;
    btn.classList.add("gone");
    btn.classList.remove("selected");
    enc.selected = null;
    $("btn-catch").disabled = true;
    Sfx.boing();
    const mon = $("monster");
    mon.className = "monster";
    void mon.offsetWidth;
    mon.classList.add("dodge");
    toast(enc.wrong === 1 ? "Whoosh! Try again!" : "Oops!");
    const t = trip;
    await sleep(700);
    if (trip !== t) return;
    mon.className = "monster idle";
    busy = false;
    if (enc.wrong >= 2) { escapeAndReturn(); return; }
    if (enc.mode === "hear") sayWord(enc.e.w);
  }

  async function doCatch(btn) {
    enc.done = true;
    busy = true;
    const t = trip;
    const { e, mode, wrong } = enc;
    const r = rec(e.w);
    const before = stageOf(r.pts);
    const award = AWARD[mode][Math.min(wrong, 1)];
    r.pts += award;
    r.tries++;
    if (wrong === 0) r.firstTry++;
    const after = stageOf(r.pts);
    save();
    trip.results[trip.i] = { e, before, after, award };
    btn.classList.add("right");

    const net = $("net");
    net.className = "net";
    void net.offsetWidth;
    net.classList.add("drop");
    await sleep(500);
    const mon = $("monster");
    mon.className = "monster caught";
    await sleep(500);
    net.className = "net";

    const evolved = after > before && before >= 1;
    const fresh = after >= 1 && before === 0;
    const title = evolved ? (after === 3 ? "MEGA monster!" : "It evolved!") : fresh ? "Caught!" : "Got it!";
    if (evolved) Sfx.evolve(); else Sfx.catch();

    const card = $("catch-card");
    card.innerHTML = `<div class="card ${evolved ? "evolved" : ""}">
      <h3>${title}</h3>
      <div class="mon">${monsterSVG(e.w, Math.max(1, after))}</div>
      ${trickyHTML(e)}</div>`;
    card.classList.remove("hidden");
    setTimeout(() => sayWord(e.w), evolved ? 650 : 420);

    await waitForTapOrTimeout(card, 2800);
    card.classList.add("hidden");
    if (trip !== t) return;
    trip.i++;
    nextEncounter();
  }

  async function escapeAndReturn() {
    enc.done = true;
    busy = true;
    const t = trip;
    const { e } = enc;
    const sign = $("sign");
    sign.className = "sign";
    sign.innerHTML = trickyHTML(e);
    document.querySelectorAll(".opt").forEach((b) => {
      if (b.dataset.w === e.w) b.classList.add("right");
    });
    sayWord(e.w);
    await sleep(1700);
    if (trip !== t) return;

    Sfx.escape();
    const mon = $("monster");
    mon.className = "monster";
    void mon.offsetWidth;
    mon.classList.add("escape");
    trip.results[trip.i] = { e, escaped: true };
    if (trip.requeues < MAX_REQUEUE) {
      trip.queue.splice(trip.i + 3, 0, e);
      trip.requeues++;
      toast("It ran off! It'll be back!");
    } else {
      toast("It ran off!");
    }
    await sleep(1500);
    if (trip !== t) return;
    trip.i++;
    nextEncounter();
  }

  function waitForTapOrTimeout(el, ms) {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        el.removeEventListener("pointerdown", finish);
        resolve();
      };
      setTimeout(() => el.addEventListener("pointerdown", finish), 700);
      setTimeout(finish, ms);
    });
  }

  let toastTimer = null;
  function toast(text) {
    const t = $("toast");
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1300);
  }

  // ---------------------------------------------------------------- end of trip

  function endTrip() {
    const seen = new Map();
    trip.results.forEach((r) => {
      if (!r) return;
      const prev = seen.get(r.e.w);
      if (!prev || (!r.escaped && (prev.escaped || r.after >= prev.after))) {
        seen.set(r.e.w, Object.assign({}, r, { before: prev && !prev.escaped ? Math.min(prev.before, r.before) : r.before }));
      }
    });
    const list = [...seen.values()];
    const caughtCount = list.filter((r) => !r.escaped && r.after >= 1).length;

    $("end-title").textContent = caughtCount
      ? `You caught ${caughtCount} monster${caughtCount === 1 ? "" : "s"}!`
      : "Great exploring!";
    $("end-grid").innerHTML = list.map((r) => {
      const stage = stageOf(pts(r.e.w));
      if (stage === 0) {
        return `<div class="mon-tile unknown"><div class="mon">${monsterSVG(r.e.w, 1, true)}</div><div class="label">?</div></div>`;
      }
      let badge = "";
      if (!r.escaped && r.before === 0 && r.after >= 1) badge = `<span class="badge new">NEW!</span>`;
      else if (!r.escaped && r.after > r.before) badge = `<span class="badge">EVOLVED!</span>`;
      return `<div class="mon-tile" data-w="${esc(r.e.w)}">${badge}<div class="mon">${monsterSVG(r.e.w, stage)}</div>
        <div class="label">${esc(r.e.w)}</div><div class="stars">${"\u2B50".repeat(stage)}</div></div>`;
    }).join("");

    const ri = REGIONS.indexOf(trip.region);
    const nextR = REGIONS[ri + 1];
    let note = "";
    if (nextR && !isUnlocked(ri + 1)) {
      const need = UNLOCK_CAUGHT - caughtIn(trip.region);
      note = `${need} more monster${need === 1 ? "" : "s"} to open ${nextR.emoji} ${nextR.name}!`;
    } else if (nextR && isUnlocked(ri + 1) && caughtIn(trip.region) >= UNLOCK_CAUGHT &&
      list.some((r) => !r.escaped && r.before === 0 && r.after >= 1)) {
      note = `${nextR.emoji} ${nextR.name} is open!`;
    }
    $("end-next").textContent = note;
    trip = null;
    enc = null;
    show("end");
    Sfx.fanfare();
  }

  $("end-grid").addEventListener("click", (ev) => {
    const tile = ev.target.closest(".mon-tile[data-w]");
    if (tile) sayWord(tile.dataset.w);
  });
  $("btn-again").addEventListener("click", startTrip);
  $("btn-end-home").addEventListener("click", () => show("home"));

  // ---------------------------------------------------------------- dex

  function renderDex() {
    $("dex-body").innerHTML = REGIONS.map((r, ri) => {
      const open = isUnlocked(ri);
      const tiles = r.words.map((e) => {
        const stage = stageOf(pts(e.w));
        if (!stage) {
          return `<div class="mon-tile unknown"><div class="mon">${monsterSVG(e.w, 1, true)}</div><div class="label">?</div><div class="stars"></div></div>`;
        }
        return `<button class="mon-tile" data-w="${esc(e.w)}"><div class="mon">${monsterSVG(e.w, stage)}</div>
          <div class="label">${esc(e.w)}</div><div class="stars">${"\u2B50".repeat(stage)}</div></button>`;
      }).join("");
      return `<section class="dex-region ${open ? "" : "locked"}">
        <h3>${r.emoji} ${esc(r.name)} ${open ? `\u2014 ${caughtIn(r)} / ${r.words.length}` : "\u{1F512}"}</h3>
        <div class="mon-grid">${tiles}</div></section>`;
    }).join("");
  }

  $("dex-body").addEventListener("click", (ev) => {
    const tile = ev.target.closest(".mon-tile[data-w]");
    if (!tile) return;
    sayWord(tile.dataset.w);
    tile.classList.remove("wiggle");
    void tile.offsetWidth;
    tile.classList.add("wiggle");
  });
  $("btn-dex").addEventListener("click", () => { Sfx.pop(); show("dex"); });
  $("btn-dex-home").addEventListener("click", () => show("home"));
  $("btn-explore").addEventListener("click", startTrip);

  // ---------------------------------------------------------------- grown-up corner (long-press the title)

  (function setupLongPress() {
    const el = $("title");
    let timer = null;
    const cancel = () => { clearTimeout(timer); timer = null; };
    el.addEventListener("pointerdown", () => { cancel(); timer = setTimeout(openParent, 1500); });
    ["pointerup", "pointerleave", "pointercancel"].forEach((t) => el.addEventListener(t, cancel));
    el.addEventListener("contextmenu", (ev) => ev.preventDefault());
  })();

  function openParent() {
    renderParent();
    $("parent").classList.remove("hidden");
  }
  $("btn-parent-close").addEventListener("click", () => {
    $("parent").classList.add("hidden");
    renderHome();
  });

  function renderParent() {
    const stageName = ["not yet", "caught", "evolved", "mega"];
    const rows = (r) => r.words.map((e) => {
      const x = state.words[e.w];
      const p = pts(e.w);
      const status = !x || !x.seen ? `<span class="muted">not met yet</span>` : stageName[stageOf(p)];
      const mode = e.easy ? "read & pick" : p >= READ_MODE_AT ? "read & pick" : "hear & find";
      const first = x && x.tries ? `${x.firstTry}/${x.tries}` : "-";
      const voice = Clips.has(e.w)
        ? `<button class="clip-btn" data-play="${esc(e.w)}" title="Play">\u25B6\uFE0F</button><button class="clip-btn" data-rec="${esc(e.w)}" title="Re-record">\u{1F399}\uFE0F</button><button class="clip-btn" data-del="${esc(e.w)}" title="Delete recording">\u{1F5D1}\uFE0F</button>`
        : `<button class="clip-btn" data-rec="${esc(e.w)}" title="Record">\u{1F399}\uFE0F</button>`;
      return `<tr><td><b>${esc(e.w)}</b>${e.easy ? ` <span class="muted">(decodable)</span>` : ""}</td>
        <td>${status}</td><td>${p}</td><td>${first}</td><td>${x ? x.helps : 0}</td><td class="muted">${mode}</td><td class="voice">${voice}</td></tr>`;
    }).join("");

    const voices = Speech.voices;
    const current = Speech.pickVoice();
    const voiceOpts = voices.map((v) => `<option value="${esc(v.name)}" ${current && current.name === v.name ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})</option>`).join("");

    const struggling = ALL.filter((e) => {
      const x = state.words[e.w];
      return !e.easy && x && x.tries + x.helps >= 3 && (x.helps >= 2 || x.firstTry / Math.max(1, x.tries) < 0.5);
    }).map((e) => e.w);

    $("parent-body").innerHTML = `
      <p>Expeditions played: <b>${state.trips}</b> &middot; Monsters caught: <b>${totalCaught()}</b> / ${ALL.length}</p>
      <p>Sticky words: ${struggling.length ? `<b>${struggling.map(esc).join(", ")}</b>` : `<span class="muted">none yet</span>`}</p>
      <p class="muted">Sight words start in "hear &amp; find" (he hears it, finds it). At ${READ_MODE_AT} points they switch to
        "read &amp; pick" (he sees it and picks the matching sound), which is the real reading step.
        Caught = ${STAGE_AT[0]} pt, evolved = ${STAGE_AT[1]}, mega = ${STAGE_AT[2]}. Help or 2 misses = 0 pts, and the monster comes back later.</p>

      <h3>Voice</h3>
      <label>Voice: <select id="p-voice"><option value="">Auto</option>${voiceOpts}</select></label>
      <label>Speed: <input id="p-rate" type="range" min="0.5" max="1.2" step="0.05" value="${state.settings.rate}" />
        <span id="p-rate-val">${state.settings.rate}</span></label>
      <div class="row-btns"><button id="p-test">\u{1F50A} Test: "said"</button><button id="p-test-a">\u{1F50A} Test: "a"</button><button id="p-test-the">\u{1F50A} Test: "the"</button></div>
      <p class="muted">If the robot voice says a word wrong (like "a" or "the"), tap \u{1F399}\uFE0F next to that word below and say it
        yourself. Recording stops after 3 seconds or when you tap \u23F9\uFE0F. Your voice is used from then on, on this tablet only.</p>

      <h3>Settings</h3>
      <label><input id="p-unlock" type="checkbox" ${state.settings.unlockAll ? "checked" : ""}/> Open all regions</label>
      <label><input id="p-sfx" type="checkbox" ${state.settings.sfx ? "checked" : ""}/> Sound effects</label>

      ${REGIONS.map((r) => `<h3>${r.emoji} ${esc(r.name)}</h3>
        <table><tr><th>Word</th><th>Status</th><th>Pts</th><th>1st-try</th><th>Helps</th><th>Mode</th><th>My voice</th></tr>${rows(r)}</table>`).join("")}

      <h3>Danger zone</h3>
      <div class="row-btns"><button id="p-reset" class="danger">Reset all progress</button></div>`;

    $("p-voice").addEventListener("change", (ev) => { state.settings.voice = ev.target.value; save(); });
    $("p-rate").addEventListener("input", (ev) => {
      state.settings.rate = Number(ev.target.value);
      $("p-rate-val").textContent = state.settings.rate;
      save();
    });
    $("p-test").addEventListener("click", () => sayWord("said"));
    $("p-test-a").addEventListener("click", () => sayWord("a"));
    $("p-test-the").addEventListener("click", () => sayWord("the"));
    $("parent-body").onclick = (ev) => {
      const b = ev.target.closest(".clip-btn");
      if (!b) return;
      if (b.dataset.play) sayWord(b.dataset.play);
      if (b.dataset.del) Clips.remove(b.dataset.del).then(renderParent);
      if (b.dataset.rec) {
        if (Recorder.active) { Recorder.stop(); return; }
        b.textContent = "\u23F9\uFE0F";
        b.classList.add("recording");
        Recorder.start(b.dataset.rec, renderParent);
      }
    };
    $("p-unlock").addEventListener("change", (ev) => { state.settings.unlockAll = ev.target.checked; save(); });
    $("p-sfx").addEventListener("change", (ev) => { state.settings.sfx = ev.target.checked; save(); });
    $("p-reset").addEventListener("click", () => {
      if (!confirm("Erase all monsters and progress on this device?")) return;
      state = withDefaults({ settings: state.settings });
      save();
      renderParent();
    });
  }

  // ---------------------------------------------------------------- boot

  Speech.init();
  Clips.init();
  show("home");

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  window.WordMonsters = { monsterSVG, state: () => state };
})();
