// Web components: <code-window>, <demo-coords>, <demo-collision>, <demo-fsm>, <demo-sprite>

const ICON_COPY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const ICON_DOWNLOAD_SM = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`;

/* ============ <code-window> ============ */
class CodeWindow extends HTMLElement {
  connectedCallback() {
    const rawCode = this.getAttribute("code") || this.textContent || "";
    const code = rawCode.replace(/^\n/, "").replace(/\n$/, "");
    const filename = this.getAttribute("filename") || "";
    const variant = this.getAttribute("variant") || "code";
    const step = this.getAttribute("step") || "";

    const isTerminal = variant === "terminal";
    const html = isTerminal ? window.highlightShell(code) : window.highlightPython(code);

    const headerLeft = isTerminal
      ? `<div class="code-window__dots"><span></span><span></span><span></span></div><div class="code-window__label">Terminal</div>`
      : `<div class="code-window__dots"><span></span><span></span><span></span></div>${filename ? `<div class="code-window__filename">${window.escapeHtml(filename)}</div>` : ""}`;

    let actions = `
      <button class="code-window__action" data-action="copy" title="Copiar código">
        ${ICON_COPY}
        <span class="copied-tip">¡Copiado!</span>
      </button>
    `;

    if (step) {
      actions += `
        <a class="code-window__action" href="code/${window.escapeHtml(step)}" download="main.py" title="Descargar main.py completo">
          ${ICON_DOWNLOAD_SM}
        </a>
      `;
    }

    this.innerHTML = `
      <div class="code-window ${isTerminal ? "code-window--terminal" : ""}">
        <div class="code-window__header">
          <div class="code-window__header-left">${headerLeft}</div>
          <div class="code-window__header-right">${actions}</div>
        </div>
        <pre><code>${html}</code></pre>
      </div>
    `;

    const copyBtn = this.querySelector('[data-action="copy"]');
    copyBtn.addEventListener("click", () => {
      navigator.clipboard?.writeText(rawCode).then(() => {
        const tip = copyBtn.querySelector(".copied-tip");
        tip.classList.add("show");
        setTimeout(() => tip.classList.remove("show"), 1200);
      });
    });
  }
}
customElements.define("code-window", CodeWindow);

/* ============ Helpers ============ */
function setupDemoFocus(el) {
  el.tabIndex = 0;
  el.addEventListener("focus", () => el.classList.add("has-focus"));
  el.addEventListener("blur", () => el.classList.remove("has-focus"));
  el.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.stopPropagation();
    }
  });
}

/* ============ <demo-coords> ============ */
class DemoCoords extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="demo">
        <div class="demo__hint">Haz clic para interactuar — mueve el mouse o usa las flechas</div>
        <canvas width="640" height="480" style="width:100%;max-width:480px;aspect-ratio:4/3;"></canvas>
        <div class="demo__readout demo__readout--lg">x = <strong id="x">376</strong>, y = <strong id="y">300</strong></div>
      </div>
    `;
    this.canvas = this.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.x = 376 / 800 * this.canvas.width;
    this.y = 300 / 600 * this.canvas.height;
    setupDemoFocus(this.canvas.parentElement);

    this.canvas.parentElement.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      // limitar las coordenadas al rect de la pantalla
      this.x = Math.max(0, Math.min(this.canvas.width, (e.clientX - rect.left) * scaleX));
      this.y = Math.max(0, Math.min(this.canvas.height, (e.clientY - rect.top) * scaleY));
      this.draw();
    });

    this.canvas.parentElement.addEventListener("keydown", (e) => {
      const step = 10;
      if (e.key === "ArrowLeft") this.x -= step;
      if (e.key === "ArrowRight") this.x += step;
      if (e.key === "ArrowUp") this.y -= step;
      if (e.key === "ArrowDown") this.y += step;
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));
      this.draw();
    });

    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;
    ctx.fillStyle = "#dcfce7"; // light green
    ctx.fillRect(0, 0, w, h);

    // grid
    ctx.strokeStyle = "#bbf7d0";
    ctx.lineWidth = 1;
    const step = 40;
    for (let gx = 0; gx <= w; gx += step) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
    }
    for (let gy = 0; gy <= h; gy += step) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }

    // axes labels
    ctx.fillStyle = "#15803d";
    ctx.font = "bold 20px monospace";
    ctx.fillText("(0, 0)", 8, 26);
    ctx.fillText("x →", w - 70, 26);
    ctx.fillText("y ↓", 8, h - 12);

    // sprite de Link (player.png); fallback: cuadrado verde mientras carga.
    // El punto (x, y) es la esquina SUPERIOR IZQUIERDA del sprite (como en
    // screen.blit), así que puede sobresalir por los bordes derecho e inferior.
    const size = 48 * (w / 800);
    const px = this.x;
    const py = this.y;
    if (!this.sprite) {
      this.sprite = new Image();
      this.sprite.src = "img/player.png";
      this.sprite.onload = () => this.draw();
    }
    if (this.sprite.complete && this.sprite.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.sprite, px, py, size, size);
    } else {
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(px, py, size, size);
    }

    // crosshair to mouse position
    ctx.strokeStyle = "#4f46e5";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(this.x, 0); ctx.lineTo(this.x, h);
    ctx.moveTo(0, this.y); ctx.lineTo(w, this.y);
    ctx.stroke();
    ctx.setLineDash([]);

    const realX = Math.round(this.x / w * 800);
    const realY = Math.round(this.y / h * 600);
    this.querySelector("#x").textContent = realX;
    this.querySelector("#y").textContent = realY;
  }
}
customElements.define("demo-coords", DemoCoords);

/* ============ <demo-collision> ============ */
class DemoCollision extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="demo">
        <div class="demo__hint">Haz clic para interactuar — usa las flechas para mover el rectángulo verde</div>
        <canvas width="640" height="480" style="width:100%;max-width:480px;aspect-ratio:4/3;"></canvas>
        <div class="demo__readout">colliderect() == <strong id="result">False</strong></div>
      </div>
    `;
    this.canvas = this.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.caveRect = { x: 200 / 800 * this.canvas.width, y: 54 / 600 * this.canvas.height, w: 50 / 800 * this.canvas.width, h: 55 / 600 * this.canvas.height };
    this.player = { x: 376 / 800 * this.canvas.width, y: 400 / 600 * this.canvas.height, w: 48 / 800 * this.canvas.width, h: 48 / 600 * this.canvas.height };

    setupDemoFocus(this.canvas.parentElement);
    this.canvas.parentElement.addEventListener("keydown", (e) => {
      const step = 10;
      if (e.key === "ArrowLeft") this.player.x -= step;
      if (e.key === "ArrowRight") this.player.x += step;
      if (e.key === "ArrowUp") this.player.y -= step;
      if (e.key === "ArrowDown") this.player.y += step;
      this.draw();
    });

    let dragging = false;
    this.canvas.parentElement.addEventListener("mousedown", () => { dragging = true; });
    window.addEventListener("mouseup", () => { dragging = false; });
    this.canvas.parentElement.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.player.x = (e.clientX - rect.left) * scaleX - this.player.w / 2;
      this.player.y = (e.clientY - rect.top) * scaleY - this.player.h / 2;
      this.draw();
    });

    this.draw();
  }

  collides(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);

    // cave rect (red)
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.caveRect.x, this.caveRect.y, this.caveRect.w, this.caveRect.h);
    ctx.fillStyle = "rgba(239,68,68,0.15)";
    ctx.fillRect(this.caveRect.x, this.caveRect.y, this.caveRect.w, this.caveRect.h);

    const hit = this.collides(this.player, this.caveRect);

    // player rect (green)
    ctx.strokeStyle = hit ? "#ef4444" : "#22c55e";
    ctx.fillStyle = hit ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)";
    ctx.lineWidth = 3;
    ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);
    ctx.strokeRect(this.player.x, this.player.y, this.player.w, this.player.h);

    const resultEl = this.querySelector("#result");
    resultEl.textContent = hit ? "True" : "False";
    resultEl.className = hit ? "true" : "false";
  }
}
customElements.define("demo-collision", DemoCollision);

/* ============ <demo-fsm> ============ */
class DemoFsm extends HTMLElement {
  connectedCallback() {
    this.state = "menu";
    this.innerHTML = `
      <div class="demo">
        <div class="demo__hint">Haz clic en los botones para disparar transiciones</div>
        <div class="fsm-diagram">
          <div class="fsm-row">
            <div class="fsm-node" data-state="menu">MENÚ<small>paso 9</small></div>
          </div>
          <div class="fsm-arrow">⇅</div>
          <div class="fsm-row">
            <div class="fsm-node" data-state="overworld">OVERWORLD</div>
            <div class="fsm-arrow">⇄</div>
            <div class="fsm-node" data-state="dungeon">DUNGEON</div>
          </div>
          <div class="fsm-buttons">
            <button class="nav-btn" data-action="play">Jugar (menú → overworld)</button>
            <button class="nav-btn" data-action="enter">Entrar a la cueva (overworld → dungeon)</button>
            <button class="nav-btn" data-action="exit">Salir de la mazmorra (dungeon → overworld)</button>
          </div>
        </div>
      </div>
    `;
    setupDemoFocus(this);

    this.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.action;
        if (action === "play" && this.state === "menu") this.state = "overworld";
        else if (action === "enter" && this.state === "overworld") this.state = "dungeon";
        else if (action === "exit" && this.state === "dungeon") this.state = "overworld";
        this.update();
      });
    });

    this.update();
  }

  update() {
    this.querySelectorAll(".fsm-node").forEach((node) => {
      node.classList.toggle("active", node.dataset.state === this.state);
    });

    const allowed = {
      menu: ["play"],
      overworld: ["enter"],
      dungeon: ["exit"],
    };
    const enabledActions = allowed[this.state] || [];
    this.querySelectorAll("[data-action]").forEach((btn) => {
      btn.disabled = !enabledActions.includes(btn.dataset.action);
    });
  }
}
customElements.define("demo-fsm", DemoFsm);

/* ============ <demo-sprite> ============ */
class DemoSprite extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="demo">
        <div class="demo__hint">Haz clic para interactuar — presiona "▶ Animar" para ver la animación</div>
        <div class="sprite-demo">
          <div class="sprite-demo__sheet">
            <div class="sprite-demo__sheet-wrap">
              <canvas id="sheet" width="32" height="64" style="width:128px;height:256px;"></canvas>
            </div>
            <div class="sprite-demo__labels">
              <div>Fila 1 (y=0): abajo</div>
              <div>Fila 2 (y=16): arriba</div>
              <div>Fila 3 (y=32): derecha</div>
              <div>Fila 4 (y=48): izquierda</div>
            </div>
          </div>
          <div class="sprite-demo__preview">
            <canvas id="preview" width="48" height="48" style="width:96px;height:96px;"></canvas>
            <div class="dpad">
              <button class="dpad__up" data-dir="up" title="Arriba">↑</button>
              <button class="dpad__left" data-dir="left" title="Izquierda">←</button>
              <button id="play" class="dpad__center" title="Animar / Detener">▶</button>
              <button class="dpad__right" data-dir="right" title="Derecha">→</button>
              <button class="dpad__down active" data-dir="down" title="Abajo">↓</button>
            </div>
          </div>
        </div>
      </div>
    `;
    setupDemoFocus(this);

    this.dirRows = { down: 0, up: 1, right: 2, left: 3 };
    this.frame = 0;
    this.playing = false;
    this.direction = "down";

    this.sheetImg = new Image();
    this.sheetImg.src = "img/link_sheet.png";
    this.sheetImg.onload = () => { this.drawSheet(); this.drawPreview(); };

    this.previewCanvas = this.querySelector("#preview");
    this.previewCtx = this.previewCanvas.getContext("2d");
    this.previewCtx.imageSmoothingEnabled = false;

    this.querySelectorAll("[data-dir]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.direction = btn.dataset.dir;
        this.querySelectorAll("[data-dir]").forEach((b) => b.classList.toggle("active", b === btn));
        this.drawPreview();
      });
    });

    this.querySelector("#play").addEventListener("click", () => {
      this.playing = !this.playing;
      this.querySelector("#play").textContent = this.playing ? "⏸" : "▶";
      if (this.playing) this.startAnim();
    });

    this.drawPreview();
  }

  drawSheet() {
    const canvas = this.querySelector("#sheet");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.sheetImg, 0, 0, canvas.width, canvas.height);
    // grid lines
    ctx.strokeStyle = "rgba(79,70,229,0.6)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(i * 16, 0); ctx.lineTo(i * 16, 64); ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(0, i * 16); ctx.lineTo(32, i * 16); ctx.stroke();
    }
  }

  drawPreview() {
    if (!this.sheetImg.complete) return;
    const ctx = this.previewCtx;
    ctx.clearRect(0, 0, 48, 48);
    const row = this.dirRows[this.direction];
    const col = this.frame;
    ctx.drawImage(this.sheetImg, col * 16, row * 16, 16, 16, 0, 0, 48, 48);
  }

  startAnim() {
    if (!this.playing) return;
    this.frame = (this.frame + 1) % 2;
    this.drawPreview();
    setTimeout(() => this.startAnim(), 150);
  }
}
customElements.define("demo-sprite", DemoSprite);
