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

  function resize() {
    var rect = hero.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
        twinkle: Math.random() < 0.04
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

  function update(dt, now) {
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
    nx = Math.max(sidePad, Math.min(w - sidePad, nx));
    ny = Math.max(h * 0.08, Math.min(topLimit, ny));

    head.px = head.x;
    head.py = head.y;
    head.x = nx;
    head.y = ny;

    var vx = head.x - head.px;
    var vy = head.y - head.py;

    emitDust(head.x, head.y, vx, vy, 2, 9, 3640);
    emitDust(head.x, head.y, vx, vy, 1, 16, 4680);

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life += dt;
      p.x += p.vx * dt * 0.048;
      p.y += p.vy * dt * 0.048;
      p.vx *= 0.9988;
      p.vy *= 0.9988;
      if (p.life >= p.maxLife) particles.splice(i, 1);
    }
  }

  function drawNucleus() {
    var coreR = 2.6;
    var auraR = 11;
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
    ctx.beginPath();
    ctx.arc(head.x, head.y, coreR, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var t = p.life / p.maxLife;
      var alpha = Math.pow(1 - t, 1.2) * 0.88;
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
