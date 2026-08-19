(function () {
  var canvas = document.getElementById("comet-sky");
  if (!canvas) return;

  var hero = canvas.closest(".hero");
  if (!hero) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var particles = [];
  var w = 0;
  var h = 0;
  var last = performance.now();
  var head = { x: 0, y: 0, px: 0, py: 0 };
  var helix = {
    angle: Math.random() * Math.PI * 2,
    cx: 0.5,
    cy: 0.28,
    radiusX: 0.2,
    radiusY: 0.1,
    wobble: 0.32,
    speed: 0.0011,
    dir: 1,
    tiltPhase: Math.random() * Math.PI * 2
  };
  var nextShift = 0;
  var starSpin = 0;
  var DESKTOP_MIN = 900;
  /** false = solo ellissi originali (niente scrittura). */
  var WRITE_GINEVRA = true;
  var WRITE_MS = 12500;
  var HOLD_MS = 4200;
  var writeElapsed = 0;
  var holdElapsed = 0;
  var pathEl = null;
  var pathLen = 0;

  /**
   * Corsivo italiano inclinato — un tratto, col punto della i dopo l’asta.
   * ViewBox approssimata 0 0 720 210.
   */
  var GINEVRA_D =
    "M 52,176 " +
    "C 36,170 32,112 58,58 " +
    "C 80,16 152,12 176,62 " +
    "C 192,96 176,150 124,170 " +
    "C 92,182 68,164 82,138 " +
    "C 100,108 154,118 188,168 " +
    "C 198,142 202,78 204,52 " +
    "C 206,78 212,148 226,182 " +
    "M 204,30 C 198,30 196,38 204,40 C 212,42 212,30 204,30 " +
    "M 226,182 " +
    "C 236,128 240,62 242,48 " +
    "C 252,62 258,128 262,182 " +
    "C 270,128 276,58 290,48 " +
    "C 302,58 308,128 312,182 " +
    "C 328,164 318,108 348,96 " +
    "C 380,82 392,124 372,154 " +
    "C 358,176 348,180 364,182 " +
    "C 382,128 394,58 402,46 " +
    "C 422,100 440,176 452,182 " +
    "C 462,128 466,58 470,48 " +
    "C 488,60 500,96 502,108 " +
    "C 498,140 508,176 518,182 " +
    "C 536,166 528,92 564,78 " +
    "C 604,62 624,108 608,152 " +
    "C 596,180 572,190 566,162 " +
    "C 582,180 628,176 678,168";

  function ensurePath() {
    if (pathEl) return;
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    pathEl = document.createElementNS(ns, "path");
    pathEl.setAttribute("d", GINEVRA_D);
    svg.appendChild(pathEl);
    hero.appendChild(svg);
    pathLen = pathEl.getTotalLength();
  }

  function isWriteMode() {
    return WRITE_GINEVRA && w >= DESKTOP_MIN && pathLen > 0;
  }

  function mapPathPoint(pt) {
    var slant = 0.3;
    var x = pt.x + (155 - pt.y) * slant;
    var boxW = 720;
    var boxH = 210;
    var scale = Math.min((w * 0.78) / boxW, (h * 0.34) / boxH);
    var ox = (w - boxW * scale) / 2;
    var oy = h * 0.13;
    return { x: ox + x * scale, y: oy + pt.y * scale };
  }

  function resize() {
    var rect = hero.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ensurePath();
    if (!head.x) {
      head.x = w * helix.cx;
      head.y = h * helix.cy;
      head.px = head.x;
      head.py = head.y;
    }
  }

  function shiftHelix(now) {
    helix.dir = Math.random() < 0.4 ? -helix.dir : helix.dir;
    helix.cx = 0.32 + Math.random() * 0.36;
    helix.cy = 0.18 + Math.random() * 0.16;
    helix.radiusX = 0.14 + Math.random() * 0.14;
    helix.radiusY = 0.06 + Math.random() * 0.08;
    helix.wobble = 0.22 + Math.random() * 0.22;
    helix.speed = 0.00085 + Math.random() * 0.00055;
    helix.tiltPhase = Math.random() * Math.PI * 2;
    nextShift = now + 7000 + Math.random() * 9000;
  }

  function emitDust(x, y, vx, vy, amount, spread, lifeBase) {
    for (var i = 0; i < amount; i++) {
      var a = Math.random() * Math.PI * 2;
      var r = Math.random() * spread;
      particles.push({
        x: x + Math.cos(a) * r,
        y: y + Math.sin(a) * r,
        vx: vx * 0.04 + (Math.random() - 0.5) * 0.3,
        vy: vy * 0.04 + (Math.random() - 0.5) * 0.3,
        life: 0,
        maxLife: lifeBase + Math.random() * 2860,
        size: 0.35 + Math.random() * 1.5,
        gold: Math.random() < 0.5,
        twinkle: Math.random() < 0.04,
        ink: false
      });
    }
  }

  function emitInk(x, y) {
    for (var i = 0; i < 5; i++) {
      var a = Math.random() * Math.PI * 2;
      var r = Math.random() * 3.2;
      particles.push({
        x: x + Math.cos(a) * r,
        y: y + Math.sin(a) * r,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        life: 0,
        maxLife: 9800 + Math.random() * 4200,
        size: 0.7 + Math.random() * 1.6,
        gold: Math.random() < 0.62,
        twinkle: Math.random() < 0.12,
        ink: true
      });
    }
  }

  function drawTwinkle(x, y, size, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = "rgba(255, 245, 210, " + alpha + ")";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.stroke();
    ctx.restore();
  }

  function followHelix(dt, now) {
    if (!nextShift) nextShift = now + 5000;
    if (now >= nextShift) shiftHelix(now);
    helix.angle += helix.speed * helix.dir * dt;
    var t = helix.angle;
    var nx = helix.cx * w + Math.cos(t) * helix.radiusX * w;
    var ny = helix.cy * h
      + Math.sin(t) * helix.radiusY * h
      + Math.sin(t * 2.15 + helix.tiltPhase) * helix.wobble * helix.radiusY * h;
    var topLimit = h * 0.52;
    var sidePad = w * 0.06;
    return {
      x: Math.max(sidePad, Math.min(w - sidePad, nx)),
      y: Math.max(h * 0.08, Math.min(topLimit, ny))
    };
  }

  function followGinevra(dt) {
    if (writeElapsed < WRITE_MS) {
      writeElapsed += dt;
      holdElapsed = 0;
    } else {
      holdElapsed += dt;
      if (holdElapsed >= HOLD_MS) {
        writeElapsed = 0;
        holdElapsed = 0;
      }
    }
    var t = Math.min(1, writeElapsed / WRITE_MS);
    var pt = pathEl.getPointAtLength(t * pathLen);
    return mapPathPoint(pt);
  }

  function update(dt, now) {
    starSpin += dt * 0.0018;
    var pos = isWriteMode() ? followGinevra(dt) : followHelix(dt, now);

    head.px = head.x;
    head.py = head.y;
    head.x = pos.x;
    head.y = pos.y;

    var vx = head.x - head.px;
    var vy = head.y - head.py;
    var jump = Math.hypot(vx, vy) > 28;
    var writing = isWriteMode() && writeElapsed < WRITE_MS && writeElapsed > 0;

    if (writing && !jump) {
      emitInk(head.x, head.y);
      emitDust(head.x, head.y, vx, vy, 1, 7, 5200);
    } else if (!isWriteMode()) {
      emitDust(head.x, head.y, vx, vy, 2, 9, 3640);
      emitDust(head.x, head.y, vx, vy, 1, 16, 4680);
    } else if (!jump) {
      emitDust(head.x, head.y, vx, vy, 1, 6, 2400);
    }

    var drift = isWriteMode() ? 0.012 : 0.048;
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life += dt;
      p.x += p.vx * dt * (p.ink ? 0.008 : drift);
      p.y += p.vy * dt * (p.ink ? 0.008 : drift);
      p.vx *= 0.9988;
      p.vy *= 0.9988;
      if (p.life >= p.maxLife) particles.splice(i, 1);
    }
  }

  function drawSparkleStar(cx, cy, outerR, rotation) {
    var innerR = outerR * 0.32;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (var i = 0; i < 8; i++) {
      var r = i % 2 === 0 ? outerR : innerR;
      var a = (i * Math.PI) / 4 - Math.PI / 2;
      var x = Math.cos(a) * r;
      var y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawNucleus() {
    var pen = isWriteMode();
    var auraR = pen ? 14 : 11;
    var aura = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, auraR);
    aura.addColorStop(0, "rgba(255, 252, 238, 0.95)");
    aura.addColorStop(0.35, "rgba(255, 228, 165, 0.45)");
    aura.addColorStop(0.7, "rgba(201, 160, 90, 0.12)");
    aura.addColorStop(1, "rgba(201, 120, 58, 0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(head.x, head.y, auraR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 252, 1)";
    if (pen) {
      drawSparkleStar(head.x, head.y, 6.4, starSpin);
    } else {
      ctx.beginPath();
      ctx.arc(head.x, head.y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var t = p.life / p.maxLife;
      var alpha = Math.pow(1 - t, p.ink ? 0.85 : 1.2) * (p.ink ? 0.95 : 0.88);
      if (alpha <= 0.02) continue;

      if (p.twinkle && alpha > 0.25) {
        drawTwinkle(p.x, p.y, p.size * 2.2, alpha * 0.85);
      }

      var r = 255;
      var g = p.gold ? 218 : 244;
      var b = p.gold ? 132 : 218;
      ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - t * 0.3), 0, Math.PI * 2);
      ctx.fill();
    }

    drawNucleus();
  }

  function loop(now) {
    var dt = Math.min(40, now - last);
    last = now;
    update(dt, now);
    draw();
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", resize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", resize);
  }
  requestAnimationFrame(loop);
})();
