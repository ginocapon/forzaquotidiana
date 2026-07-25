(function () {
  var canvas = document.getElementById("comet-sky");
  if (!canvas) return;

  var main = document.getElementById("contenuto");
  if (!main || !main.classList.contains("home-main")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var trail = [];
  var TRAIL_MS = 4500;
  var head = { x: 0, y: 0, vx: 0, vy: 0 };
  var target = { x: 0, y: 0 };
  var slitherPhase = Math.random() * Math.PI * 2;
  var wanderPhase = Math.random() * Math.PI * 2;
  var w = 0;
  var h = 0;
  var last = performance.now();

  function resize() {
    var rect = main.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!head.x) {
      head.x = w * (0.2 + Math.random() * 0.6);
      head.y = h * (0.15 + Math.random() * 0.35);
      pickTarget();
    }
  }

  function pickTarget() {
    var pad = Math.min(120, w * 0.08, h * 0.08);
    target.x = pad + Math.random() * (w - pad * 2);
    target.y = pad + Math.random() * (h - pad * 2);
  }

  function update(dt) {
    var dx = target.x - head.x;
    var dy = target.y - head.y;
    var dist = Math.hypot(dx, dy) || 1;

    if (dist < 70 + Math.random() * 40) {
      pickTarget();
      dx = target.x - head.x;
      dy = target.y - head.y;
      dist = Math.hypot(dx, dy) || 1;
    }

    var nx = dx / dist;
    var ny = dy / dist;
    var baseSpeed = 0.055 + Math.random() * 0.018;

    slitherPhase += dt * 0.0022;
    wanderPhase += dt * 0.0011;
    var slither = Math.sin(slitherPhase) * 2.4 + Math.sin(slitherPhase * 2.3) * 0.9;
    var wander = Math.cos(wanderPhase * 1.7) * 1.6;

    var steerX = nx * baseSpeed + (-ny * slither + nx * wander) * 0.012;
    var steerY = ny * baseSpeed + (nx * slither + ny * wander) * 0.012;

    head.vx += (steerX - head.vx) * 0.04;
    head.vy += (steerY - head.vy) * 0.04;

    head.x += head.vx * dt;
    head.y += head.vy * dt;

    var margin = 56;
    if (head.x < margin || head.x > w - margin) {
      head.vx *= -0.6;
      head.x = Math.max(margin, Math.min(w - margin, head.x));
      pickTarget();
    }
    if (head.y < margin || head.y > h - margin) {
      head.vy *= -0.6;
      head.y = Math.max(margin, Math.min(h - margin, head.y));
      pickTarget();
    }

    var now = performance.now();
    trail.push({ x: head.x, y: head.y, t: now });
    while (trail.length && now - trail[0].t > TRAIL_MS) {
      trail.shift();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    if (trail.length < 2) return;

    var now = performance.now();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (var i = 1; i < trail.length; i++) {
      var a = trail[i - 1];
      var b = trail[i];
      var age = (now - b.t) / TRAIL_MS;
      var alpha = Math.pow(1 - age, 1.6) * 0.82;
      var width = 3 + (1 - age) * 18;

      var grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, "rgba(255, 210, 140, " + (alpha * 0.25) + ")");
      grad.addColorStop(0.5, "rgba(255, 228, 170, " + (alpha * 0.55) + ")");
      grad.addColorStop(1, "rgba(255, 245, 210, " + alpha + ")");
      ctx.strokeStyle = grad;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    var glowR = 52;
    var glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, glowR);
    glow.addColorStop(0, "rgba(255, 252, 235, 0.98)");
    glow.addColorStop(0.12, "rgba(255, 228, 165, 0.62)");
    glow.addColorStop(0.38, "rgba(201, 160, 90, 0.22)");
    glow.addColorStop(1, "rgba(201, 120, 58, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(head.x, head.y, glowR, 0, Math.PI * 2);
    ctx.fill();

    var halo = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14);
    halo.addColorStop(0, "rgba(255, 255, 250, 1)");
    halo.addColorStop(0.45, "rgba(255, 235, 190, 0.85)");
    halo.addColorStop(1, "rgba(255, 210, 140, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(head.x, head.y, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 252, 1)";
    ctx.beginPath();
    ctx.arc(head.x, head.y, 5.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function loop(now) {
    var dt = Math.min(40, now - last);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(loop);
})();
