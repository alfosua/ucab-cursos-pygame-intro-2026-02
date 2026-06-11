# Especificación de contenido — "Curso de Introducción a Pygame" (UCAB)

Autor: **Alfonso Suarez**. Idioma: **español** (lang="es"). Tema del juego: **The Legend of Zelda (NES)**.
Título del sitio/header: **Curso de Introducción a Pygame** · `<title>Curso de Introducción a Pygame</title>`.
Header: chip de logo (cuadrito indigo con icono de gamepad/terminal SVG inline) + título + "por" +
logo UCAB ancho (`img/ucab_wide.webp`, enlaza a https://www.ucab.edu.ve) + barra de progreso.
Favicons: `img/favicon.svg`, `img/favicon.ico`, `img/favicon-96x96.png`, `img/apple-touch-icon.png`.

Botones del home: "Iniciar Curso"/"Continuar Curso" (indigo), **"Descargar Assets"** (slate-900, icono
descarga, href `downloads/zelda-assets.zip`, atributo `download`), "Reiniciar" (outline, resetea progreso).

## Estructura (5 capítulos, 14 temas)

### Capítulo 1: Introducción
**01 — ¿Qué es Pygame?** (desc: "Qué es Pygame y el objetivo del taller.")
- S1 "¿Qué es Pygame?": Pygame es una librería gratuita y de código abierto para Python, diseñada para
  facilitar el desarrollo de videojuegos en 2D. / Funciona sobre SDL2, una librería multiplataforma que
  da acceso al teclado, la pantalla y el sonido. / Es ideal para aprender: con muy pocas líneas de Python
  ya tienes una ventana con gráficos en movimiento.
- S2 "¿Cuál es el objetivo del taller?": Nuestro objetivo es crear un pequeño clon de **The Legend of
  Zelda de NES (1986)**, para aprender las bases de Pygame. / En 2-3 horas construiremos paso a paso un
  mini-juego con mapa, movimiento, colisiones, texto, música, áreas y menú. / nota: No necesitas
  experiencia previa con videojuegos, solo Python básico.
- S3 "Así se verá el resultado" — slide con `gif: img/steps/step10.gif` (y mención del paso a paso).

**02 — Preparando el Entorno** (desc: "Software requerido e instalación de Pygame.")
- S1 "Requerimientos para empezar" — cards: Visual Studio Code (https://code.visualstudio.com/),
  Python 3+ (https://www.python.org/), Pygame 2 (https://www.pygame.org/).
- S2 "Instalar Pygame en un entorno de desarrollo" — terminal:
  ```
  # Crear entorno virtual de Python (Opcional)
  python -m venv .venv
  # Activar entorno en Windows
  .\.venv\Scripts\activate
  # Activar entorno en Linux
  source .venv/bin/activate

  # Instalar pygame con PIP
  pip install pygame
  # o también
  python -m pip install pygame
  ```
- S3 "Verificar la instalación" — terminal: `python -m pygame --version` o `python -c "import pygame"`
  mostrando el saludo "Hello from the pygame community".

**03 — Assets del Curso** (desc: "Descarga los sprites, fuente y música del taller.")
- S1 "Assets a usar": lista con los archivos (player.png, link_sheet.png, enemy.png, heart.png,
  overworld.png, dungeon.png, font.ttf, music.mp3) y para qué sirve cada uno.
- S2 "Descarga los assets" — slide con BOTÓN grande de descarga a `downloads/zelda-assets.zip`
  (componente download-slide): "Descomprime el zip y deja la carpeta `assets/` junto a tus archivos .py".
- S3 "Estructura del proyecto" — terminal/árbol:
  ```
  mi-juego/
  ├── assets/
  │   ├── overworld.png  ├── dungeon.png
  │   ├── player.png     ├── link_sheet.png
  │   ├── enemy.png      ├── heart.png
  │   ├── font.ttf       └── music.mp3
  └── 01_inicio.py
  ```

### Capítulo 2: La Ventana del Juego
**04 — Paso 1: Iniciar el Juego** (desc: "Ventana, ciclo de juego y FPS.") [archivo `01_inicio.py`]
- S1 explicación: Todo juego de Pygame tiene 3 partes: inicialización, ciclo principal y liberación de
  recursos. El ciclo se repite ~60 veces por segundo: procesa eventos, actualiza y dibuja.
- S2 código: inicialización (import, init, set_mode 800x600, caption "Zelda", Clock, running).
- S3 código: ciclo (tick/dt, eventos QUIT, fill "darkgreen", flip).
- S4 código: `pygame.quit()` al final.
- S5 GIF `img/steps/step01.gif`: "Una ventana verde de 800x600… ¡tu primer programa de Pygame!"

**05 — Paso 2: Dibujar Imágenes** (desc: "Superficies, load, scale y blit.") [`02_imagenes.py`]
- S1 explicación: cargamos imágenes UNA vez antes del ciclo y las dibujamos (blit) en cada frame.
- S2 código: cargar overworld.png + scale a (800,600); cargar player.png + scale a (48,48).
- S3 código: en el ciclo, `screen.blit(background_img, (0, 0))` y `screen.blit(player_img, (376, 400))`.
- S4 INTERACTIVO `coords-demo`: "¿Cómo ubica Pygame las cosas?" — sistema de coordenadas con origen
  arriba-izquierda: una cuadrícula 800x600 en miniatura; al mover el mouse (o flechas/sliders) se ve un
  sprite de Link y el par (x, y); eje Y crece hacia ABAJO.
- S5 GIF `img/steps/step02.gif`.

**06 — Paso 3: Movimiento por Teclado** (desc: "key.get_pressed y movimiento con delta time.") [`03_movimiento.py`]
- S1 explicación: variables de posición + teclas presionadas cada frame; multiplicamos por `dt` para que
  la velocidad no dependa de los FPS.
- S2 código: variables `player_x = 376`, `player_y = 400`, `player_speed = 200`.
- S3 código: `keys = pygame.key.get_pressed()` + los 4 ifs con `player_speed * dt`.
- S4 código: blit con `(player_x, player_y)` `# modificado`.
- S5 GIF `img/steps/step03.gif`.

### Capítulo 3: Interacción
**07 — Paso 4: Sistema de Colisiones** (desc: "Bordes de ventana y pygame.Rect.") [`04_colisiones.py`]
- S1 explicación: dos colisiones distintas — no salirse de la ventana (clamp) y detectar una zona
  (la entrada de la cueva) con rectángulos.
- S2 código: clamp con bordes (4 ifs con 800-48 / 600-48).
- S3 código: `cave_rect = pygame.Rect(200, 54, 50, 55)` + `player_rect` + `colliderect` + print.
- S4 código: `pygame.draw.rect(screen, "red", cave_rect, 3)` para depurar.
- S5 INTERACTIVO `collision-demo`: dos rectángulos (uno se mueve con flechas del teclado o mouse), se
  pintan verde/rojo y muestra `colliderect() == True/False` en vivo.
- S6 GIF `img/steps/step04.gif`.

**08 — Paso 5: Texto en Pantalla** (desc: "Fuentes TTF y render de texto.") [`05_texto.py`]
- S1 explicación: pygame.font carga TTF; `render()` crea una Surface de texto que se blitea como imagen.
- S2 código: `pygame.font.init()` + `font = pygame.font.Font("assets/font.ttf", 16)` +
  pre-render de `cave_text`.
- S3 código: bandera `near_cave` + blit condicional del texto; comentar el draw.rect de debug.
- S4 GIF `img/steps/step05.gif`.

**09 — Paso 6: Música de Fondo** (desc: "pygame.mixer y música en loop.") [`06_musica.py`]
- S1 explicación: mixer reproduce audio; music está pensado para pistas largas en streaming.
- S2 código: `pygame.mixer.init()` + load music.mp3 + `play(-1)` + `set_volume(0.5)`.
- S3 GIF `img/steps/step06.gif` con nota: "El GIF no suena — ejecútalo tú 😄".

**10 — Paso 7: Manejo de Eventos** (desc: "Eventos discretos vs. teclas mantenidas.") [`07_eventos.py`]
- S1 explicación: `key.get_pressed()` = estado continuo (mantener); eventos KEYDOWN = pulsación única.
  ENTER frente a la cueva disparará UNA acción.
- S2 código: el `if event.type == pygame.KEYDOWN and event.key == pygame.K_RETURN and near_cave:` + print.
- S3 GIF `img/steps/step07.gif`.

### Capítulo 4: Estructura del Juego
**11 — Paso 8: Múltiples Áreas (FSM)** (desc: "Máquina de estados finitos: overworld y mazmorra.") [`08_areas.py`]
- S1 explicación: una máquina de estados finitos (FSM) = el juego está en UN estado a la vez y cambia con
  transiciones. Estados: overworld / dungeon.
- S2 INTERACTIVO `fsm-demo`: diagrama con 3 nodos (MENÚ → OVERWORLD ⇄ DUNGEON) y botones que disparan las
  transiciones iluminando el estado activo (el nodo MENÚ se puede marcar "paso 9").
- S3 código: cargar dungeon_img y enemy_img; constantes `AREA_OVERWORLD/AREA_DUNGEON` + `current_area`.
- S4 código: transición de entrada (ENTER en la cueva → dungeon, reposicionar jugador) y `exit_rect` para volver.
- S5 código: lógica/render separadas con `if current_area == ... elif ...`.
- S6 GIF `img/steps/step08.gif`.

**12 — Paso 9: Menú Principal** (desc: "Menú con botones controlado por teclado.") [`09_menu.py`]
- S1 explicación: el menú es solo OTRO estado de la FSM; una lista de opciones + índice seleccionado.
- S2 código: `AREA_MENU`, `menu_options = ["Jugar", "Salir"]`, `selected_option = 0`, `title_font`.
- S3 código: eventos del menú (K_UP/K_DOWN con módulo % y K_RETURN para seleccionar).
- S4 código: render del menú (fondo negro, título "LA LEYENDA DE ZELDA" dorado, "> opción" verde).
- S5 GIF `img/steps/step09.gif`.

**13 — Paso 10: Animaciones** (desc: "Spritesheets y animación por frames.") [`10_animaciones.py`]
- S1 explicación: una spritesheet guarda varios frames en una imagen; recortamos con `subsurface` y
  alternamos frames con un temporizador.
- S2 INTERACTIVO `sprite-demo`: muestra `img/link_sheet.png` ampliada con la cuadrícula 2x4 (16x16) y
  etiquetas (abajo/arriba/derecha/izquierda); un botón "▶ Animar" reproduce la animación de caminar de
  cada fila al lado (canvas con image-rendering: pixelated).
- S3 código: cargar sheet + dict `frames` con subsurface + scale.
- S4 código: variables `player_dir/frame_index/frame_timer/FRAME_TIME/moving` + ifs de teclas modificados.
- S5 código: avance del frame con `frame_timer += dt` y blit de `frames[player_dir][frame_index]`.
- S6 GIF `img/steps/step10.gif`.

### Capítulo 5: Cierre
**14 — Conclusión y Contacto** (desc: "Recursos, ideas para seguir y contacto.")
- S1 "¿Qué aprendimos?": resumen en bullets de los 10 pasos.
- S2 "Más allá…": ideas para extender (vida con heart.png, ataques, más salas, NPC, guardar partida…).
- S3 "Recursos adicionales" — cards con links: TheSpritersResource (spriters-resource.com), Pixabay
  (pixabay.com), OpenGameArt (opengameart.org), Video Game Music (downloads.khinsider.com), DaFont (dafont.com).
- S4 "¡Muchas gracias!" — slide final con logo UCAB (`img/ucab_square.webp`), "¿Preguntas? Contacto:" —
  Alfonso Suarez · WhatsApp +58 424 927 4197 · alfosuag@gmail.com · github.com/alfosua.

## Notas para el código de los slides
- Los fragmentos de código de cada slide se derivan de los archivos reales `game/NN_*.py` (cópialos
  EXACTOS, con sus comentarios). Usa el estilo del viejo curso: fragmentos con `# ...` para el contexto
  omitido y sufijo `# modificado` cuando una línea cambia.
- Bloques de código: estilo "ventana mac" (3 puntos rojo/amarillo/verde arriba), fondo slate-900,
  JetBrains Mono, resaltado de sintaxis Python (mini-highlighter propio en JS: keywords, strings,
  números, comentarios, builtins de pygame en otro color).
- Cada tema marca su archivo: pill/badge con `01_inicio.py` en la cabecera del slide de código.
