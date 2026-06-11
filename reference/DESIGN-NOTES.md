# Design notes — alfosua.github.io/ucab-cursos-intro-c (reference site)

Scraped 2026-06-10. Files: `index.html`, `assets/index-*.js` (React+Vite bundle), `assets/index-*.css`
(Tailwind v4), favicons (`favicon.svg`, `favicon.ico`, `favicon-96x96.png`, `apple-touch-icon.png`),
`site.webmanifest`, UCAB logos (`assets/ucab_square.png` 1013x1024, `assets/ucab_wide.png` 1024x154).
Screenshot of home: `shots/home.png`.

## Stack of the original
React SPA (no router — state-based), Tailwind CSS v4, framer-motion for slide transitions,
react-syntax-highlighter (Prism) for code, lucide-react icons. Progress persisted (localStorage).
**Our clone must be plain HTML/CSS/vanilla JS (web components allowed).**

## Typography & palette
- Fonts: Google Fonts — `Inter` (400/500/600/700) for UI, `JetBrains Mono` (400/500) for code.
- Palette = Tailwind defaults. Primary accent: **indigo-600** (#4f46e5), hover indigo-700 (#4338ca).
  Neutrals: slate-50..900 (#f8fafc, #f1f5f9, #e2e8f0, #cbd5e1, #94a3b8, #64748b, #475569, #334155,
  #1e293b, #0f172a). White background. Extra accents used: amber (notes/warnings), emerald (success
  / completed status), red-600 (reset / danger).
- Rounded corners: buttons/cards `rounded-lg` (0.5rem), pills/close button `rounded-full`.
- Shadows: subtle (`shadow-sm`), progress bar `shadow-inner`.

## Home page ("Plan de Estudio")
- Sticky header, white, bottom border slate-100: left = indigo rounded-square logo chip (icon) +
  course title (bold, slate-900) + "por" + UCAB **wide logo** (h-8, links to https://www.ucab.edu.ve).
  Right = "Progreso" label (slate-500), 8rem progress bar (slate-100 track, indigo-600 fill, rounded
  full, animated width) + bold indigo % number.
- Main: `max-w-5xl mx-auto px-8 py-8`. H2 "Plan de Estudio" (text-2xl font-bold slate-900) + action
  buttons on the right:
  - "Iniciar Curso"/"Continuar Curso": indigo-600 bg, white text, play icon, rounded-lg, px-5 py-2.5.
  - "Soluciones": slate-900 bg, white text, GitHub icon (links to examples repo).
  - "Reiniciar": white bg, border, slate text.
- Topics table inside rounded-xl bordered card: header row `#  TEMA  DESCRIPCIÓN  PROGRESO`
  (uppercase, text-xs, slate-500, bg slate-50). Chapter group rows: book icon + "1. Introducción"
  (indigo icon, bold, bg slate-50/50). Topic rows: 2-digit number (slate-400 mono), topic name
  (font-medium slate-900), description (slate-500 text-sm), status pill ("No iniciado" slate /
  "En progreso" amber / "Completado" emerald, rounded-full, small dot/icon), then icon buttons:
  monitor icon = open presentation; trophy icon on project rows.
- Clicking a row / monitor opens the presentation overlay at that topic.

## Presentation overlay
- `fixed inset-0 z-50 bg-white` column flex.
- Top bar (border-b slate-100, p-4/6): left = topic title (slate-800 semibold) over "DIAPOSITIVA N
  DE M" (slate-500, text-xs, uppercase, tracking-wider). Right = close button (X icon, rounded-full,
  bg slate-100, hover slate-200), title "Cerrar presentación (Esc)".
- Content: flex-1, centered, `p-6 md:p-12`, scrollable, slide wrapper `max-w-5xl my-auto`.
  Slide transition: fade + slide-in from right (x:40→0, 0.3s ease-in-out; exit to x:-40). In vanilla
  JS use CSS animation/keyframes.
- Bottom bar (p-4/6, bg-white/90 backdrop-blur, border-t slate-100) with a 4px progress bar pinned
  to its top edge (slate-100 track, indigo-600 fill = (n+1)/total). Left button "Anterior" (or
  "Tema Anterior"/"Capítulo Anterior" on first slide; disabled state slate-400). Right button
  "Siguiente"; on last slide becomes filled indigo "Siguiente Tema"/"Siguiente Capítulo"/
  "Finalizar Curso".
- Keyboard: ← → navigate, Esc closes.

## Slide data model (replicate in vanilla JS)
`slides = { [topicId]: Slide[] }` where Slide:
- `title` (string) — slide heading
- `content` (string[]) — paragraphs/bullets (lines starting with "•" or "1." rendered as-is)
- `code` (template string) — Python code block, syntax highlighted, dark slate-900 block,
  JetBrains Mono, rounded-xl, with mac-style traffic-light dots header (like the old PDF deck)
- `terminal` (string) — dark terminal block (p-4 font-mono text-sm text-slate-300)
- `table` ({headers, rows}) — bordered table
- `image` / media — for our site also support `gif`/`video` slides and custom interactive
  web-component slides (e.g. coordinate-system demo)
- `note` — amber callout
- `icon`, `cards` — icon card grids (lucide-style icons; we can inline SVGs)

## Misc
- Favicon set: favicon.svg + favicon.ico + favicon-96x96.png + apple-touch-icon.png + webmanifest.
- Code highlighting: Prism in original; clone uses a tiny hand-rolled Python tokenizer (no libs).
- All text in Spanish; lang="es".
