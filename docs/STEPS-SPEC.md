# Especificación — código del curso (10 pasos incrementales)

Juego demo estilo **The Legend of Zelda (NES)** para un curso introductorio de Pygame (UCAB).
Cada paso es UN archivo Python completo y autónomo en `game/`, que el estudiante puede ejecutar
por separado. Cada archivo N = archivo N-1 + los cambios del paso (estilo incremental, igual que
el viejo curso de Pokémon). Probar con `game/.venv/bin/python` (pygame-ce 2.5.7).

## Reglas de estilo (OBLIGATORIAS)
- **Sin clases. Sin funciones definidas por el usuario.** Solo: setup arriba, un `while running:` con la
  lógica, y `pygame.quit()` al final. (Única excepción permitida: ninguna. No hace falta.)
- Comentarios en **español**, cortos, encima de cada bloque (mismo estilo del PDF viejo:
  `# Inicializar pygame y configurar la ventana`, `# Ciclo principal del juego`, etc.).
- Rutas de assets relativas: `assets/player.png` (se ejecuta desde `game/`).
- Nombres de variables en inglés sencillo como el curso viejo (`player_x`, `player_speed`, `running`, `dt`).

## Constantes del juego
- Ventana: `(800, 600)`, caption `"Zelda"`. FPS 60, `dt = clock.tick(60) / 1000`.
- Fondo overworld: `assets/overworld.png` escalado a `(800, 600)`.
- Fondo dungeon: `assets/dungeon.png` escalado a `(800, 600)`.
- Jugador: `assets/player.png` escalado a `(48, 48)`. Posición inicial `player_x = 376`, `player_y = 400`,
  `player_speed = 200` (px/s).
- Zona de la cueva (rect de peligro/entrada) en overworld: `cave_rect = pygame.Rect(200, 54, 50, 55)`
  (es exactamente la entrada negra de la cueva en la imagen escalada).
- Fuente: `assets/font.ttf` (Press Start 2P), tamaño 16 para avisos, 32 para títulos.
- Música: `assets/music.mp3`, loop infinito, volumen 0.5.
- Enemigo (solo paso 8+ en dungeon): `assets/enemy.png` escalado a `(48, 48)` en posición fija `(376, 150)`.
- Corazones (paso 9+ opcional en HUD… NO: mantenlo simple, el corazón NO se usa en el código; es parte del zip por si el estudiante quiere extender).

## Archivos

### `01_inicio.py` — Paso 1: iniciar un programa básico
Igual al curso viejo: import, `pygame.init()`, ventana, caption, clock, `running=True`,
ciclo con manejo de `pygame.QUIT`, `screen.fill("darkgreen")`, `pygame.display.flip()`, `pygame.quit()`.

### `02_imagenes.py` — Paso 2: dibujar imágenes
+ Cargar `overworld.png` (escalar 800x600) y `player.png` (escalar 48x48) ANTES del ciclo.
+ En el ciclo: `screen.blit(background_img, (0, 0))` y `screen.blit(player_img, (376, 400))`.
  (El fill se queda, comentado como redundante o se reemplaza; mejor: mantener fill y blits encima.)

### `03_movimiento.py` — Paso 3: movimiento por teclado
+ Variables `player_x`, `player_y`, `player_speed` antes del ciclo.
+ `keys = pygame.key.get_pressed()` y 4 ifs (K_LEFT/K_RIGHT/K_UP/K_DOWN) con `player_speed * dt`.
+ blit del jugador usa `(player_x, player_y)`.

### `04_colisiones.py` — Paso 4: sistema de colisiones
+ Clamp con los bordes: 4 ifs (`if player_x < 0: player_x = 0`, etc. con `800 - 48` y `600 - 48`).
+ `cave_rect = pygame.Rect(200, 54, 50, 55)` antes del ciclo.
+ En el ciclo: `player_rect = pygame.Rect(player_x, player_y, 48, 48)`;
  `if player_rect.colliderect(cave_rect): print("¡Estás en la entrada de la cueva!")`.
+ Dibujar el rect rojo de depuración: `pygame.draw.rect(screen, "red", cave_rect, 3)` (borde de 3px para
  que se vea la cueva debajo).

### `05_texto.py` — Paso 5: renderizar texto
+ `pygame.font.init()` tras `pygame.init()`. `font = pygame.font.Font("assets/font.ttf", 16)`.
+ Pre-renderizar `cave_text = font.render("¡Una cueva misteriosa!", True, "white")` antes del ciclo.
+ Bandera `near_cave = False`; en el ciclo set True/False según colisión (reemplaza el print).
+ Si `near_cave`: `screen.blit(cave_text, (220, 130))`.
+ El draw.rect rojo se comenta (`# pygame.draw.rect(...)  # ya no lo necesitamos`).

### `06_musica.py` — Paso 6: reproducir música
+ `pygame.mixer.init()` tras los init. `pygame.mixer.music.load("assets/music.mp3")`,
  `pygame.mixer.music.play(-1)`, `pygame.mixer.music.set_volume(0.5)` antes del ciclo.

### `07_eventos.py` — Paso 7: manejo de eventos
+ En el `for event`: `if event.type == pygame.KEYDOWN and event.key == pygame.K_RETURN and near_cave:`
  `print("Entrando a la cueva...")`.
+ (Demostración de la diferencia entre eventos discretos y `key.get_pressed()`.)

### `08_areas.py` — Paso 8: múltiples áreas (FSM básica)
+ Cargar `dungeon_img` (800x600) y `enemy_img` (48x48).
+ Estados: `AREA_OVERWORLD = "overworld"`, `AREA_DUNGEON = "dungeon"`, `current_area = AREA_OVERWORLD`.
+ Zona de salida en dungeon: `exit_rect = pygame.Rect(0, 250, 40, 120)` (puerta izquierda).
+ Eventos: si ENTER y `near_cave` y `current_area == AREA_OVERWORLD`: cambiar a dungeon y
  `player_x, player_y = 376, 480` (aparece abajo).
+ Lógica del ciclo separada por área (`if current_area == AREA_OVERWORLD: ... elif current_area == AREA_DUNGEON: ...`):
  - overworld: igual que antes (movimiento, clamp, cueva, texto).
  - dungeon: mismo movimiento+clamp, dibujar `dungeon_img`, dibujar enemigo en `(376, 150)`,
    `player_rect.colliderect(exit_rect)` → volver a overworld con `player_x, player_y = 220, 140`
    (frente a la cueva).
+ El render también se separa por área.

### `09_menu.py` — Paso 9: menú con botones por teclado
+ Nuevo estado `AREA_MENU = "menu"`; `current_area = AREA_MENU` al inicio.
+ `title_font = pygame.font.Font("assets/font.ttf", 32)`.
+ `menu_options = ["Jugar", "Salir"]`, `selected_option = 0`.
+ Eventos en menú: K_UP/K_DOWN cambian `selected_option` con módulo `%`; K_RETURN:
  "Jugar" → `current_area = AREA_OVERWORLD`; "Salir" → `running = False`.
+ Render menú: fondo negro, título `"LA LEYENDA DE ZELDA"` en amarillo (`"gold"`) centrado arriba
  (usa `title_text.get_rect(center=(400, 180))`... ¡OJO! sin funciones está bien usar métodos),
  opciones en blanco, la seleccionada en verde (`"green"`) y con prefijo `"> "`.
  Renderizar las opciones dentro del ciclo (es la forma simple; mencionar en comentario que se podría pre-renderizar).

### `10_animaciones.py` — Paso 10: animaciones
+ Reemplazar la carga de `player.png` por `assets/link_sheet.png`:
  `sheet = pygame.image.load("assets/link_sheet.png")` y extraer 8 frames con `subsurface`:
  la hoja es 32x64, frames de 16x16, filas: 0=abajo, 1=arriba, 2=derecha, 3=izquierda; 2 columnas.
  Construir un dict SIN funciones:
  ```python
  frames = {}
  frames["down"]  = [pygame.transform.scale(sheet.subsurface((0,  0, 16, 16)), (48, 48)), pygame.transform.scale(sheet.subsurface((16,  0, 16, 16)), (48, 48))]
  frames["up"]    = [...fila 1...]
  frames["right"] = [...fila 2...]
  frames["left"]  = [...fila 3...]
  ```
+ Variables: `player_dir = "down"`, `frame_index = 0`, `frame_timer = 0`, `FRAME_TIME = 0.15`, `moving = False`.
+ En el movimiento: cada if de tecla además hace `player_dir = "left"` (etc.) y `moving = True`
  (reset `moving = False` antes de leer teclas).
+ Animación: `if moving: frame_timer += dt; si frame_timer >= FRAME_TIME: frame_timer = 0; frame_index = (frame_index + 1) % 2` ; `else: frame_index = 0`.
+ Dibujar `frames[player_dir][frame_index]` en lugar de `player_img` (en ambas áreas).

## Verificación (hazla TÚ, el agente)
1. Compilar todos: `for f in 0*.py 10*.py; do game/.venv/bin/python -m py_compile $f; done`.
2. Ejecutar cada paso headless 3 segundos con `SDL_VIDEODRIVER=dummy SDL_AUDIODRIVER=dummy` y un
   timeout, verificando que no crashea (puedes inyectar eventos con `pygame.event.post` desde un
   wrapper, ver abajo).
3. **GIFs de demostración** (uno por paso) en `site/img/steps/step01.gif` … `step10.gif`:
   - Crea `game/tools/capture.py` (aquí SÍ puedes usar funciones — es una herramienta, no material del curso).
   - Técnica: `SDL_VIDEODRIVER=dummy`; importa el módulo del paso con `runpy.run_path` después de
     monkeypatchear `pygame.display.flip` para (a) guardar un frame cada 6 flips
     (`pygame.image.save(pygame.display.get_surface(), ...)` o copiar la surface a una lista),
     (b) inyectar eventos programados (una lista de (frame, evento)) con `pygame.event.post`,
     y (c) lanzar `pygame.event.post(pygame.event.Event(pygame.QUIT))` tras ~8-10 segundos simulados.
   - Para simular teclas mantenidas (movimiento con `key.get_pressed`) monkeypatchea
     `pygame.key.get_pressed` para devolver un estado controlado por guion (usa
     `import pygame.key` y reemplaza; construye listas tipo `[0]*512` con índices de K_LEFT etc.
     — usa `pygame.key.ScancodeWrapper`? No: basta un objeto dict-like; pygame indexa con constantes,
     implementa una clase pequeña con `__getitem__` DENTRO de capture.py).
   - Guion por paso (ejemplos): paso 1 nada (2 s); paso 3 caminar en cuadrado; pasos 4-7 caminar
     hasta la cueva (de (376,400) a la zona (200,54): izquierda y arriba), en paso 7 además ENTER;
     paso 8 entrar a la cueva (ENTER en la zona) y pasear por el dungeon hasta la salida; paso 9
     navegar el menú (DOWN, UP, ENTER) y luego caminar; paso 10 caminar en las 4 direcciones para
     mostrar la animación.
   - Ensamblar GIF con PIL (`frames[0].save(..., save_all=True, append_images=..., duration=100, loop=0)`),
     tamaño 400x300 (reescalar con NEAREST para look pixel).
   - Los GIFs deben MOSTRAR el comportamiento del paso (en el 5 debe verse el texto, en el 8 el cambio
     de área, en el 9 el menú, en el 10 la animación de caminar).
4. Verifica visualmente 2-3 GIFs leyendo el archivo (Read tool soporta imágenes; lee al menos el primer frame
   exportado como png si el GIF no se puede leer directo).
