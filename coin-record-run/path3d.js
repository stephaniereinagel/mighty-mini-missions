// 3D layer for the run: coins and obstacles come down the painted path toward the runner.
// World units: x across the path, z along it (FAR is the horizon end, 0 is the runner), y up.
(function () {
  const FAR = 30;
  const CAM_D = 6;
  const Y_REF = 0.5;
  const FOV = 40;
  // Where the path meets the horizon in scene_run.jpg (fractions of the image), and the
  // vertical background-position the .world box uses for that image.
  const VANISH = { x: 0.585, y: 0.467, bgY: 0.6 };

  window.CRR_Path3D = function (host) {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.className = "path3d";
    host.insertBefore(canvas, host.firstChild);

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const sun = new THREE.DirectionalLight(0xffffff, 0.6);
    sun.position.set(-3, 6, 5);
    scene.add(sun);
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);

    const loader = new THREE.TextureLoader();
    const textures = {};
    const tex = (src) => {
      if (!textures[src]) {
        const t = loader.load(src);
        t.encoding = THREE.sRGBEncoding;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
        textures[src] = t;
      }
      return textures[src];
    };

    const circleGeo = new THREE.CircleGeometry(1, 48);
    const rimGeo = new THREE.CylinderGeometry(1, 1, 1, 48, 1, true).rotateX(Math.PI / 2);
    const planeGeo = new THREE.PlaneGeometry(1, 1);
    const shadowGeo = new THREE.CircleGeometry(1, 24).rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false });
    const rimMats = {
      copper: new THREE.MeshLambertMaterial({ color: 0xb06a3c }),
      silver: new THREE.MeshLambertMaterial({ color: 0xc4cad3 })
    };
    const faceMats = {};
    const faceMat = (src, ghost) => {
      const key = src + (ghost ? "|ghost" : "");
      if (!faceMats[key]) {
        faceMats[key] = new THREE.MeshBasicMaterial(ghost
          ? { map: tex(src), color: 0x888888, transparent: true, opacity: 0.4, side: THREE.DoubleSide }
          : { map: tex(src), transparent: true, side: THREE.DoubleSide });
      }
      return faceMats[key];
    };
    const labelMats = {};
    const labelMat = (text) => {
      if (!labelMats[text]) {
        const c = document.createElement("canvas");
        c.width = 160; c.height = 64;
        const g = c.getContext("2d");
        g.fillStyle = "#fff8e7";
        g.strokeStyle = "#c9a227";
        g.lineWidth = 6;
        g.beginPath();
        g.roundRect(4, 4, 152, 56, 28);
        g.fill();
        g.stroke();
        g.fillStyle = "#3a2400";
        g.font = "700 44px Fredoka, sans-serif";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(text, 80, 35);
        const t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        labelMats[text] = new THREE.SpriteMaterial({ map: t });
      }
      return labelMats[text];
    };

    const view = { W: 1, H: 1, ppu: 100, slope: 0 };
    const live = new Set();
    const v3 = new THREE.Vector3();

    function toScreen(x, y, z) {
      v3.set(x, y, z).project(camera);
      return { x: ((v3.x + 1) / 2) * view.W, y: ((1 - v3.y) / 2) * view.H };
    }

    // Aim the camera so the horizon sits on the painted vanishing point and z=0 lands on the runner.
    function resize(W, H, runnerY) {
      view.W = W; view.H = H;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      const T = Math.tan((FOV * Math.PI) / 360);
      const D = Math.max(W, H);
      const hx = (W - D) * 0.5 + VANISH.x * D;
      const hy = (H - D) * VANISH.bgY + VANISH.y * D;
      const theta = Math.atan((1 - (2 * hy) / H) * T);
      const alpha = theta - Math.atan((1 - (2 * runnerY) / H) * T);
      camera.position.set(0, Y_REF + CAM_D * Math.tan(alpha), CAM_D);
      camera.rotation.set(-theta, 0, 0);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      view.ppu = toScreen(1, Y_REF, 0).x - toScreen(0, Y_REF, 0).x;
      // Lanes lean so they all meet at the vanishing point, not the screen center.
      view.slope = ((2 * hx) / W - 1) * Math.cos(theta) * T * camera.aspect;
    }

    function track(h) {
      h.age = 0;
      h.fx = null;
      h.shadow = new THREE.Mesh(shadowGeo, shadowMat);
      scene.add(h.obj, h.shadow);
      live.add(h);
      return h;
    }

    function coin(src, rPx, copper, label) {
      const r = rPx / view.ppu;
      const t = r * 0.14;
      const obj = new THREE.Group();
      const front = new THREE.Mesh(circleGeo, faceMat(src));
      front.position.z = t / 2;
      const back = new THREE.Mesh(circleGeo, faceMat(src));
      back.rotation.y = Math.PI;
      back.position.z = -t / 2;
      const rim = new THREE.Mesh(rimGeo, copper ? rimMats.copper : rimMats.silver);
      rim.scale.set(1, 1, t / r);
      const disc = new THREE.Group();
      disc.add(front, back, rim);
      disc.scale.setScalar(r);
      obj.add(disc);
      if (label) {
        const s = new THREE.Sprite(labelMat(label));
        const lh = Math.max(32 / view.ppu, r * 0.8);
        s.scale.set(lh * 2.5, lh, 1);
        s.position.y = -r - lh * 0.35;
        obj.add(s);
      }
      return track({ obj, r, src, faces: [front, back] });
    }

    function bill(src, wPx, hPx) {
      const w = wPx / view.ppu;
      const m = new THREE.Mesh(planeGeo, faceMat(src));
      m.scale.set(w, hPx / view.ppu, 1);
      const obj = new THREE.Group();
      obj.add(m);
      return track({ obj, r: w * 0.4, src, faces: [m] });
    }

    function sprite(src, hPx) {
      const mat = new THREE.SpriteMaterial({ map: tex(src), transparent: true });
      const s = new THREE.Sprite(mat);
      const h = hPx / view.ppu;
      s.center.set(0.5, 0);
      s.scale.set(h, h, 1);
      const obj = new THREE.Group();
      obj.add(s);
      return track({ obj, r: h * 0.45, sprite: s, ground: true });
    }

    // Put a thing at path position (x, z); coins hop along at about runner height.
    function place(h, x, z, t, phase) {
      const px = x - view.slope * z;
      let y = 0;
      if (!h.ground) {
        y = Y_REF + Math.abs(Math.sin(t * 5 + phase)) * h.r * 0.7;
        h.obj.rotation.y = Math.sin(t * 2.4 + phase) * 0.55;
        h.obj.rotation.z = h.sprite ? 0 : Math.sin(t * 1.7 + phase) * 0.12;
      }
      h.obj.position.set(px, y, z);
      h.shadow.position.set(px, 0.01, z);
      h.shadow.scale.set(h.r, 1, h.r * 0.45);
    }

    function remove(h) {
      if (!live.has(h)) return;
      scene.remove(h.obj, h.shadow);
      if (h.sprite) h.sprite.material.dispose();
      live.delete(h);
    }

    // Short effects: grab (coin caught), fling (shield knocks it away), burn, ghost (missed while dizzy).
    function fx(h, type, opts = {}) {
      if (type === "ghost") {
        h.faces.forEach((f) => { f.material = faceMat(h.src, true); });
        return;
      }
      if (type === "burn") {
        h.sprite.material.map = tex(opts.src);
        h.sprite.center.set(0.5, 0.3);
      }
      h.fx = { type, t: 0, dir: opts.dir || 1, base: h.obj.scale.x };
    }

    function update(dt) {
      for (const h of [...live]) {
        h.age += dt;
        if (!h.fx) {
          h.obj.scale.setScalar(Math.min(1, h.age * 4));
          continue;
        }
        const f = h.fx;
        f.t += dt;
        if (f.type === "grab") {
          const k = f.t / 0.25;
          h.obj.scale.setScalar(1 + k * 0.6);
          h.obj.position.y += dt * 3;
          h.shadow.visible = false;
          if (k >= 1) remove(h);
        } else if (f.type === "fling") {
          h.obj.position.x += f.dir * dt * 9;
          h.obj.position.y += dt * 6;
          h.obj.rotation.z += f.dir * dt * 12;
          h.shadow.visible = false;
          if (f.t >= 0.4) remove(h);
        } else if (f.type === "burn") {
          const k = f.t / 0.5;
          h.obj.scale.setScalar(1 + k * 0.6);
          h.sprite.material.opacity = 1 - k;
          if (k >= 1) remove(h);
        }
      }
    }

    function clear() {
      [...live].forEach(remove);
      renderer.render(scene, camera);
    }

    return {
      FAR, resize, coin, bill, sprite, place, remove, fx, update, clear, toScreen,
      render: () => renderer.render(scene, camera),
      ppu: () => view.ppu
    };
  };
})();
