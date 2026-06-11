# Cursos de UCAB: Introducción a Pygame - Edición 2026-II

Taller introductorio de Pygame (2-3 horas) con temática de **The Legend of Zelda (NES)**,
por **Alfonso Suarez**. Sucesor del curso "Introducción a Pygame con Pokémon".

## Estructura

- `site/` — sitio web del curso (HTML + CSS + JavaScript vanilla, sin frameworks):
  plan de estudio + presentación de diapositivas con demos interactivas.
  - `site/downloads/zelda-assets.zip` — assets descargables para los estudiantes.
- `game/` — código del juego en 12 pasos incrementales (`01_inicio.py` … `12_luces.py`),
  un archivo por paso, ejecutables por separado durante la clase.
  - `game/assets/` — sprites, mapas, fuente y música (ver `NOTES.md` para fuentes y licencias).
  - `game/tools/capture.py` — genera los GIFs de demostración del sitio (headless).
- `reference/` — notas de diseño del sitio de referencia (curso de C).
- `docs/` — especificaciones usadas durante la construcción del curso.

## Servir el sitio

```bash
pnpm dlx serve -l 3000 site
```

## Ejecutar los pasos del juego

```bash
cd game
python -m venv .venv && source .venv/bin/activate
pip install pygame-ce   # o pygame (requiere Python <= 3.13)
python 01_inicio.py
```

## Regenerar los GIFs de demostración

```bash
cd game && .venv/bin/python tools/capture.py
```
