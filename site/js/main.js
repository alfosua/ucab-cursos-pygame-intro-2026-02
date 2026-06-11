// Lógica principal de la app: home, presentación, navegación, progreso

const STORAGE_KEY = "pygame-curso-progress";

const ICONS = {
  gamepad: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  monitor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.997.107-.776.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.04 22.27c-1.93 0-3.83-.515-5.486-1.488l-.394-.234-4.083 1.071 1.09-3.978-.256-.408a10.18 10.18 0 0 1-1.567-5.452C1.345 6.165 6.135 1.378 12.044 1.378c2.864 0 5.557 1.116 7.583 3.142a10.65 10.65 0 0 1 3.13 7.566c-.002 5.91-4.792 10.694-10.713 10.694m9.106-19.846A12.13 12.13 0 0 0 12.044 0C5.495 0 .16 5.335.158 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.86 11.86 0 0 0 5.677 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.83 11.83 0 0 0-3.477-8.41"/></svg>`,
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  webIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
};

const CONTACT_ICONS = {
  whatsapp: ICONS.whatsapp,
  email: ICONS.email,
  github: ICONS.github,
  web: ICONS.webIcon,
};

/* ============ Progress / state ============ */
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

let progress = loadProgress();

function getAllTopics() {
  const topics = [];
  for (const chapter of COURSE.chapters) {
    for (const topic of chapter.topics) topics.push(topic);
  }
  return topics;
}

function getStatus(topicId) {
  return progress[topicId]?.status || "not-started";
}

function setStatus(topicId, status) {
  progress[topicId] = progress[topicId] || {};
  progress[topicId].status = status;
  saveProgress(progress);
}

function setSlideIndex(topicId, index) {
  progress[topicId] = progress[topicId] || {};
  progress[topicId].slideIndex = index;
  saveProgress(progress);
}

function getSlideIndex(topicId) {
  return progress[topicId]?.slideIndex || 0;
}

function computePercent() {
  const topics = getAllTopics();
  const completed = topics.filter((t) => getStatus(t.id) === "completed").length;
  return Math.round((completed / topics.length) * 100);
}

function pillForStatus(status) {
  const labels = {
    "not-started": "No iniciado",
    "in-progress": "En progreso",
    "completed": "Completado",
  };
  const cls = {
    "not-started": "pill-not-started",
    "in-progress": "pill-in-progress",
    "completed": "pill-completed",
  };
  return `<span class="pill ${cls[status]}"><span class="dot"></span>${labels[status]}</span>`;
}

/* ============ Header ============ */
function renderHeader() {
  const pct = computePercent();
  return `
    <header class="site-header" id="header-root">
      <div class="site-header__inner">
        <div class="site-header__brand">
          <div class="brand-chip">${ICONS.gamepad}</div>
          <div class="brand-text">
            <h1>${COURSE.title}</h1>
            <div class="brand-by">
              por <a href="https://www.ucab.edu.ve" target="_blank" rel="noopener"><img src="img/ucab_wide.webp" alt="UCAB"></a>
            </div>
          </div>
        </div>
        <div class="site-header__progress">
          <span class="progress-label">Progreso</span>
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          <span class="progress-pct">${pct}%</span>
        </div>
      </div>
    </header>
  `;
}

/* ============ Home / plan table ============ */
function renderHome() {
  const topics = getAllTopics();
  const anyStarted = topics.some((t) => getStatus(t.id) !== "not-started");
  const startLabel = anyStarted ? "Continuar Curso" : "Iniciar Curso";

  let firstIncomplete = topics.find((t) => getStatus(t.id) !== "completed") || topics[0];

  let rows = "";
  for (const chapter of COURSE.chapters) {
    rows += `
      <tr class="chapter-row">
        <td colspan="4">${ICONS.book.replace("<svg ", '<svg class="chapter-icon" ')}<span>${escapeHtml(chapter.title)}</span></td>
      </tr>
    `;
    for (const topic of chapter.topics) {
      const status = getStatus(topic.id);
      const numStr = String(topic.num).padStart(2, "0");
      rows += `
        <tr class="topic-row" data-topic-id="${topic.id}">
          <td class="col-num">${numStr}</td>
          <td class="col-title">${escapeHtml(topic.title)}</td>
          <td class="col-desc">${escapeHtml(topic.description)}</td>
          <td class="col-progress">
            <div class="col-actions">
              ${pillForStatus(status)}
              <button class="icon-btn" data-open-topic="${topic.id}" title="Abrir presentación">${ICONS.monitor}</button>
            </div>
          </td>
        </tr>
      `;
    }
  }

  return `
    <main class="home">
      <div class="home__head">
        <h2>Plan de Estudio</h2>
        <div class="home__actions">
          <button class="btn btn-primary" id="btn-start">${ICONS.play}${startLabel}</button>
          <a class="btn btn-dark" id="btn-assets" href="downloads/zelda-assets.zip" download>${ICONS.download}Descargar Assets</a>
          <a class="btn btn-dark" id="btn-solutions" href="https://github.com/alfosua/ucab-cursos-pygame-intro-2026-02" target="_blank" rel="noopener">${ICONS.github}Soluciones</a>
          <button class="btn btn-outline" id="btn-share">${ICONS.share}Compartir</button>
          <button class="btn btn-outline" id="btn-reset">${ICONS.reset}Reiniciar</button>
        </div>
      </div>
      <div class="plan-card">
        <table class="plan-table">
          <thead>
            <tr>
              <th class="col-num">#</th>
              <th>Tema</th>
              <th>Descripción</th>
              <th class="col-progress">Progreso</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
      <footer class="home-footer">
        <div>Hecho con ❤ por <strong>Alfonso Suarez</strong> · <a href="https://alfosua.com" target="_blank" rel="noopener">alfosua.com</a></div>
        <div class="home-footer__ucab">
          <a href="https://www.ucab.edu.ve" target="_blank" rel="noopener">
            Universidad Católica Andrés Bello <img src="img/ucab_wide.webp" alt="UCAB">
          </a>
        </div>
      </footer>
    </main>
  `;
}

function attachHomeEvents() {
  const topics = getAllTopics();
  let firstIncomplete = topics.find((t) => getStatus(t.id) !== "completed") || topics[0];

  document.getElementById("btn-start")?.addEventListener("click", () => {
    openPresentation(firstIncomplete.id, getSlideIndex(firstIncomplete.id));
  });

  document.getElementById("btn-share")?.addEventListener("click", showShareModal);

  document.getElementById("btn-reset")?.addEventListener("click", () => {
    if (confirm("¿Seguro que deseas reiniciar todo tu progreso?")) {
      progress = {};
      saveProgress(progress);
      render();
    }
  });

  document.querySelectorAll(".topic-row").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("[data-open-topic]")) return;
      const id = parseInt(row.dataset.topicId, 10);
      openPresentation(id, getSlideIndex(id));
    });
  });

  document.querySelectorAll("[data-open-topic]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.openTopic, 10);
      openPresentation(id, getSlideIndex(id));
    });
  });
}

/* ============ Presentation overlay ============ */
let currentTopicIndex = -1; // index into flat topic list
let currentSlideIndex = 0;

function findTopicById(id) {
  for (let ci = 0; ci < COURSE.chapters.length; ci++) {
    const chapter = COURSE.chapters[ci];
    for (let ti = 0; ti < chapter.topics.length; ti++) {
      if (chapter.topics[ti].id === id) {
        return { chapter, topic: chapter.topics[ti], chapterIndex: ci, topicIndexInChapter: ti };
      }
    }
  }
  return null;
}

function flatTopics() {
  return getAllTopics();
}

function renderSlideContent(slide, topic) {
  let html = "";

  if (slide.logo) {
    html += `<div class="slide-logo"><img src="${escapeHtml(slide.logo)}" alt="Pygame"></div>`;
  }

  html += `<h2>${escapeHtml(slide.title)}</h2><div class="slide__content">`;

  for (const line of slide.content || []) {
    if (line.startsWith("nota:")) {
      html += `<p class="note">${formatLine(line.replace(/^nota:\s*/, ""))}</p>`;
    } else if (/^[•\-]\s/.test(line) || /^\d+\.\s/.test(line)) {
      html += `<p>${formatLine(line)}</p>`;
    } else {
      html += `<p>${formatLine(line)}</p>`;
    }
  }
  html += `</div>`;

  if (slide.gallery) {
    html += `<div class="gallery-grid">`;
    for (const item of slide.gallery) {
      html += `
        <div class="gallery-item">
          <div class="gif-frame"><img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.caption)}"></div>
          <div class="gif-caption">${escapeHtml(item.caption)}</div>
        </div>
      `;
    }
    html += `</div>`;
  }

  if (slide.code) {
    const filename = "main.py";
    const step = slide.step || slide.file || topic.file || "";
    html += `<code-window filename="${escapeHtml(filename)}" step="${escapeHtml(step)}" code="${attrEscape(slide.code)}"></code-window>`;
  }

  if (slide.terminal) {
    html += `<code-window variant="terminal" code="${attrEscape(slide.terminal)}"></code-window>`;
  }

  if (slide.cards) {
    html += `<div class="card-grid">`;
    for (const card of slide.cards) {
      html += `
        <a class="resource-card" href="${escapeHtml(card.url)}" target="_blank" rel="noopener">
          ${card.icon ? `<img src="${escapeHtml(card.icon)}" alt="${escapeHtml(card.name)}">` : ICONS.external}
          <div class="resource-card__name">${escapeHtml(card.name)}</div>
          ${card.description ? `<div class="resource-card__desc">${escapeHtml(card.description)}</div>` : ""}
          <div class="resource-card__url">${escapeHtml(card.url.replace(/^https?:\/\//, ""))}</div>
        </a>
      `;
    }
    html += `</div>`;
  }

  if (slide.assetGrid) {
    html += `<div class="asset-grid">`;
    for (const asset of slide.assetGrid) {
      let preview;
      if (asset.img) {
        preview = `<img src="${escapeHtml(asset.img)}" alt="${escapeHtml(asset.file)}">`;
      } else if (asset.kind === "font") {
        preview = `<div class="font-tile">Aa</div>`;
      } else if (asset.kind === "audio") {
        preview = ICONS.music;
      } else {
        preview = "";
      }
      html += `
        <div class="asset-card">
          <div class="asset-card__preview">${preview}</div>
          <div class="asset-card__filename">${escapeHtml(asset.file)}</div>
          <div class="asset-card__purpose">${escapeHtml(asset.purpose)}</div>
        </div>
      `;
    }
    html += `</div>`;
  }

  if (slide.gif) {
    html += `
      <div class="gif-card">
        <div class="gif-frame"><img src="${escapeHtml(slide.gif)}" alt="${escapeHtml(slide.caption || slide.title)}"></div>
        ${slide.caption ? `<div class="gif-caption">${escapeHtml(slide.caption)}</div>` : ""}
      </div>
    `;
  }

  if (slide.download) {
    html += `
      <div class="download-card">
        <a class="download-btn" href="${escapeHtml(slide.download.href)}" download>${ICONS.download}${escapeHtml(slide.download.label)}</a>
        ${slide.download.hint ? `<div class="download-hint">${escapeHtml(slide.download.hint)}</div>` : ""}
      </div>
    `;
  }

  if (slide.contact) {
    const c = slide.contact;
    html += `
      <div class="contact-card">
        ${c.logo ? `<img class="logo" src="${escapeHtml(c.logo)}" alt="UCAB">` : ""}
        ${c.heading ? `<h3>${escapeHtml(c.heading)}</h3>` : ""}
        <div class="contact-name">${escapeHtml(c.name)}</div>
        ${c.subtitle ? `<div class="contact-subtitle">${escapeHtml(c.subtitle)}</div>` : ""}
        <div class="contact-grid">
          ${c.items.map((item) => {
            const icon = CONTACT_ICONS[item.icon] || "";
            const inner = `${icon}<span>${escapeHtml(item.value)}</span>`;
            return item.url
              ? `<a class="contact-chip" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${inner}</a>`
              : `<div class="contact-chip">${inner}</div>`;
          }).join("")}
        </div>
      </div>
    `;
  }

  if (slide.interactive) {
    const tagMap = {
      "coords-demo": "demo-coords",
      "collision-demo": "demo-collision",
      "fsm-demo": "demo-fsm",
      "sprite-demo": "demo-sprite",
    };
    const tag = tagMap[slide.interactive];
    if (tag) html += `<${tag}></${tag}>`;
  }

  return html;
}

function formatLine(line) {
  // Bold **text** and inline code `text`
  let out = escapeHtml(line);
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/`(.+?)`/g, "<code>$1</code>");
  // strip leading bullet markers visually (keep them, just don't double-render)
  return out;
}

function attrEscape(str) {
  return escapeHtml(str);
}

function navLabels(topic, slideIndex, slidesCount, chapterIndex, topicIndexInChapter) {
  const isFirstSlide = slideIndex === 0;
  const isLastSlide = slideIndex === slidesCount - 1;
  const chapter = COURSE.chapters[chapterIndex];
  const isFirstTopicInChapter = topicIndexInChapter === 0;
  const isFirstChapter = chapterIndex === 0;
  const isLastTopicInChapter = topicIndexInChapter === chapter.topics.length - 1;
  const isLastChapter = chapterIndex === COURSE.chapters.length - 1;

  let prevLabel = "Anterior";
  let prevDisabled = false;
  if (isFirstSlide) {
    if (isFirstTopicInChapter && isFirstChapter) {
      prevDisabled = true;
      prevLabel = "Anterior";
    } else if (isFirstTopicInChapter) {
      prevLabel = "Capítulo Anterior";
    } else {
      prevLabel = "Tema Anterior";
    }
  }

  let nextLabel = "Siguiente";
  let nextPrimary = false;
  if (isLastSlide) {
    nextPrimary = true;
    if (isLastTopicInChapter && isLastChapter) {
      nextLabel = "Finalizar Curso";
    } else if (isLastTopicInChapter) {
      nextLabel = "Siguiente Capítulo";
    } else {
      nextLabel = "Siguiente Tema";
    }
  }

  return { prevLabel, prevDisabled, nextLabel, nextPrimary };
}

function openPresentation(topicId, slideIndex = 0, opts = {}) {
  const found = findTopicById(topicId);
  if (!found) return;
  currentTopicIndex = topicId;
  currentSlideIndex = Math.max(0, Math.min(slideIndex, found.topic.slides.length - 1));

  if (getStatus(topicId) === "not-started") {
    setStatus(topicId, "in-progress");
  }

  renderOverlay({ animate: false });
  document.getElementById("overlay").hidden = false;
  document.body.style.overflow = "hidden";
  updateHash();
  renderHeaderInPlace();

  const isFirstTopicInChapter = found.topicIndexInChapter === 0;
  const showIntro = opts.chapterIntro !== false && isFirstTopicInChapter && currentSlideIndex === 0;
  if (showIntro) {
    showChapterIntro(found.chapter.title);
  }
}

/* ============ Chapter intro interstitial ============ */
function showChapterIntro(chapterTitle) {
  const el = document.createElement("div");
  el.className = "chapter-intro";
  el.innerHTML = `
    <h1 class="chapter-intro__title">${escapeHtml(chapterTitle)}</h1>
    <div class="chapter-intro__progress"><div class="chapter-intro__progress-fill" id="chapter-intro-fill"></div></div>
    <div class="chapter-intro__caption">Haz clic para omitir</div>
  `;
  document.body.appendChild(el);

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    document.removeEventListener("keydown", onKey, true);
    // Desvanecer la lámina y quitarla al terminar la transición
    el.classList.add("fade-out");
    setTimeout(() => el.remove(), 650);
  };

  const onKey = (e) => {
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      dismiss();
    }
  };

  el.addEventListener("click", dismiss);
  document.addEventListener("keydown", onKey, true);

  requestAnimationFrame(() => {
    const fill = el.querySelector("#chapter-intro-fill");
    void fill.offsetWidth; // forzar reflow para que la transición sí ocurra
    fill.classList.add("animate");
    fill.addEventListener("transitionend", dismiss, { once: true });
  });

  // Respaldo por si transitionend no llega a dispararse
  setTimeout(dismiss, 3000);
}

function closePresentation() {
  document.getElementById("overlay").hidden = true;
  document.body.style.overflow = "";
  currentTopicIndex = -1;
  history.replaceState(null, "", location.pathname + location.search);
  renderHeaderInPlace();
  renderHomeInPlace();
}

function updateHash() {
  if (currentTopicIndex < 0) return;
  const found = findTopicById(currentTopicIndex);
  // topic id is 1-based, slide index 0-based per spec
  const hash = `#/topic/${found.topic.id}/slide/${currentSlideIndex}`;
  history.replaceState(null, "", hash);
}

function goToSlide(newIndex, direction) {
  const found = findTopicById(currentTopicIndex);
  const slidesCount = found.topic.slides.length;

  if (newIndex < 0) {
    // go to previous topic, last slide
    const topics = flatTopics();
    const idx = topics.findIndex((t) => t.id === currentTopicIndex);
    if (idx > 0) {
      const prevTopic = topics[idx - 1];
      currentTopicIndex = prevTopic.id;
      currentSlideIndex = prevTopic.slides.length - 1;
      renderOverlay({ animate: true, direction: "prev" });
      updateHash();
    }
    return;
  }

  if (newIndex >= slidesCount) {
    // mark current topic completed
    setStatus(currentTopicIndex, "completed");
    renderHeaderInPlace();

    const topics = flatTopics();
    const idx = topics.findIndex((t) => t.id === currentTopicIndex);
    if (idx < topics.length - 1) {
      const nextTopic = topics[idx + 1];
      currentTopicIndex = nextTopic.id;
      currentSlideIndex = 0;
      if (getStatus(currentTopicIndex) === "not-started") setStatus(currentTopicIndex, "in-progress");
      renderOverlay({ animate: true, direction: "next" });
      updateHash();
      const found = findTopicById(currentTopicIndex);
      if (found && found.topicIndexInChapter === 0) {
        showChapterIntro(found.chapter.title);
      }
    } else {
      // finished course
      closePresentation();
    }
    return;
  }

  currentSlideIndex = newIndex;
  // mark completed if last slide reached
  if (currentSlideIndex === slidesCount - 1) {
    setStatus(currentTopicIndex, "completed");
  } else if (getStatus(currentTopicIndex) === "not-started") {
    setStatus(currentTopicIndex, "in-progress");
  }
  renderHeaderInPlace();
  renderOverlay({ animate: true, direction });
  updateHash();
  setSlideIndex(currentTopicIndex, currentSlideIndex);
}

function renderOverlay({ animate, direction }) {
  const found = findTopicById(currentTopicIndex);
  if (!found) return;
  const { topic, chapterIndex, topicIndexInChapter } = found;
  const slide = topic.slides[currentSlideIndex];
  const total = topic.slides.length;

  setSlideIndex(currentTopicIndex, currentSlideIndex);

  const { prevLabel, prevDisabled, nextLabel, nextPrimary } = navLabels(
    topic, currentSlideIndex, total, chapterIndex, topicIndexInChapter
  );

  const progressPct = ((currentSlideIndex + 1) / total) * 100;

  const overlay = document.getElementById("overlay");
  overlay.innerHTML = `
    <div class="overlay__top">
      <div>
        <p class="overlay__topic-title">${escapeHtml(topic.title)}</p>
        <p class="overlay__slide-counter">Diapositiva ${currentSlideIndex + 1} de ${total}</p>
      </div>
      <button class="overlay__close" id="overlay-close" title="Cerrar presentación (Esc)">${ICONS.close}</button>
    </div>
    <div class="overlay__content">
      <div class="slide-wrapper ${animate ? (direction === "prev" ? "anim-in" : "anim-in") : ""}" id="slide-wrapper">
        <div class="slide">
          ${renderSlideContent(slide, topic)}
        </div>
      </div>
    </div>
    <div class="overlay__footer">
      <div class="footer-progress"><div class="footer-progress__fill" style="width:${progressPct}%"></div></div>
      <button class="nav-btn" id="nav-prev" ${prevDisabled ? "disabled" : ""}>${ICONS.arrowLeft}${prevLabel}</button>
      <button class="nav-btn ${nextPrimary ? "nav-btn--primary" : ""}" id="nav-next">${nextLabel}${ICONS.arrowRight}</button>
    </div>
  `;

  document.getElementById("overlay-close").addEventListener("click", closePresentation);
  document.getElementById("nav-prev").addEventListener("click", () => goToSlide(currentSlideIndex - 1, "prev"));
  document.getElementById("nav-next").addEventListener("click", () => goToSlide(currentSlideIndex + 1, "next"));
}

/* ============ Keyboard navigation ============ */
document.addEventListener("keydown", (e) => {
  const overlay = document.getElementById("overlay");
  if (overlay.hidden) return;

  // Don't interfere if an interactive demo has focus
  const active = document.activeElement;
  if (active && active.closest && active.closest("demo-coords, demo-collision, demo-fsm, demo-sprite")) {
    return;
  }

  if (e.key === "Escape") {
    closePresentation();
  } else if (e.key === "ArrowRight") {
    goToSlide(currentSlideIndex + 1, "next");
  } else if (e.key === "ArrowLeft") {
    goToSlide(currentSlideIndex - 1, "prev");
  }
});

/* ============ Share modal ============ */
function cleanCourseUrl() {
  // URL dinámica según dónde se acceda, sin hash ni query params
  return location.origin + location.pathname;
}

function showShareModal() {
  const url = cleanCourseUrl();
  const el = document.createElement("div");
  el.className = "share-modal";
  el.innerHTML = `
    <div class="share-modal__card" role="dialog" aria-label="Compartir el curso">
      <button class="share-modal__close" title="Cerrar">${ICONS.close}</button>
      <div class="share-modal__icon">${ICONS.share}</div>
      <h2>Comparte el curso</h2>
      <p>Haz clic en el enlace para copiarlo:</p>
      <button class="share-modal__link" title="Copiar enlace">
        ${ICONS.link}<span class="share-modal__url">${escapeHtml(url)}</span>
        <span class="copied-tip">¡Copiado!</span>
      </button>
      <div class="share-modal__actions">
        <button class="btn btn-primary" id="share-start">${ICONS.play}Iniciar Curso</button>
        <button class="btn btn-outline" id="share-close">Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(el);

  const close = () => {
    document.removeEventListener("keydown", onKey, true);
    el.classList.add("fade-out");
    setTimeout(() => el.remove(), 250);
  };
  const onKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };
  document.addEventListener("keydown", onKey, true);

  el.addEventListener("click", (e) => {
    if (e.target === el) close(); // clic en el fondo
  });
  el.querySelector(".share-modal__close").addEventListener("click", close);
  el.querySelector("#share-close").addEventListener("click", close);

  el.querySelector("#share-start").addEventListener("click", () => {
    close();
    const topics = getAllTopics();
    const first = topics.find((t) => getStatus(t.id) !== "completed") || topics[0];
    openPresentation(first.id, getSlideIndex(first.id));
  });

  const linkBtn = el.querySelector(".share-modal__link");
  linkBtn.addEventListener("click", () => {
    navigator.clipboard?.writeText(url).then(() => {
      const tip = linkBtn.querySelector(".copied-tip");
      tip.classList.add("show");
      setTimeout(() => tip.classList.remove("show"), 1200);
    });
  });
}

/* ============ Intro del sitio (pantalla de título estilo Zelda) ============ */
function showSiteIntro() {
  const el = document.createElement("div");
  el.className = "site-intro";
  el.innerHTML = `
    <div class="site-intro__hearts">
      <img src="img/assets/heart.png" alt=""><img src="img/assets/heart.png" alt=""><img src="img/assets/heart.png" alt="">
    </div>
    <div class="site-intro__triforce" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
    <h1 class="site-intro__title">Introducción a<br>Pygame</h1>
    <div class="site-intro__subtitle">Una aventura al estilo Zelda · UCAB</div>
    <div class="site-intro__walker"><div class="site-intro__link" aria-hidden="true"></div></div>
    <div class="site-intro__start">PRESIONA START</div>
    <div class="site-intro__hint">toca la pantalla o presiona ENTER</div>
  `;
  document.body.appendChild(el);
  document.body.classList.add("no-scroll");

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    sessionStorage.setItem("site-intro-seen", "1");
    document.removeEventListener("keydown", onKey, true);
    document.body.classList.remove("no-scroll");
    el.classList.add("fade-out");
    setTimeout(() => el.remove(), 600);
  };
  const onKey = (e) => {
    if (["Enter", " ", "Escape", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      dismiss();
    }
  };
  el.addEventListener("click", dismiss);
  document.addEventListener("keydown", onKey, true);
}

/* ============ Routing (hash deep link) ============ */
function handleHash() {
  if (location.hash === "#/share") {
    showShareModal();
    return;
  }

  const ci = location.hash.match(/^#\/chapter-intro\/(\d+)/);
  if (ci) {
    const chapterId = parseInt(ci[1], 10);
    const chapter = COURSE.chapters.find((c) => c.id === chapterId);
    if (chapter) {
      const firstTopic = chapter.topics[0];
      openPresentation(firstTopic.id, 0, { chapterIntro: false });
      showChapterIntro(chapter.title);
    }
    return;
  }

  const t = location.hash.match(/^#\/topic\/(\d+)$/);
  if (t) {
    const topicId = parseInt(t[1], 10);
    openPresentation(topicId, getSlideIndex(topicId));
    return;
  }

  const m = location.hash.match(/^#\/topic\/(\d+)\/slide\/(\d+)/);
  if (m) {
    const topicId = parseInt(m[1], 10);
    const slideIndex = parseInt(m[2], 10);
    openPresentation(topicId, slideIndex);
  }
}

/* ============ Render orchestration ============ */
function renderHeaderInPlace() {
  const headerEl = document.getElementById("header-root");
  if (headerEl) headerEl.outerHTML = renderHeader();
}

function renderHomeInPlace() {
  const homeEl = document.querySelector("main.home");
  if (homeEl) {
    homeEl.outerHTML = renderHome();
    attachHomeEvents();
  }
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = renderHeader() + renderHome();
  attachHomeEvents();
}

render();
handleHash();
window.addEventListener("hashchange", handleHash);

// Mostrar la intro del sitio al entrar al home (una vez por sesión,
// no al llegar con un enlace directo a un tema)
if (!location.hash && !sessionStorage.getItem("site-intro-seen")) {
  showSiteIntro();
}
