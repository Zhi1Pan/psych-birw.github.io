/* 生日页物理烟花 —— 仅生日页加载，问卷页完全不受影响 */
(function () {
  var canvas = document.getElementById("fwSky");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var W = 0, H = 0, DPR = 1;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* 烟花配色：尾随主色、末端偏白 */
  var PALETTES = [
    [[255, 224, 130], [255, 246, 200], [255, 200, 80], [255, 255, 255]],
    [[255, 130, 190], [255, 180, 215], [255, 255, 255]],
    [[130, 190, 255], [185, 222, 255], [255, 255, 255]],
    [[190, 160, 255], [225, 210, 255], [255, 255, 255]],
    [[120, 255, 190], [210, 255, 230], [255, 255, 255]]
  ];

  var rockets = []; /* 升空中的弹 */
  var parts = [];   /* 爆炸后的粒子 */
  var nextLaunch = 0;

  function explode(x, y, count, big) {
    if (parts.length > 1100) return;
    var pal = PALETTES[(Math.random() * PALETTES.length) | 0];
    var power = big ? rnd(4.4, 7.2) : rnd(2.0, 3.4);
    for (var i = 0; i < count; i++) {
      var a = rnd(0, Math.PI * 2);
      var sp = Math.pow(Math.random(), 0.55) * power;
      var col = pal[(Math.random() * pal.length) | 0];
      parts.push({
        x: x,
        y: y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0,
        max: big ? rnd(85, 165) : rnd(55, 100),
        col: col,
        big: big,
        fade: rnd(0.983, 0.992)
      });
    }
  }

  function launch(x, apexTop, apexBottom) {
    rockets.push({
      x: x,
      y: H + 8,
      vx: rnd(-0.2, 0.2),
      vy: 0,
      apexY: rnd(H * apexTop, H * apexBottom),
      trail: []
    });
  }

  function step() {
    var photos = location.hash === "#photos";

    /* 节奏：开场密且猛（控制总粒子量保证流畅）；照片文字页略多但仍克制、只在高处 */
    var interval = photos ? 1300 : 520;
    if (performance.now() > nextLaunch) {
      nextLaunch = performance.now() + interval * rnd(0.6, 1.5);
      var bx = rnd(W * 0.05, W * 0.95);
      launch(bx, photos ? 0.05 : 0.06, photos ? 0.24 : 0.42);
      /* 追加第二发：开场约 1/3，照片页约 1/5 */
      if (Math.random() < (photos ? 0.2 : 0.33)) {
        (function (xx) {
          setTimeout(function () { launch(xx + rnd(-60, 60), photos ? 0.05 : 0.06, photos ? 0.24 : 0.42); }, 170);
        })(bx);
      }
    }

    /* 弹体上升 */
    for (var i = rockets.length - 1; i >= 0; i--) {
      var rk = rockets[i];
      rk.vy += -0.05;
      if (rk.vy < -3.7) rk.vy = -3.7;
      rk.vx += Math.sin(rk.y * 0.02) * 0.02;
      rk.x += rk.vx;
      rk.y += rk.vy;
      rk.trail.push({ x: rk.x, y: rk.y });
      if (rk.trail.length > 9) rk.trail.shift();

      if (rk.y <= rk.apexY) {
        var big = !photos;
        explode(rk.x, rk.y, photos ? Math.round(rnd(48, 78)) : Math.round(rnd(80, 130)), big);
        if (big && Math.random() < 0.45) {
          (function (xx, yy) {
            setTimeout(function () { explode(xx, yy, 28, false); }, rnd(150, 480));
          })(rk.x, rk.y);
        }
        rockets.splice(i, 1);
      }
    }

    /* 粒子受重力下落 */
    for (i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.life++;
      p.vx *= p.fade;
      p.vy = p.vy * p.fade + 0.02;
      p.x += p.vx;
      p.y += p.vy;
      if (p.life >= p.max || p.y > H + 20) parts.splice(i, 1);
    }

    render(photos);
    requestAnimationFrame(step);
  }

  function render(photos) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    var gAlpha = photos ? 0.62 : 1;

    /* 升空光迹 */
    for (var i = 0; i < rockets.length; i++) {
      var rk = rockets[i];
      var tr = rk.trail;
      for (var j = 0; j < tr.length; j++) {
        var q = tr[j];
        var head = (j === tr.length - 1);
        ctx.beginPath();
        ctx.arc(q.x, q.y, head ? 1.8 : 1.1, 0, 7);
        ctx.fillStyle = "rgba(255,246,210," + ((j / tr.length) * 0.85 * (head ? 1 : 1) * gAlpha) + ")";
        ctx.fill();
      }
    }

    /* 粒子：彩尾 + 白芯 + 结尾规律闪烁（确定性算法，去掉逐粒子随机，保证流畅） */
    for (i = 0; i < parts.length; i++) {
      var p = parts[i];
      var a = 1 - p.life / p.max;
      var c = p.col;
      var alpha = a * gAlpha;

      ctx.strokeStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (alpha * 0.85) + ")";
      ctx.lineWidth = p.big ? 2.6 : 1.5;
      ctx.beginPath();
      ctx.moveTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      /* 亮芯：确定性绘制，减少开销 */
      ctx.fillStyle = "rgba(255,255,255," + (alpha * 0.5) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.big ? 1.2 : 0.9, 0, 7);
      ctx.fill();

      /* 寿命末端规律闪烁，替代随机 */
      if (p.life > p.max * 0.85 && (p.life & 3) === 0) {
        ctx.fillStyle = "rgba(255,255,255," + (alpha * 0.7) + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, 7);
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }

  /* 开场齐射：五发同升 + 两朵中心大花，第一秒即绚烂 */
  setTimeout(function () {
    launch(W * 0.16, 0.06, 0.42);
    launch(W * 0.32, 0.06, 0.42);
    launch(W * 0.5, 0.06, 0.42);
    launch(W * 0.68, 0.06, 0.42);
    launch(W * 0.84, 0.06, 0.42);
    explode(W * 0.34, H * 0.24, 110, true);
    explode(W * 0.66, H * 0.2, 110, true);
  }, 180);

  requestAnimationFrame(step);
})();

/* 表情包加载器
   - cake/cat/rabbit：从 /assets/stickers/ 优先加载透明 PNG（依次尝试 png/gif/webp）
   - dog：按指定文件直接加载 dog2.jpg（原图，不需抠图）
   全部失败时保留页面里的 emoji 作为兜底。 */
(function () {
  var items = {
    cake: { file: null },
    dog: { file: "dog2.jpg" },
    cat: { file: null },
    rabbit: { file: null }
  };
  var exts = ["png", "gif", "webp"];

  /* 资源目录：取当前页面所在目录的上一级（资源位于站点根 assets/），
     兼容部署在任意子路径的情况 */
  var _p = (location.pathname || "/");
  if (_p.length > 1 && _p.charAt(_p.length - 1) === "/") _p = _p.slice(0, -1);
  var BASE = _p.substring(0, _p.lastIndexOf("/") + 1);

  function load() {
    Object.keys(items).forEach(function (k) {
      var el = document.querySelector(".scene ." + k);
      if (!el) return;
      var done = false;
      var cands = items[k].file ? [items[k].file] : exts.map(function (e) { return k + "." + e; });
      cands.forEach(function (fname) {
        var im = new Image();
        im.onload = function () {
          if (done) return;
          done = true;
          el.innerHTML = "";
          el.appendChild(im);
        };
        im.src = BASE + "assets/stickers/" + fname;
      });
    });
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
