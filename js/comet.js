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
  var pathBox = { w: 720, h: 210 };
  var glyphDots = [];
  var scriptReady = false;

  /** Come a casa: script matematico 𝒢𝒾𝓃𝑒𝓋𝓇𝒶 (𝑒 in corsivo italico). */
  var GINEVRA_SCRIPT = "𝒢𝒾𝓃𝑒𝓋𝓇𝒶";
  var SCRIPT_FONT = '160px "Cambria Math", "STIX Two Math", "STIX", "Segoe UI Symbol", serif';
  var FALLBACK_FONT = 'italic 160px "Segoe Script", "French Script MT", "Apple Chancery", cursive';

  function sampleText(text, fontSpec) {
    var probe = document.createElement("canvas").getContext("2d");
    probe.font = fontSpec;
    var width = probe.measureText(text).width;
    if (!width || width < 40) return null;

    var pad = 28;
    var tw = Math.ceil(width) + pad * 2;
    var th = 220;
    var c = document.createElement("canvas");
    c.width = tw;
    c.height = th;
    var g = c.getContext("2d");
    g.font = fontSpec;
    g.fillStyle = "#fff";
    g.textBaseline = "alphabetic";
    var baseline = 150;
    g.fillText(text, pad, baseline);
    var data = g.getImageData(0, 0, tw, th).data;

    function ink(x, y) {
      if (x < 0 || y < 0 || x >= tw || y >= th) return false;
      return data[(y * tw + x) * 4 + 3] > 48;
    }

    var step = 2;
    var visited = new Uint8Array(tw * th);
    var blobs = [];

    function flood(sx, sy) {
      var stack = [[sx, sy]];
      var minX = sx, maxX = sx, minY = sy, maxY = sy;
      visited[sy * tw + sx] = 1;
      while (stack.length) {
        var p = stack.pop();
        var x = p[0];
        var y = p[1];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        var nbs = [[x + step, y], [x - step, y], [x, y + step], [x, y - step]];
        for (var i = 0; i < 4; i++) {
          var nx = nbs[i][0];
          var ny = nbs[i][1];
          if (nx < 0 || ny < 0 || nx >= tw || ny >= th) continue;
          var idx = ny * tw + nx;
          if (visited[idx] || !ink(nx, ny)) continue;
          visited[idx] = 1;
          stack.push([nx, ny]);
        }
      }
      return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
    }

    for (var y = 0; y < th; y += step) {
      for (var x = 0; x < tw; x += step) {
        if (!visited[y * tw + x] && ink(x, y)) blobs.push(flood(x, y));
      }
    }

    blobs = blobs.filter(function (b) {
      return (b.maxX - b.minX) * (b.maxY - b.minY) > 18;
    });
    if (!blobs.length) return null;

    var letters = [];
    var dots = [];
    blobs.forEach(function (b) {
      var bw = b.maxX - b.minX;
      var bh = b.maxY - b.minY;
      if (bw < 30 && bh < 30 && b.minY < baseline - 48) dots.push(b);
      else letters.push(b);
    });
    letters.sort(function (a, b) { return a.minX - b.minX; });

    function centerline(blob) {
      var pts = [];
      var prevY = (blob.minY + blob.maxY) / 2;
      for (var x = blob.minX; x <= blob.maxX; x += 2) {
        var ys = [];
        for (var y = blob.minY; y <= blob.maxY; y += 2) {
          if (ink(x, y)) ys.push(y);
        }
        if (!ys.length) continue;
        var best = ys[0];
        var bestD = Math.abs(ys[0] - prevY);
        for (var i = 1; i < ys.length; i++) {
          var d = Math.abs(ys[i] - prevY);
          if (d < bestD) {
            bestD = d;
            best = ys[i];
          }
        }
        pts.push({ x: x, y: best });
        prevY = best;
      }
      return smooth(pts);
    }

    function circle(blob) {
      var cx = (blob.minX + blob.maxX) / 2;
      var cy = (blob.minY + blob.maxY) / 2;
      var r = Math.max(3.2, Math.min(blob.maxX - blob.minX, blob.maxY - blob.minY) / 2);
      var pts = [];
      for (var a = 0; a <= 10; a++) {
        var ang = (a / 10) * Math.PI * 2 - Math.PI / 2;
        pts.push({ x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r });
      }
      return pts;
    }

    function smooth(pts) {
      if (pts.length < 3) return pts;
      var out = [pts[0]];
      for (var i = 1; i < pts.length - 1; i++) {
        out.push({
          x: (pts[i - 1].x + pts[i].x + pts[i + 1].x) / 3,
          y: (pts[i - 1].y + pts[i].y + pts[i + 1].y) / 3
        });
      }
      out.push(pts[pts.length - 1]);
      return out;
    }

    var parts = [];
    letters.forEach(function (letter) {
      var line = centerline(letter);
      if (line.length >= 2) parts.push(line);
      dots.forEach(function (dot) {
        if (dot.used) return;
        if (dot.minX >= letter.minX - 8 && dot.minX <= letter.maxX + 12) {
          parts.push(circle(dot));
          dot.used = true;
        }
      });
    });
    dots.forEach(function (dot) {
      if (!dot.used) parts.push(circle(dot));
    });
    if (!parts.length) return null;
    if (letters.length >= 6) {
      var widths = letters.map(function (b) { return b.maxX - b.minX; });
      var minW = Math.min.apply(null, widths);
      var maxW = Math.max.apply(null, widths);
      if (maxW - minW < 14) return null;
    }

    var dotsOut = [];
    var minX = Infinity;
    var minY = Infinity;
    var maxX = 0;
    var maxY = 0;
    for (var gy = 0; gy < th; gy += 3) {
      for (var gx = 0; gx < tw; gx += 3) {
        if (!ink(gx, gy)) continue;
        dotsOut.push({ x: gx, y: gy, lit: false });
        if (gx < minX) minX = gx;
        if (gy < minY) minY = gy;
        if (gx > maxX) maxX = gx;
        if (gy > maxY) maxY = gy;
      }
    }
    if (dotsOut.length < 80) return null;

    var d = "";
    parts.forEach(function (pts) {
      d += "M" + pts[0].x.toFixed(2) + "," + pts[0].y.toFixed(2);
      for (var i = 1; i < pts.length; i++) {
        d += " L" + pts[i].x.toFixed(2) + "," + pts[i].y.toFixed(2);
      }
    });

    return {
      d: d,
      box: { w: Math.max(120, maxX - minX + 24), h: Math.max(80, maxY - minY + 24), ox: minX - 12, oy: minY - 12 },
      dots: dotsOut
    };
  }

  function buildScript() {
    var sampled = sampleText(GINEVRA_SCRIPT, SCRIPT_FONT);
    if (!sampled) sampled = sampleText("Ginevra", FALLBACK_FONT);
    if (!sampled) return false;
    pathBox = sampled.box;
    glyphDots = sampled.dots;
    if (!pathEl) {
      var ns = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(ns, "svg");
      svg.setAttribute("aria-hidden", "true");
      svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
      pathEl = document.createElementNS(ns, "path");
      svg.appendChild(pathEl);
      hero.appendChild(svg);
    }
    pathEl.setAttribute("d", sampled.d);
    pathLen = pathEl.getTotalLength();
    scriptReady = pathLen > 40;
    return scriptReady;
  }

  function isWriteMode() {
    return WRITE_GINEVRA && w >= DESKTOP_MIN && scriptReady && pathLen > 0;
  }

  function mapPathPoint(pt) {
    var scale = Math.min((w * 0.82) / pathBox.w, (h * 0.38) / pathBox.h);
    var ox = (w - pathBox.w * scale) / 2;
    var oy = h * 0.11;
    return {
      x: ox + (pt.x - (pathBox.ox || 0)) * scale,
      y: oy + (pt.y - (pathBox.oy || 0)) * scale
    };
  }

  function resetGlyphs() {
    for (var i = 0; i < glyphDots.length; i++) glyphDots[i].lit = false;
    particles = particles.filter(function (p) { return !p.ink; });
  }

  function lightGlyphs(leadX) {
    var n = 0;
    for (var i = 0; i < glyphDots.length; i++) {
      var d = glyphDots[i];
      if (d.lit) continue;
      var m = mapPathPoint(d);
      if (m.x <= leadX + 12) {
        d.lit = true;
        emitInk(m.x, m.y);
        n++;
        if (n > 28) break;
      }
    }
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
    var count = glyphDots.length ? 2 : 5;
    for (var i = 0; i < count; i++) {
      var a = Math.random() * Math.PI * 2;
      var r = Math.random() * 2.4;
      particles.push({
        x: x + Math.cos(a) * r,
        y: y + Math.sin(a) * r,
        vx: (Math.random() - 0.5) * 0.03,
        vy: (Math.random() - 0.5) * 0.03,
        life: 0,
        maxLife: 9800 + Math.random() * 4200,
        size: 0.65 + Math.random() * 1.45,
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
        resetGlyphs();
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

    if (writing) {
      lightGlyphs(head.x);
      if (!jump) emitDust(head.x, head.y, vx, vy, 1, 7, 5200);
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

  function start() {
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", resize);
    }
    requestAnimationFrame(loop);
  }

  function loadFontsThenStart() {
    var loads = [];
    if (document.fonts && document.fonts.load) {
      loads.push(document.fonts.load(SCRIPT_FONT, GINEVRA_SCRIPT));
      loads.push(document.fonts.load(FALLBACK_FONT, "Ginevra"));
    }
    Promise.all(loads).then(function () {
      buildScript();
      start();
    }).catch(function () {
      buildScript();
      start();
    });
  }

  loadFontsThenStart();
})();
