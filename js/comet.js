(function () {
  var canvas = document.getElementById("comet-sky");
  if (!canvas) return;

  var hero = canvas.closest(".hero");
  if (!hero) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var particles = [];
  var pathPoints = [];
  var w = 0;
  var h = 0;
  var last = performance.now();
  var head = { x: 0, y: 0, px: 0, py: 0 };
  var pathT = 0;
  var pathSpeed = 0.0001;
  var wobblePhase = Math.random() * Math.PI * 2;

  function buildGinevraPath() {
    var oc = document.createElement("canvas");
    var octx = oc.getContext("2d");
    var fontSize = Math.min(w * 0.26, h * 0.19, 108);
    var font = "italic " + fontSize + 'px Georgia, "Times New Roman", serif';
    octx.font = font;
    var text = "Ginevra";
    var tw = octx.measureText(text).width;
    oc.width = Math.ceil(tw + fontSize * 0.8);
    oc.height = Math.ceil(fontSize * 1.55);
    octx.font = font;
    octx.fillStyle = "#fff";
    octx.textBaseline = "middle";
    octx.fillText(text, fontSize * 0.3, oc.height / 2);
    var data = octx.getImageData(0, 0, oc.width, oc.height).data;
    var raw = [];
    var step = 2;
    for (var x = 0; x < oc.width; x += step) {
      var ys = [];
      for (var y = 0; y < oc.height; y++) {
        if (data[(y * oc.width + x) * 4 + 3] > 90) ys.push(y);
      }
      if (ys.length) {
        raw.push({ x: x, y: ys[Math.floor(ys.length / 2)] });
      }
    }
    if (raw.length < 10) return [];

    var scale = Math.min(1, (w * 0.78) / oc.width);
    var ox = w * 0.5 - (oc.width * scale) * 0.5;
    var oy = h * 0.2;
    return raw.map(function (p) {
      return { x: ox + p.x * scale, y: oy + p.y * scale };
    });
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
    pathPoints = buildGinevraPath();
    if (pathPoints.length && !head.x) {
      head.x = pathPoints[0].x;
      head.y = pathPoints[0].y;
      head.px = head.x;
      head.py = head.y;
    }
  }

  function samplePath(t) {
    if (!pathPoints.length) return { x: w * 0.5, y: h * 0.25 };
    var idx = t * (pathPoints.length - 1);
    var i = Math.floor(idx);
    var f = idx - i;
    var a = pathPoints[i];
    var b = pathPoints[Math.min(i + 1, pathPoints.length - 1)];
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
  }

  function emitDust(x, y, vx, vy, amount, spread, lifeBase) {
    for (var i = 0; i < amount; i++) {
      var a = Math.random() * Math.PI * 2;
      var r = Math.random() * spread;
      particles.push({
        x: x + Math.cos(a) * r,
        y: y + Math.sin(a) * r,
        vx: vx * 0.03 + (Math.random() - 0.5) * 0.22,
        vy: vy * 0.03 + (Math.random() - 0.5) * 0.22,
        life: 0,
        maxLife: lifeBase + Math.random() * 4400,
        size: 0.4 + Math.random() * 1.8,
        gold: Math.random() < 0.55,
        twinkle: Math.random() < 0.07
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

  function update(dt) {
    if (!pathPoints.length) return;

    pathT += pathSpeed * dt;
    if (pathT >= 1) pathT -= 1;

    wobblePhase += dt * 0.0016;
    var pos = samplePath(pathT);
    var wobble = Math.sin(wobblePhase) * 2.2;

    head.px = head.x;
    head.py = head.y;
    head.x = pos.x + wobble * 0.35;
    head.y = pos.y + Math.cos(wobblePhase * 1.3) * 1.6;

    var vx = head.x - head.px;
    var vy = head.y - head.py;

    emitDust(head.x, head.y, vx, vy, 5, 10, 5600);
    emitDust(head.x, head.y, vx, vy, 3, 20, 7200);

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life += dt;
      p.x += p.vx * dt * 0.04;
      p.y += p.vy * dt * 0.04;
      p.vx *= 0.999;
      p.vy *= 0.999;
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
      var alpha = Math.pow(1 - t, 0.75) * 0.92;
      if (alpha <= 0.015) continue;

      if (p.twinkle && alpha > 0.2) {
        drawTwinkle(p.x, p.y, p.size * 2.2, alpha * 0.85);
      }

      var r = 255;
      var g = p.gold ? 218 : 244;
      var b = p.gold ? 132 : 218;
      ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - t * 0.22), 0, Math.PI * 2);
      ctx.fill();
    }

    drawNucleus();
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
  window.addEventListener("orientationchange", resize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", resize);
  }
  requestAnimationFrame(loop);
})();
