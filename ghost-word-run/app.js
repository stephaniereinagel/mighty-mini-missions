(() => {
  "use strict";

  const STORE_KEY = "mightyMini.ghostWordRun.v1";
  const MUSIC_STORE_KEY = "mightyMini.ghostWordRun.musicMuted";
  const content = window.GHOST_RUN_CONTENT;
  const category = content.categories[0];
  const candies = window.GHOST_CANDIES;

  const $ = (id) => document.getElementById(id);
  const screens = {
    home: $("homeScreen"),
    game: $("gameScreen"),
    end: $("endScreen")
  };

  const levelSelect = $("levelSelect");
  const gameWorld = $("gameWorld");
  const rows = $("rows");
  const pickupsWrap = $("pickups");
  const player = $("player");
  const promptCard = $("promptCard");
  const targetWord = $("targetWord");
  const candyScore = $("candyScore");
  const feedback = $("feedback");
  const chancesTrack = $("chancesTrack");
  const chanceTokens = [ $("chance1"), $("chance2"), $("chance3") ];
  const homeGhost = $("homeGhost");
  const pauseGhost = $("pauseGhost");
  const miniBucketBody = $("miniBucketBody");
  const bigBucketBack = $("bigBucketBack");
  const bigBucketFront = $("bigBucketFront");
  const musicButton = $("musicButton");

  let state = null;
  let frameId = 0;
  let lastFrame = 0;
  let pointerActive = false;
  let lastClientX = null;  // Crossfade Music Player: Seamlessly loops with a 2-second overlap fade out/in
  class CrossfadeMusicPlayer {
    constructor(src, { targetVolume = 0.28, overlap = 2.0 } = {}) {
      this.src = src;
      this.targetVolume = targetVolume;
      this.overlap = overlap;
      this.muted = false;
      this.playing = false;

      this.deckA = new Audio(src);
      this.deckB = new Audio(src);
      this.deckA.preload = "auto";
      this.deckB.preload = "auto";

      this.activeDeck = this.deckA;
      this.nextDeck = this.deckB;
      this.crossfading = false;

      this.tick = this.tick.bind(this);
      this.deckA.addEventListener("timeupdate", this.tick);
      this.deckB.addEventListener("timeupdate", this.tick);
    }

    start() {
      this.playing = true;
      this.crossfading = false;
      this.nextDeck.pause();
      this.nextDeck.currentTime = 0;
      this.activeDeck.currentTime = 0;
      this.activeDeck.volume = this.muted ? 0 : this.targetVolume;
      this.activeDeck.play().catch(() => {});
    }

    pause() {
      this.playing = false;
      this.deckA.pause();
      this.deckB.pause();
    }

    resume() {
      if (this.muted) return;
      this.playing = true;
      this.activeDeck.play().catch(() => {});
    }

    stop() {
      this.playing = false;
      this.crossfading = false;
      this.deckA.pause();
      this.deckA.currentTime = 0;
      this.deckB.pause();
      this.deckB.currentTime = 0;
    }

    setMuted(muted) {
      this.muted = muted;
      if (muted) {
        this.deckA.volume = 0;
        this.deckB.volume = 0;
      } else {
        this.activeDeck.volume = this.targetVolume;
        if (this.playing && this.activeDeck.paused) {
          this.activeDeck.play().catch(() => {});
        }
      }
    }

    toggleMute() {
      this.setMuted(!this.muted);
      return this.muted;
    }

    tick() {
      if (!this.playing || this.crossfading) return;
      const cur = this.activeDeck;
      if (!cur.duration || isNaN(cur.duration)) return;

      const timeLeft = cur.duration - cur.currentTime;
      // When 2 seconds remain, begin 2-second crossfade loop!
      if (timeLeft <= this.overlap && timeLeft > 0) {
        this.startCrossfade();
      }
    }

    startCrossfade() {
      this.crossfading = true;
      const outgoing = this.activeDeck;
      const incoming = this.nextDeck;

      incoming.currentTime = 0;
      incoming.volume = 0;
      incoming.play().catch(() => {});

      const startTime = performance.now();
      const durationMs = this.overlap * 1000;
      const targetVol = this.muted ? 0 : this.targetVolume;
      const startOutVol = outgoing.volume;

      const step = (now) => {
        if (!this.crossfading) return;
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);

        if (!this.muted) {
          outgoing.volume = Math.max(0, startOutVol * (1 - progress));
          incoming.volume = Math.min(targetVol, targetVol * progress);
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          outgoing.pause();
          outgoing.currentTime = 0;
          outgoing.volume = 0;
          incoming.volume = targetVol;

          // Swap active and next decks
          this.activeDeck = incoming;
          this.nextDeck = outgoing;
          this.crossfading = false;
        }
      };

      requestAnimationFrame(step);
    }
  }

  const music = new CrossfadeMusicPlayer("trick-or-treat-fun.m4a", {
    targetVolume: 0.28,
    overlap: 2.0
  });

  const MUSIC_ON_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
  const MUSIC_OFF_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l4.73 4.73c-.45.31-.96.53-1.52.66l1.52 1.52c1.02-.27 1.94-.74 2.72-1.37L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v4.73l2 2V7z"/></svg>`;

  const savedMuted = localStorage.getItem(MUSIC_STORE_KEY) === "true";
  if (savedMuted) music.setMuted(true);
  updateMusicButtonUI();

  function updateMusicButtonUI() {
    if (!musicButton) return;
    musicButton.innerHTML = music.muted ? MUSIC_OFF_SVG : MUSIC_ON_SVG;
    musicButton.classList.toggle("muted", music.muted);
    musicButton.setAttribute("aria-label", music.muted ? "Unmute background music" : "Mute background music");
  }

  function toggleMusic() {
    const isMuted = music.toggleMute();
    localStorage.setItem(MUSIC_STORE_KEY, String(isMuted));
    updateMusicButtonUI();
  }

  // Initialize visual SVGs for cute ghost and jack-o'-lantern buckets
  if (candies) {
    if (homeGhost) homeGhost.innerHTML = candies.getGhostSVG("normal", 84);
    if (pauseGhost) pauseGhost.innerHTML = candies.getGhostSVG("normal", 78);
    if (player) player.innerHTML = candies.getGhostSVG("normal", 72);
    if (miniBucketBody) miniBucketBody.innerHTML = candies.getPumpkinBucketSVG(48);
    if (bigBucketBack) bigBucketBack.innerHTML = candies.getPumpkinBucketBackSVG(154);
    if (bigBucketFront) bigBucketFront.innerHTML = candies.getPumpkinBucketFrontSVG(154);
  }

  category.levels.forEach((level) => {
    const option = document.createElement("option");
    option.value = level.id;
    option.textContent = `${level.name} - ${level.description}`;
    levelSelect.appendChild(option);
  });

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, screen]) => screen.classList.toggle("hidden", key !== name));
  }

  function selectedLevel() {
    return category.levels.find((level) => level.id === levelSelect.value) || category.levels[0];
  }

  function ensureTargets(minimumAhead = 6) {
    if (!state) return;
    while (state.targets.length < state.nextSpawnIndex + minimumAhead) {
      state.targets.push(...shuffle(state.level.words));
    }
  }

  const soundAlikeGroups = content.soundAlikeGroups || [];
  function soundsAlike(a, b) {
    return soundAlikeGroups.some((group) => group.includes(a) && group.includes(b));
  }

  function choicesFor(target, count, level) {
    const picked = [target];
    for (const word of shuffle(level.words)) {
      if (picked.length >= count) break;
      if (picked.some((existing) => existing === word || soundsAlike(existing, word))) continue;
      picked.push(word);
    }
    return shuffle(picked);
  }

  function updateChancesHUD(restoredIndex = -1) {
    if (!state) return;
    const chancesLeft = Math.max(0, Math.min(3, state.chances));
    chancesTrack.setAttribute("aria-label", `${chancesLeft} chances left`);
    chanceTokens.forEach((token, index) => {
      if (!token) return;
      const isActive = index < chancesLeft;
      token.classList.toggle("active", isActive);
      token.classList.toggle("lost", !isActive);
      token.classList.toggle("warning", chancesLeft === 1 && index === 0);
      if (index === restoredIndex) {
        token.classList.remove("restored");
        void token.offsetWidth;
        token.classList.add("restored");
      }
    });
  }

  function startGame() {
    const level = selectedLevel();
    state = {
      level,
      targets: shuffle(level.words),
      round: 0,
      candy: 0,
      displayedCandy: 0,
      streak: 0,
      chances: 3,
      maxChances: 3,
      totalMisses: 0,
      playerX: 0.5,
      rows: [],
      pickups: [],
      nextSpawnIndex: 0,
      lastPickupSpawnRound: -2,
      startTime: performance.now(),
      paused: false,
      running: true,
      finishAt: 0
    };

    ensureTargets(8);

    rows.replaceChildren();
    if (pickupsWrap) pickupsWrap.replaceChildren();
    player.style.left = "calc(50% - 36px)";
    player.style.setProperty("--ghost-tilt", "0deg");
    player.classList.remove("correct", "missed");
    if (candies) player.innerHTML = candies.getGhostSVG("normal", 72);

    candyScore.textContent = "0";
    $("bucketCandies").replaceChildren();
    updateChancesHUD();

    $("dragHint").style.display = "";
    $("pauseOverlay").classList.add("hidden");
    showScreen("game");

    music.start();

    spawnRow(0);
    state.rows[0].y = 95;
    state.rows[0].element.style.transform = "translateY(95px)";
    announceTarget(state.rows[0].target);
    state.rows[0].announced = true;

    lastFrame = performance.now();
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(tick);
  }

  function spawnRow(roundIndex) {
    ensureTargets(6);
    const target = state.targets[roundIndex];

    // Gradually ramp choice count based on round number if level allows
    const range = state.level.maxChoices - state.level.minChoices;
    const choiceCount = state.level.minChoices + Math.min(range, Math.floor(roundIndex / 6));
    const choices = choicesFor(target, choiceCount, state.level);

    const row = document.createElement("div");
    row.className = "word-row";
    row.style.gridTemplateColumns = `repeat(${choiceCount}, minmax(0, 1fr))`;

    choices.forEach((word, choiceIdx) => {
      const gate = document.createElement("div");
      gate.className = "word-gate";
      gate.dataset.word = word;
      const candyIdx = (roundIndex * 3 + choiceIdx) % (candies ? candies.list.length : 7);
      gate.dataset.candyIdx = String(candyIdx);

      const candySvg = candies ? candies.getCandySVG(candyIdx, 44) : "";
      gate.innerHTML = `
        <div class="gate-candy-wrap">${candySvg}</div>
        <span class="gate-word">${word}</span>
      `;
      row.appendChild(gate);
    });

    rows.appendChild(row);
    state.rows.push({
      element: row,
      choices,
      target,
      y: 0,
      roundIndex,
      resolved: false,
      announced: false
    });
    state.nextSpawnIndex = roundIndex + 1;

    // Periodically spawn a small chance restore pickup between word rows:
    // If the player has missed chances (< 3), offer a lifeline every 2-3 rows.
    // If at full chances, offer a heart candy bonus every 4-5 rows.
    if (roundIndex >= 1) {
      const needsLifeline = state.chances < state.maxChances;
      const roundsSincePickup = roundIndex - state.lastPickupSpawnRound;
      const shouldSpawnPickup = (needsLifeline && roundsSincePickup >= 2) || (roundsSincePickup >= 4);

      if (shouldSpawnPickup) {
        state.lastPickupSpawnRound = roundIndex;
        // Position pickup between previous row and this row
        const prevRow = state.rows[state.rows.length - 2];
        const prevY = prevRow ? prevRow.y : 95;
        const pickupY = (prevY + 0) / 2;
        const laneNorms = [0.2, 0.5, 0.8];
        const xNorm = laneNorms[Math.floor(Math.random() * laneNorms.length)];
        spawnChancePickup(pickupY, xNorm);
      }
    }
  }

  function spawnChancePickup(y, xNorm) {
    if (!pickupsWrap) return;
    const pickup = document.createElement("div");
    pickup.className = "trail-pickup";
    pickup.style.left = `${xNorm * 100}%`;
    pickup.style.transform = `translate(-50%, ${y}px)`;
    pickup.innerHTML = `
      <span class="pickup-glow"></span>
      <img class="pickup-img" src="assets/candy_heart_restore.png" width="48" height="42" alt="Restore Chance Heart" draggable="false" />
    `;
    pickupsWrap.appendChild(pickup);
    state.pickups.push({
      element: pickup,
      y,
      xNorm,
      resolved: false
    });
  }

  function collectPickup(pickup) {
    makeSparkBurst(pickup.element);
    playRestoreChime();

    if (state.chances < state.maxChances) {
      const restoredIndex = state.chances;
      state.chances = Math.min(state.maxChances, state.chances + 1);
      updateChancesHUD(restoredIndex);
      showFeedback("+1 Chance Restored! ??");
    } else {
      state.candy += 1;
      state.displayedCandy += 1;
      candyScore.textContent = String(state.displayedCandy);
      showFeedback("Heart Bonus! +1 Candy! ??");
    }
  }

  function announceTarget(target) {
    targetWord.textContent = target;
    promptCard.setAttribute("aria-label", `Fly through the word ${target}`);
    speak(target);
  }

  // A thrown error must never kill the animation loop, or the trail silently empties
  function tick(now) {
    try {
      step(now);
    } catch (error) {
      console.error("Ghost Word Run frame error:", error);
      if (state?.running) frameId = requestAnimationFrame(tick);
    }
  }

  function step(now) {
    if (!state?.running) return;
    if (state.paused) {
      lastFrame = now;
      frameId = requestAnimationFrame(tick);
      return;
    }

    const elapsed = Math.min((now - lastFrame) / 1000, 0.04);
    lastFrame = now;
    const worldHeight = gameWorld.clientHeight;
    const playerCenterY = worldHeight - worldHeight * 0.13 - 42;

    // Tetris-like continual speed ramp: starts comfortable (145 px/s) and gradually
    // but continually accelerates as you survive more words and time, becoming blistering fast!
    const elapsedSeconds = (now - state.startTime) / 1000;
    const speed = 145 + state.round * 9 + elapsedSeconds * 1.3;

    state.rows.forEach((row) => {
      row.y += speed * elapsed;
      row.element.style.transform = `translateY(${row.y}px)`;
      const rowCenterY = -112 + row.y + 42;

      if (!row.announced && row.roundIndex === state.round && row.y >= 95) {
        announceTarget(row.target);
        row.announced = true;
      }

      if (rowCenterY >= playerCenterY && !row.resolved) {
        resolveRound(row);
      }
    });

    // Move pickups along with the trail speed and test collisions with Boo
    state.pickups.forEach((pickup) => {
      pickup.y += speed * elapsed;
      pickup.element.style.transform = `translate(-50%, ${pickup.y}px)`;

      if (!pickup.resolved && Math.abs(pickup.y - playerCenterY) <= 38) {
        if (Math.abs(pickup.xNorm - state.playerX) <= 0.22) {
          pickup.resolved = true;
          collectPickup(pickup);
        }
      }
    });

    // Clean up passed or resolved pickups
    state.pickups = state.pickups.filter((pickup) => {
      if (pickup.resolved || pickup.y > worldHeight + 80) {
        pickup.element.remove();
        return false;
      }
      return true;
    });

    // Spawn new rows continuously as long as run is active
    if (!state.finishAt) {
      const newestRow = state.rows[state.rows.length - 1];
      // Adaptive row spacing gives human reaction time even as speed ramps continually
      const reactionTime = Math.max(1.35, 2.35 - Math.min(state.round, 30) * 0.025);
      // Spacing must stay below the visible trail height or rows get cleaned up before the next spawns
      const rowSpacing = Math.min(worldHeight * 0.9, Math.max(worldHeight * 0.6, speed * reactionTime));
      if (!newestRow || newestRow.y >= rowSpacing) {
        spawnRow(state.nextSpawnIndex);
      }
    }

    // Clean up passed rows
    state.rows = state.rows.filter((row) => {
      if (-112 + row.y > worldHeight + 110) {
        row.element.remove();
        return false;
      }
      return true;
    });

    // Finish when run ends (0 chances remaining)
    if (state.finishAt && now >= state.finishAt) {
      finishGame();
      return;
    }

    frameId = requestAnimationFrame(tick);
  }

  function resolveRound(row) {
    row.resolved = true;
    const selectedIndex = Math.min(row.choices.length - 1, Math.floor(state.playerX * row.choices.length));
    const selectedWord = row.choices[selectedIndex];
    const correct = selectedWord === row.target;
    const selectedGate = row.element.children[selectedIndex];
    const candyIdx = Number(selectedGate?.dataset.candyIdx || 0);

    [...row.element.children].forEach((gate) => {
      gate.classList.add(gate.dataset.word === row.target ? "correct-gate" : "wrong-gate");
    });

    player.classList.remove("correct", "missed");
    void player.offsetWidth;

    if (correct) {
      state.streak += 1;
      const earned = (state.streak > 0 && state.streak % 3 === 0) ? 2 : 1;
      state.candy += earned;

      player.innerHTML = candies ? candies.getGhostSVG("happy", 72) : "";
      player.classList.add("correct");

      launchCandy(selectedGate, earned, candyIdx);
      makeSparkBurst(selectedGate);
      showFeedback(earned === 2 ? "Sweet streak! +2 candies!" : "Sweet! +1 candy!");
      playTone(true);

      window.setTimeout(() => {
        if (state?.running) player.innerHTML = candies ? candies.getGhostSVG("normal", 72) : "";
      }, 550);
    } else {
      // Missed gate: dock 1 chance (from 3 total)
      state.chances -= 1;
      state.totalMisses += 1;
      state.streak = 0;

      player.innerHTML = candies ? candies.getGhostSVG("wobble", 72) : "";
      player.classList.add("missed");
      playTone(false);
      updateChancesHUD();

      if (state.chances > 0) {
        showFeedback(state.chances === 1 ? `Watch out! 1 chance left! (${row.target})` : `Oops! 2 chances left! (${row.target})`);
        // Re-queue the missed word 2-3 rows ahead for practice
        ensureTargets(6);
        const retryAt = Math.max(state.nextSpawnIndex, row.roundIndex + 2);
        state.targets[retryAt] = row.target;
      } else {
        // 0 chances remaining! End the run
        showFeedback("Out of chances! Great flying!");
        state.finishAt = performance.now() + 1050;
      }

      window.setTimeout(() => {
        if (state?.running && !state.finishAt) {
          player.innerHTML = candies ? candies.getGhostSVG("normal", 72) : "";
        }
      }, 550);
    }

    state.round += 1;
    window.setTimeout(() => player.classList.remove("correct", "missed"), 480);

    if (!state.finishAt) {
      const nextRow = state.rows.find((candidate) => !candidate.resolved && candidate.roundIndex === state.round);
      if (nextRow && nextRow.y >= 95 && !nextRow.announced) {
        announceTarget(nextRow.target);
        nextRow.announced = true;
      }
    }
  }

  function launchCandy(gate, amount, baseCandyIdx = 0) {
    if (!gate) return;
    const start = gate.getBoundingClientRect();
    const bucket = $("miniBucket");
    const destination = bucket.getBoundingClientRect();

    for (let i = 0; i < amount; i++) {
      window.setTimeout(() => {
        if (!state?.running) return;
        const currentCandyIdx = (baseCandyIdx + i) % (candies ? candies.list.length : 7);
        const candy = document.createElement("div");
        candy.className = "flying-candy";
        candy.innerHTML = candies ? candies.getCandySVG(currentCandyIdx, 42) : "";
        candy.style.left = `${start.left + start.width / 2 - 21}px`;
        candy.style.top = `${start.top + start.height / 2 - 21}px`;
        document.body.appendChild(candy);

        const dx = destination.left + destination.width / 2 - (start.left + start.width / 2);
        const dy = destination.top + destination.height / 2 - (start.top + start.height / 2);
        const flight = candy.animate([
          { transform: "translate(0, 0) rotate(0) scale(.65)", opacity: 0 },
          { transform: "translate(0, -48px) rotate(140deg) scale(1.3)", opacity: 1, offset: .22 },
          { transform: `translate(${dx * .55}px, ${dy * .42 - 65}px) rotate(320deg) scale(1.05)`, opacity: 1, offset: .62 },
          { transform: `translate(${dx}px, ${dy}px) rotate(540deg) scale(.45)`, opacity: 1 }
        ], { duration: 640, easing: "cubic-bezier(.2,.75,.25,1)", fill: "forwards" });

        flight.finished.then(() => {
          candy.remove();
          state.displayedCandy += 1;
          candyScore.textContent = String(state.displayedCandy);
          addCandyToBucket(currentCandyIdx);
          bucket.classList.remove("bucket-pop");
          void bucket.offsetWidth;
          bucket.classList.add("bucket-pop");
        }).catch(() => candy.remove());
      }, i * 130);
    }
  }

  function addCandyToBucket(candyIdx = 0) {
    const fill = $("bucketCandies");
    const piece = document.createElement("span");
    piece.className = "bucket-candy";
    const positions = [
      { x: 3, r: -22, size: 21 },
      { x: 13, r: 4, size: 22 },
      { x: 23, r: 24, size: 20 },
      { x: 8, r: -12, size: 22 },
      { x: 18, r: 15, size: 21 },
      { x: -1, r: -30, size: 19 },
      { x: 27, r: 20, size: 21 }
    ];
    const pos = positions[(state.displayedCandy - 1) % positions.length];
    piece.style.setProperty("--candy-x", `${pos.x}px`);
    piece.style.setProperty("--candy-r", `${pos.r}deg`);
    piece.innerHTML = candies ? candies.getCandySVG(candyIdx, pos.size) : "";
    fill.appendChild(piece);
    while (fill.children.length > 7) fill.firstElementChild.remove();
  }

  function makeSparkBurst(gate) {
    if (!gate) return;
    const rect = gate.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      const spark = document.createElement("span");
      const angle = (Math.PI * 2 * i) / 10;
      spark.className = "candy-spark";
      spark.style.left = `${rect.left + rect.width / 2}px`;
      spark.style.top = `${rect.top + rect.height / 2}px`;
      spark.style.setProperty("--spark-x", `${Math.cos(angle) * (48 + (i % 3) * 12)}px`);
      spark.style.setProperty("--spark-y", `${Math.sin(angle) * (42 + (i % 2) * 14)}px`);
      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 650);
    }
  }

  function showFeedback(message) {
    feedback.textContent = message;
    feedback.classList.remove("show");
    void feedback.offsetWidth;
    feedback.classList.add("show");
  }

  function setPlayerFromClientX(clientX) {
    if (!state?.running || state.paused) return;
    const rect = gameWorld.getBoundingClientRect();
    const edge = 38;
    const x = Math.max(edge, Math.min(rect.width - edge, clientX - rect.left));
    const prevX = state.playerX;
    state.playerX = x / rect.width;
    player.style.left = `${x - 36}px`;

    if (lastClientX !== null) {
      const delta = clientX - lastClientX;
      if (delta < -3) player.style.setProperty("--ghost-tilt", "-8deg");
      else if (delta > 3) player.style.setProperty("--ghost-tilt", "8deg");
      else player.style.setProperty("--ghost-tilt", "0deg");
    }
    lastClientX = clientX;
    $("dragHint").style.display = "none";
  }

  gameWorld.addEventListener("pointerdown", (event) => {
    pointerActive = true;
    lastClientX = event.clientX;
    gameWorld.setPointerCapture?.(event.pointerId);
    setPlayerFromClientX(event.clientX);
  });
  gameWorld.addEventListener("pointermove", (event) => {
    if (pointerActive) setPlayerFromClientX(event.clientX);
  });
  gameWorld.addEventListener("pointerup", () => {
    pointerActive = false;
    lastClientX = null;
    player.style.setProperty("--ghost-tilt", "0deg");
  });
  gameWorld.addEventListener("pointercancel", () => {
    pointerActive = false;
    lastClientX = null;
    player.style.setProperty("--ghost-tilt", "0deg");
  });

  window.addEventListener("keydown", (event) => {
    if (!state?.running || state.paused) return;
    const step = 0.12;
    if (event.key === "ArrowLeft") {
      state.playerX = Math.max(0.06, state.playerX - step);
      player.style.setProperty("--ghost-tilt", "-8deg");
      window.setTimeout(() => player.style.setProperty("--ghost-tilt", "0deg"), 200);
    } else if (event.key === "ArrowRight") {
      state.playerX = Math.min(0.94, state.playerX + step);
      player.style.setProperty("--ghost-tilt", "8deg");
      window.setTimeout(() => player.style.setProperty("--ghost-tilt", "0deg"), 200);
    } else return;
    player.style.left = `calc(${state.playerX * 100}% - 36px)`;
    $("dragHint").style.display = "none";
  });

  // Chrome's speech engine can wedge after many rapid cancel/speak cycles; resuming and
  // speaking on the next tick keeps it alive, and holding the utterance prevents early GC.
  // Some voices misread very short words on their own ("capital I", a clipped "nnn" for "an").
  const SPOKEN_AS = { I: "eye", an: "ann" };

  let currentUtterance = null;
  let speakTimer = 0;
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    speechSynthesis.resume();
    clearTimeout(speakTimer);
    speakTimer = window.setTimeout(() => {
      currentUtterance = new SpeechSynthesisUtterance(SPOKEN_AS[text] || text);
      currentUtterance.rate = 0.72;
      currentUtterance.pitch = 1.08;
      speechSynthesis.speak(currentUtterance);
    }, 60);
  }

  // Browsers cap how many AudioContexts a page may hold, so every effect shares one
  let sharedAudioContext = null;
  function getAudioContext() {
    if (!sharedAudioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      sharedAudioContext = new AudioContext();
    }
    if (sharedAudioContext.state === "suspended") sharedAudioContext.resume().catch(() => {});
    return sharedAudioContext;
  }

  function playTone(success) {
    try {
      const context = getAudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = success ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(success ? 540 : 230, context.currentTime);
      if (success) oscillator.frequency.linearRampToValueAtTime(760, context.currentTime + 0.13);
      gain.gain.setValueAtTime(0.08, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.22);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.23);
    } catch (_) { /* Sound is optional. */ }
  }

  function playRestoreChime() {
    try {
      const context = getAudioContext();
      [587, 740, 880].forEach((freq, idx) => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, context.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.09, context.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + idx * 0.07 + 0.28);
        osc.connect(gain).connect(context.destination);
        osc.start(context.currentTime + idx * 0.07);
        osc.stop(context.currentTime + idx * 0.07 + 0.3);
      });
    } catch (_) { /* Sound is optional. */ }
  }

  function finishGame() {
    state.running = false;
    cancelAnimationFrame(frameId);
    const saved = loadSaved();
    const prevBest = saved.bestByLevel[state.level.id] || 0;
    const isNewRecord = state.candy > prevBest;
    saved.totalCandy += state.candy;
    saved.bestByLevel[state.level.id] = Math.max(prevBest, state.candy);
    localStorage.setItem(STORE_KEY, JSON.stringify(saved));

    $("endCandy").textContent = String(state.candy);

    const endBestLine = $("endBestLine");
    if (endBestLine) {
      if (isNewRecord && state.candy > 0) {
        endBestLine.textContent = `? New Record! Beat previous best of ${prevBest}!`;
      } else {
        endBestLine.textContent = `Trail Record: ${saved.bestByLevel[state.level.id]} candies`;
      }
    }

    if (state.candy >= 20) {
      $("endMessage").textContent = "Legendary flying! Boo's pumpkin is overflowing with sweet treats!";
    } else if (state.candy >= 10) {
      $("endMessage").textContent = "Incredible run! Boo collected a massive stash of candy!";
    } else if (state.candy >= 5) {
      $("endMessage").textContent = "Great flying! You spotted lots of tricky words on the path!";
    } else {
      $("endMessage").textContent = "Good try! Every flight makes those words easier to spot!";
    }

    populateBigBucket();
    makeCandyRain();
    showScreen("end");
  }

  function populateBigBucket() {
    if (bigBucketBack && candies) {
      bigBucketBack.innerHTML = candies.getPumpkinBucketOverflowSVG(220);
    }
    const wrap = $("bigBucketCandies");
    if (wrap) wrap.replaceChildren();
    if (bigBucketFront) bigBucketFront.replaceChildren();
  }

  function loadSaved() {
    try {
      return Object.assign({ totalCandy: 0, bestByLevel: {} }, JSON.parse(localStorage.getItem(STORE_KEY)) || {});
    } catch (_) {
      return { totalCandy: 0, bestByLevel: {} };
    }
  }

  function makeCandyRain() {
    const holder = $("celebrationCandy");
    holder.replaceChildren();
    for (let i = 0; i < 20; i++) {
      const candy = document.createElement("span");
      candy.className = "candy-rain-piece";
      candy.style.left = `${Math.random() * 92}%`;
      candy.style.animationDelay = `${Math.random() * 2.5}s`;
      candy.style.animationDuration = `${2.3 + Math.random() * 1.6}s`;
      const size = 32 + Math.floor(Math.random() * 14);
      candy.innerHTML = candies ? candies.getRandomCandySVG(size) : "";
      holder.appendChild(candy);
    }
  }

  function leaveGame() {
    if (state) state.running = false;
    cancelAnimationFrame(frameId);
    clearTimeout(speakTimer);
    window.speechSynthesis?.cancel();
    music.stop();
    rows.replaceChildren();
    if (pickupsWrap) pickupsWrap.replaceChildren();
    $("pauseOverlay").classList.add("hidden");
    showScreen("home");
  }

  function togglePause(paused) {
    if (!state?.running) return;
    state.paused = paused;
    $("pauseOverlay").classList.toggle("hidden", !paused);
    if (paused) {
      clearTimeout(speakTimer);
      window.speechSynthesis?.cancel();
      music.pause();
    } else {
      music.resume();
      const nextRow = state.rows.find((row) => !row.resolved);
      if (nextRow) speak(nextRow.target);
    }
  }

  $("startButton").addEventListener("click", startGame);
  $("againButton").addEventListener("click", startGame);
  $("chooseButton").addEventListener("click", () => showScreen("home"));
  $("quitButton").addEventListener("click", leaveGame);
  $("pauseQuitButton").addEventListener("click", leaveGame);
  $("pauseButton").addEventListener("click", () => togglePause(true));
  $("resumeButton").addEventListener("click", () => togglePause(false));
  if (musicButton) musicButton.addEventListener("click", toggleMusic);
  $("hearButton").addEventListener("click", () => {
    const nextRow = state?.rows.find((row) => !row.resolved);
    if (nextRow) speak(nextRow.target);
  });

  const helpModal = $("helpModal");
  $("howButton").addEventListener("click", () => helpModal.classList.remove("hidden"));
  $("closeHelpButton").addEventListener("click", () => helpModal.classList.add("hidden"));
  $("helpDoneButton").addEventListener("click", () => helpModal.classList.add("hidden"));

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
