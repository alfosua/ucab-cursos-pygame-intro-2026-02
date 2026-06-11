// Datos del curso: "Curso de Introducción a Pygame" (UCAB)
// Tema: clon de The Legend of Zelda (NES)

const COURSE = {
  title: "Curso de Introducción a Pygame",
  author: "Alfonso Suarez",
  chapters: [
    {
      id: 1,
      title: "1. Introducción",
      topics: [
        {
          id: 1,
          num: 1,
          title: "¿Qué es Pygame?",
          description: "Qué es Pygame y el objetivo del taller.",
          slides: [
            {
              title: "¿Qué es Pygame?",
              logo: "img/icons/pygame.png",
              content: [
                "Pygame es una librería gratuita y de código abierto para Python, diseñada para facilitar el desarrollo de videojuegos en 2D.",
                "Funciona sobre SDL2, una librería multiplataforma que da acceso al teclado, la pantalla y el sonido.",
                "Es ideal para aprender: con muy pocas líneas de Python ya tienes una ventana con gráficos en movimiento.",
              ],
            },
            {
              title: "¿Cuál es el objetivo del taller?",
              content: [
                "Nuestro objetivo es crear un pequeño clon de **The Legend of Zelda de NES (1986)**, para aprender las bases de Pygame.",
                "En 2-3 horas construiremos paso a paso un mini-juego con mapa, movimiento, colisiones, texto, música, áreas, menú, animaciones, ondas y luces.",
                "nota: No necesitas experiencia previa con videojuegos, solo Python básico.",
              ],
              gallery: [
                { src: "img/zelda/zelda-title.gif", caption: "Pantalla de título" },
                { src: "img/zelda/zelda-cave.gif", caption: '"It\'s dangerous to go alone!"' },
                { src: "img/zelda/zelda-overworld.gif", caption: "Exploración de Hyrule" },
              ],
            },
            {
              title: "Así se verá el resultado",
              content: [
                "Este es el resultado final que construiremos paso a paso durante el taller, capa por capa.",
              ],
              gif: "img/steps/final.gif",
              caption: "Resultado final: menú → Hyrule (overworld) → cueva con linterna (mazmorra).",
            },
          ],
        },
        {
          id: 2,
          num: 2,
          title: "Preparando el Entorno",
          description: "Software requerido e instalación de Pygame.",
          slides: [
            {
              title: "Requerimientos para empezar",
              content: ["Antes de comenzar, necesitas instalar las siguientes herramientas:"],
              cards: [
                { name: "Visual Studio Code", icon: "img/icons/vscode.png", description: "Editor de código liviano y extensible.", url: "https://code.visualstudio.com/" },
                { name: "Python 3+", icon: "img/icons/python.png", description: "Lenguaje de programación que usaremos.", url: "https://www.python.org/" },
                { name: "Pygame 2", icon: "img/icons/pygame.png", description: "Librería para crear videojuegos en 2D.", url: "https://www.pygame.org/" },
              ],
            },
            {
              title: "Instalar Pygame en un entorno de desarrollo",
              content: ["Abre una terminal en la carpeta de tu proyecto y ejecuta:"],
              terminal: `# Crear entorno virtual de Python (Opcional)
$ python -m venv .venv
# Activar entorno en Windows
$ .\\.venv\\Scripts\\activate
# Activar entorno en Linux
$ source .venv/bin/activate

# Instalar pygame con PIP
$ pip install pygame
# o también
$ python -m pip install pygame`,
            },
            {
              title: "Verificar la instalación",
              content: [
                "Para confirmar que todo quedó bien instalado, ejecuta uno de estos comandos:",
              ],
              terminal: `$ python -m pygame --version
pygame 2.6.1 (SDL 2.30.10, Python 3.12.3)

$ python -c "import pygame"
pygame 2.6.1 (SDL 2.30.10, Python 3.12.3)
Hello from the pygame community. https://www.pygame.org/contribute.html`,
            },
          ],
        },
        {
          id: 3,
          num: 3,
          title: "Assets del Curso",
          description: "Descarga los sprites, fuente y música del taller.",
          slides: [
            {
              title: "Assets a usar",
              content: [
                "Estos son los archivos que usaremos durante todo el taller. Descomprime el zip y deja la carpeta `assets/` junto a tu archivo `main.py`.",
              ],
              assetGrid: [
                { file: "player.png", img: "img/assets/player.png", purpose: "el héroe" },
                { file: "link_sheet.png", img: "img/assets/link_sheet.png", purpose: "animación" },
                { file: "enemy.png", img: "img/assets/enemy.png", purpose: "enemigo" },
                { file: "heart.png", img: "img/assets/heart.png", purpose: "vida" },
                { file: "overworld.png", img: "img/assets/overworld.png", purpose: "mapa de Hyrule" },
                { file: "dungeon.png", img: "img/assets/dungeon.png", purpose: "mazmorra" },
                { file: "font.ttf", purpose: "fuente retro", kind: "font" },
                { file: "music.mp3", purpose: "música de fondo", kind: "audio" },
              ],
              download: {
                href: "downloads/zelda-assets.zip",
                label: "Descargar zelda-assets.zip",
                hint: "Incluye todos los sprites, la fuente y la música del curso.",
              },
            },
            {
              title: "Estructura del proyecto",
              content: ["Tu carpeta de proyecto debería quedar así:"],
              terminal: `mi-juego/
├── assets/
│   ├── overworld.png  ├── dungeon.png
│   ├── player.png     ├── link_sheet.png
│   ├── enemy.png      ├── heart.png
│   ├── font.ttf       └── music.mp3
└── main.py`,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "2. La Ventana del Juego",
      topics: [
        {
          id: 4,
          num: 4,
          title: "Paso 1: Iniciar el Juego",
          description: "Ventana, ciclo de juego y FPS.",
          file: "01_inicio.py",
          slides: [
            {
              title: "Las 3 partes de todo juego de Pygame",
              content: [
                "Todo juego de Pygame tiene 3 partes: **inicialización**, **ciclo principal** y **liberación de recursos**.",
                "El ciclo principal se repite ~60 veces por segundo (FPS) y en cada vuelta:",
                "1. Procesa eventos (teclado, mouse, cerrar ventana).",
                "2. Actualiza el estado del juego (posiciones, lógica).",
                "3. Dibuja todo en la pantalla.",
              ],
            },
            {
              title: "Inicialización",
              content: [
                "Importamos pygame, lo inicializamos y creamos la ventana de 800x600 con un título.",
                "El `Clock` nos servirá para controlar los FPS.",
              ],
              step: "01_inicio.py",
              code: `# Inicializar pygame y configurar la ventana
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Zelda")
clock = pygame.time.Clock()

# Ciclo principal del juego
running = True
while running:
    # ...`,
            },
            {
              title: "El ciclo principal",
              content: [
                "`clock.tick(60)` limita el juego a 60 FPS y nos da `dt`, el tiempo (en segundos) desde el último frame.",
                "Procesamos los eventos: si el usuario cierra la ventana (`pygame.QUIT`), terminamos el ciclo.",
                "Pintamos el fondo de verde oscuro y mostramos el resultado con `flip()`.",
              ],
              step: "01_inicio.py",
              code: `while running:
    # Limitar cuadros por segundo a 60 FPS
    dt = clock.tick(60) / 1000  # tiempo en segundos desde el último frame

    # Manejar eventos
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Dibujar el fondo
    screen.fill("darkgreen")

    # Actualizar la pantalla
    pygame.display.flip()`,
            },
            {
              title: "Liberar recursos al salir",
              content: [
                "Cuando `running` se vuelve `False`, salimos del `while` y llamamos a `pygame.quit()` para liberar los recursos de SDL2.",
              ],
              step: "01_inicio.py",
              code: `    # ... (al final del ciclo principal)
    pygame.display.flip()

# Después del ciclo principal
pygame.quit()`,
            },
            {
              title: "¡Tu primer programa de Pygame!",
              content: [
                "Si ejecutas `main.py` deberías ver una ventana verde de 800x600.",
                "¡Felicidades, ya tienes una ventana funcionando con un ciclo de juego a 60 FPS!",
              ],
              gif: "img/steps/step01.gif",
              caption: "Una ventana verde de 800x600… ¡tu primer programa de Pygame!",
            },
          ],
        },
        {
          id: 5,
          num: 5,
          title: "Paso 2: Dibujar Imágenes",
          description: "Superficies, load, scale y blit.",
          file: "02_imagenes.py",
          slides: [
            {
              title: "Cargar y dibujar imágenes",
              content: [
                "Las imágenes (`Surface`) se cargan **una sola vez**, antes del ciclo principal, y se escalan al tamaño que vamos a usar.",
                "En cada frame, las dibujamos sobre la pantalla con `screen.blit(imagen, posición)`.",
                "`blit` significa \"pegar\" una imagen sobre otra superficie en una posición (x, y).",
              ],
            },
            {
              title: "Cargar las imágenes",
              content: [
                "Cargamos el fondo del overworld y lo escalamos a 800x600 (el tamaño de la ventana).",
                "Cargamos el sprite del jugador y lo escalamos a 48x48 píxeles.",
              ],
              step: "02_imagenes.py",
              code: `# Cargar las imágenes (escaladas al tamaño que vamos a usar)
# ... (antes del ciclo principal)
background_img = pygame.image.load("assets/overworld.png")
background_img = pygame.transform.scale(background_img, (800, 600))
player_img = pygame.image.load("assets/player.png")
player_img = pygame.transform.scale(player_img, (48, 48))`,
            },
            {
              title: "Dibujarlas en cada frame",
              content: [
                "Primero pegamos el fondo en `(0, 0)` (esquina superior izquierda) y luego al jugador en una posición fija.",
                "El orden importa: lo que se dibuja después queda **encima**.",
              ],
              step: "02_imagenes.py",
              code: `    # Dibujar el fondo
    screen.fill("darkgreen")

    # Dibujar el fondo del overworld y al jugador
    # ... (dentro del ciclo principal, sección de dibujo)
    screen.blit(background_img, (0, 0))
    screen.blit(player_img, (376, 400))

    # Actualizar la pantalla
    pygame.display.flip()`,
            },
            {
              title: "¿Cómo ubica Pygame las cosas?",
              content: [
                "Pygame usa un sistema de coordenadas con el origen **(0, 0)** en la esquina **superior izquierda**.",
                "El eje X crece hacia la derecha y el eje Y crece hacia **ABAJO**.",
                "Mueve el mouse o usa las flechas del teclado sobre la cuadrícula para ver cómo cambian las coordenadas (x, y) de Link.",
              ],
              interactive: "coords-demo",
            },
            {
              title: "Resultado",
              content: [
                "Ahora tu ventana muestra el mapa del overworld con Link parado en el centro de la pantalla.",
              ],
              gif: "img/steps/step02.gif",
              caption: "El fondo del overworld y Link dibujados con blit().",
            },
          ],
        },
        {
          id: 6,
          num: 6,
          title: "Paso 3: Movimiento por Teclado",
          description: "key.get_pressed y movimiento con delta time.",
          file: "03_movimiento.py",
          slides: [
            {
              title: "Moviendo al jugador",
              content: [
                "Guardamos la posición del jugador en variables `player_x` y `player_y`.",
                "En cada frame leemos qué teclas están presionadas con `pygame.key.get_pressed()`.",
                "Multiplicamos el desplazamiento por `dt` (delta time) para que la velocidad **no dependa de los FPS**: a más FPS, `dt` es más pequeño, así que el movimiento total por segundo es constante.",
              ],
            },
            {
              title: "Variables de posición y velocidad",
              content: [
                "Definimos la posición inicial del jugador y su velocidad en píxeles por segundo.",
              ],
              step: "03_movimiento.py",
              code: `# Posición y velocidad del jugador
# ... (antes del ciclo principal)
player_x = 376
player_y = 400
player_speed = 200`,
            },
            {
              title: "Leer el teclado y mover",
              content: [
                "`pygame.key.get_pressed()` devuelve el estado de **todas** las teclas en este frame.",
                "Por cada dirección, si la tecla está presionada, sumamos o restamos `player_speed * dt` a la posición.",
              ],
              step: "03_movimiento.py",
              code: `    # Leer las teclas presionadas y mover al jugador
    # ... (dentro del ciclo principal, después de manejar eventos)
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_x -= player_speed * dt
    if keys[pygame.K_RIGHT]:
        player_x += player_speed * dt
    if keys[pygame.K_UP]:
        player_y -= player_speed * dt
    if keys[pygame.K_DOWN]:
        player_y += player_speed * dt`,
            },
            {
              title: "Dibujar al jugador en su posición",
              content: [
                "Ahora el `blit` del jugador usa `player_x` y `player_y` en vez de una posición fija.",
              ],
              step: "03_movimiento.py",
              code: `    # Dibujar el fondo del overworld y al jugador
    # ... (sección de dibujo)
    screen.blit(background_img, (0, 0))
    screen.blit(player_img, (player_x, player_y))  # modificado`,
            },
            {
              title: "Resultado",
              content: [
                "Ahora puedes mover a Link por toda la pantalla usando las flechas del teclado.",
                "Nota: todavía puede salirse de la ventana, eso lo arreglaremos en el siguiente paso.",
              ],
              gif: "img/steps/step03.gif",
              caption: "Movimiento del jugador con las flechas del teclado.",
            },
          ],
        },
      ],
    },
    {
      id: 3,
      title: "3. Interacción",
      topics: [
        {
          id: 7,
          num: 7,
          title: "Paso 4: Sistema de Colisiones",
          description: "Bordes de ventana y pygame.Rect.",
          file: "04_colisiones.py",
          slides: [
            {
              title: "Dos tipos de colisión",
              content: [
                "Vamos a resolver dos problemas distintos de colisión:",
                "1. **No salirse de la ventana**: limitamos (clamp) la posición del jugador a los bordes de la pantalla.",
                "2. **Detectar una zona**: usamos `pygame.Rect` y `colliderect()` para saber si el jugador está sobre la entrada de la cueva.",
              ],
            },
            {
              title: "Limitar al jugador a la pantalla (clamp)",
              content: [
                "Después de mover al jugador, revisamos si se salió de algún borde y, si es así, lo \"pegamos\" al borde.",
                "`800 - 48` y `600 - 48` son el ancho/alto de la ventana menos el tamaño del sprite (48x48).",
              ],
              step: "04_colisiones.py",
              code: `    # No dejar que el jugador salga de la pantalla (clamp con los bordes)
    # ... (después de mover al jugador con el teclado)
    if player_x < 0:
        player_x = 0
    if player_x > 800 - 48:
        player_x = 800 - 48
    if player_y < 0:
        player_y = 0
    if player_y > 600 - 48:
        player_y = 600 - 48`,
            },
            {
              title: "Detectar la entrada de la cueva",
              content: [
                "Creamos un `pygame.Rect` para la cueva y otro para el jugador en cada frame.",
                "`colliderect()` devuelve `True` si los dos rectángulos se superponen.",
              ],
              step: "04_colisiones.py",
              code: `# Zona de la cueva (entrada)
# ... (antes del ciclo principal)
cave_rect = pygame.Rect(200, 54, 50, 55)

# ...

    # Revisar si el jugador está tocando la entrada de la cueva
    # ... (dentro del ciclo principal, después del clamp)
    player_rect = pygame.Rect(player_x, player_y, 48, 48)
    if player_rect.colliderect(cave_rect):
        print("¡Estás en la entrada de la cueva!")`,
            },
            {
              title: "Dibujar el rectángulo para depurar",
              content: [
                "Mientras desarrollamos, es útil **ver** dónde está el rectángulo de colisión.",
                "`pygame.draw.rect(superficie, color, rect, grosor)` dibuja el contorno del rectángulo.",
              ],
              step: "04_colisiones.py",
              code: `    # Dibujar el rect rojo de depuración de la cueva
    # ... (al final de la sección de dibujo, después de dibujar al jugador)
    pygame.draw.rect(screen, "red", cave_rect, 3)`,
            },
            {
              title: "Pruébalo tú mismo",
              content: [
                "Mueve el rectángulo verde con las flechas del teclado (o arrástralo con el mouse) y observa cuándo `colliderect()` devuelve `True`.",
              ],
              interactive: "collision-demo",
            },
            {
              title: "Resultado",
              content: [
                "Ahora Link no puede salir de la pantalla, y el rectángulo rojo marca la entrada de la cueva.",
              ],
              gif: "img/steps/step04.gif",
              caption: "Colisión con los bordes y zona de la cueva marcada en rojo.",
            },
          ],
        },
        {
          id: 8,
          num: 8,
          title: "Paso 5: Texto en Pantalla",
          description: "Fuentes TTF y render de texto.",
          file: "05_texto.py",
          slides: [
            {
              title: "Mostrando texto",
              content: [
                "`pygame.font` permite cargar una fuente TTF y renderizar texto.",
                "`font.render(texto, antialias, color)` crea una **Surface** (imagen) con el texto dibujado, que luego se pinta con `blit()` como cualquier otra imagen.",
                "Por eficiencia, el texto que no cambia se renderiza **una sola vez**, antes del ciclo principal.",
              ],
            },
            {
              title: "Cargar la fuente y pre-renderizar el texto",
              content: [
                "Inicializamos el módulo de fuentes, cargamos `font.ttf` a tamaño 16 y creamos la Surface del aviso de la cueva.",
              ],
              step: "05_texto.py",
              code: `pygame.init()
pygame.font.init()  # ... (junto a la inicialización de pygame)

# ...

# Crear la fuente y pre-renderizar el texto del aviso
# ... (antes del ciclo principal)
font = pygame.font.Font("assets/font.ttf", 16)
cave_text = font.render("¡Una cueva misteriosa!", True, "white")`,
            },
            {
              title: "Mostrar el texto solo cerca de la cueva",
              content: [
                "Creamos la bandera `near_cave` **antes del ciclo** (para que exista desde el primer frame) y dentro del ciclo guardamos si el jugador está tocando la zona de la cueva.",
                "Solo dibujamos `cave_text` cuando `near_cave` es `True`. Ya no necesitamos el rectángulo rojo de depuración, así que lo comentamos.",
              ],
              step: "05_texto.py",
              code: `# Bandera para saber si el jugador está cerca de la cueva
# ... (antes del ciclo principal)
near_cave = False

    # Revisar si el jugador está tocando la entrada de la cueva
    # ... (dentro del ciclo principal, sección de lógica)
    player_rect = pygame.Rect(player_x, player_y, 48, 48)
    if player_rect.colliderect(cave_rect):
        near_cave = True
    else:
        near_cave = False

    # ...

    # pygame.draw.rect(screen, "red", cave_rect, 3)  # ya no lo necesitamos

    # Mostrar el aviso de la cueva si el jugador está cerca
    # ... (al final de la sección de dibujo)
    if near_cave:
        screen.blit(cave_text, (220, 130))`,
            },
            {
              title: "Resultado",
              content: [
                "Acércate a la entrada de la cueva y verás aparecer el mensaje \"¡Una cueva misteriosa!\" en pantalla.",
              ],
              gif: "img/steps/step05.gif",
              caption: "El texto aparece solo cuando Link está cerca de la cueva.",
            },
          ],
        },
        {
          id: 9,
          num: 9,
          title: "Paso 6: Música de Fondo",
          description: "pygame.mixer y música en loop.",
          file: "06_musica.py",
          slides: [
            {
              title: "Música con pygame.mixer",
              content: [
                "El módulo `pygame.mixer` se encarga del audio.",
                "`pygame.mixer.music` está pensado para **una sola pista** larga, que se va leyendo (streaming) en vez de cargarse completa en memoria. Ideal para música de fondo.",
              ],
            },
            {
              title: "Cargar y reproducir la música en loop",
              content: [
                "Inicializamos el mixer, cargamos el archivo, ajustamos el volumen (0.0 a 1.0) y la reproducimos.",
                "`play(-1)` reproduce la música **en loop infinito**.",
              ],
              step: "06_musica.py",
              code: `pygame.mixer.init()  # ... (junto a la inicialización de pygame)

# ...

# Cargar y reproducir la música de fondo en bucle
# ... (antes del ciclo principal)
pygame.mixer.music.load("assets/music.mp3")
pygame.mixer.music.set_volume(0.5)
pygame.mixer.music.play(-1)`,
            },
            {
              title: "Resultado",
              content: [
                "Al ejecutar el juego ahora deberías escuchar la música de fondo en bucle.",
                "El GIF no suena — ejecútalo tú 😄",
              ],
              gif: "img/steps/step06.gif",
              caption: "El GIF no suena — ejecútalo tú 😄",
            },
          ],
        },
        {
          id: 10,
          num: 10,
          title: "Paso 7: Manejo de Eventos",
          description: "Eventos discretos vs. teclas mantenidas.",
          file: "07_eventos.py",
          slides: [
            {
              title: "Eventos vs. teclas mantenidas",
              content: [
                "`pygame.key.get_pressed()` nos da un estado **continuo**: \"esta tecla está mantenida presionada ahora mismo\".",
                "Los eventos `KEYDOWN` representan una **pulsación única**: \"esta tecla se acaba de presionar\".",
                "Queremos que presionar ENTER frente a la cueva dispare **una sola acción** (entrar), no que se repita mientras se mantiene presionada.",
              ],
            },
            {
              title: "Detectar ENTER cerca de la cueva",
              content: [
                "Dentro del bucle de eventos, revisamos si el evento es `KEYDOWN`, si la tecla es `K_RETURN` (Enter) **y** si `near_cave` es `True`.",
              ],
              step: "07_eventos.py",
              code: `    # Manejar eventos
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        # Evento discreto: presionar ENTER cerca de la cueva
        # ... (dentro del for de eventos)
        if event.type == pygame.KEYDOWN and event.key == pygame.K_RETURN and near_cave:
            print("Entrando a la cueva...")`,
            },
            {
              title: "Resultado",
              content: [
                "Acércate a la cueva y presiona Enter: verás el mensaje \"Entrando a la cueva...\" en la consola, una sola vez por cada pulsación.",
              ],
              gif: "img/steps/step07.gif",
              caption: "Presionar Enter cerca de la cueva dispara un evento discreto.",
            },
          ],
        },
      ],
    },
    {
      id: 4,
      title: "4. Estructura del Juego",
      topics: [
        {
          id: 11,
          num: 11,
          title: "Paso 8: Múltiples Áreas (FSM)",
          description: "Máquina de estados finitos: overworld y mazmorra.",
          file: "08_areas.py",
          slides: [
            {
              title: "Máquina de estados finitos (FSM)",
              content: [
                "Una **máquina de estados finitos (FSM)** es un patrón en el que el programa está en **un estado a la vez** y se mueve entre estados mediante **transiciones**.",
                "En nuestro juego, los estados son las áreas: `overworld` y `dungeon` (mazmorra).",
                "Toda la lógica y el dibujo se ramifican según `current_area`.",
              ],
            },
            {
              title: "Explora la FSM",
              content: [
                "Haz clic en los botones para disparar las transiciones y observa cómo cambia el estado activo.",
              ],
              interactive: "fsm-demo",
            },
            {
              title: "Cargar los recursos de la mazmorra",
              content: [
                "Cargamos el fondo de la mazmorra y el sprite del enemigo, igual que hicimos con el overworld.",
                "Definimos constantes para los nombres de los estados y una variable `current_area` que indica el estado actual.",
              ],
              step: "08_areas.py",
              code: `# Cargar el fondo de la mazmorra y el enemigo
# ... (junto a la carga de las demás imágenes)
dungeon_img = pygame.image.load("assets/dungeon.png")
dungeon_img = pygame.transform.scale(dungeon_img, (800, 600))
enemy_img = pygame.image.load("assets/enemy.png")
enemy_img = pygame.transform.scale(enemy_img, (48, 48))

# ...

# Estados del juego (áreas)
# ... (antes del ciclo principal)
AREA_OVERWORLD = "overworld"
AREA_DUNGEON = "dungeon"
current_area = AREA_OVERWORLD`,
            },
            {
              title: "Transición de entrada a la cueva",
              content: [
                "Si presionamos Enter cerca de la cueva estando en el overworld, cambiamos `current_area` a `AREA_DUNGEON` y reposicionamos al jugador en la entrada de la mazmorra.",
                "También definimos `exit_rect`, la zona de la puerta para volver al overworld.",
              ],
              step: "08_areas.py",
              code: `# Zona de salida en la mazmorra (puerta izquierda)
# ... (junto a cave_rect, antes del ciclo principal)
exit_rect = pygame.Rect(0, 250, 40, 120)

# ...

        # Evento discreto: presionar ENTER cerca de la cueva para entrar
        # ... (dentro del for de eventos)
        if event.type == pygame.KEYDOWN and event.key == pygame.K_RETURN and near_cave:
            if current_area == AREA_OVERWORLD:
                print("Entrando a la cueva...")
                current_area = AREA_DUNGEON
                player_x, player_y = 376, 480`,
            },
            {
              title: "Lógica según el área",
              content: [
                "La lógica de cada frame (¿estoy cerca de la cueva? ¿llegué a la salida?) se ramifica con `if current_area == ... elif ...`.",
                "Así cada área tiene su propia lógica sin mezclarse.",
              ],
              step: "08_areas.py",
              code: `    # Lógica según el área actual
    # ... (dentro del ciclo principal, después de calcular player_rect)
    if current_area == AREA_OVERWORLD:
        if player_rect.colliderect(cave_rect):
            near_cave = True
        else:
            near_cave = False
    elif current_area == AREA_DUNGEON:
        if player_rect.colliderect(exit_rect):
            print("Saliendo de la mazmorra...")
            current_area = AREA_OVERWORLD
            player_x, player_y = 220, 140`,
            },
            {
              title: "Dibujo según el área",
              content: [
                "El dibujado también se ramifica: cada área pinta su propio fondo, personajes y elementos.",
              ],
              step: "08_areas.py",
              code: `    # Dibujo según el área actual
    # ... (sección de dibujo, después de screen.fill)
    if current_area == AREA_OVERWORLD:
        screen.blit(background_img, (0, 0))
        screen.blit(player_img, (player_x, player_y))

        # pygame.draw.rect(screen, "red", cave_rect, 3)  # ya no lo necesitamos

        # Mostrar el aviso de la cueva si el jugador está cerca
        if near_cave:
            screen.blit(cave_text, (220, 130))
    elif current_area == AREA_DUNGEON:
        screen.blit(dungeon_img, (0, 0))
        screen.blit(enemy_img, (376, 150))
        screen.blit(player_img, (player_x, player_y))`,
            },
            {
              title: "Resultado",
              content: [
                "Entra a la cueva con Enter y aparecerás en la mazmorra; camina hacia la puerta izquierda para volver al overworld.",
              ],
              gif: "img/steps/step08.gif",
              caption: "Transición entre el overworld y la mazmorra.",
            },
          ],
        },
        {
          id: 12,
          num: 12,
          title: "Paso 9: Menú Principal",
          description: "Menú con botones controlado por teclado.",
          file: "09_menu.py",
          slides: [
            {
              title: "El menú es solo otro estado",
              content: [
                "El menú principal es **otro estado más** de la FSM: `AREA_MENU`.",
                "Lo representamos con una lista de opciones (`menu_options`) y un índice de la opción seleccionada (`selected_option`).",
                "El juego ahora **arranca** en `AREA_MENU` en vez de en el overworld.",
              ],
            },
            {
              title: "Estado y datos del menú",
              content: [
                "Agregamos la constante `AREA_MENU`, la lista de opciones, el índice seleccionado y una fuente más grande para el título.",
              ],
              step: "09_menu.py",
              code: `# Estados del juego (áreas)
# ... (antes del ciclo principal)
AREA_OVERWORLD = "overworld"
AREA_DUNGEON = "dungeon"
AREA_MENU = "menu"
current_area = AREA_MENU  # modificado: ahora arranca en el menú

# Crear las fuentes y pre-renderizar el texto del aviso
font = pygame.font.Font("assets/font.ttf", 16)
title_font = pygame.font.Font("assets/font.ttf", 32)  # nueva fuente más grande
cave_text = font.render("¡Una cueva misteriosa!", True, "white")

# ...

# Opciones del menú principal
menu_options = ["Jugar", "Salir"]
selected_option = 0`,
            },
            {
              title: "Eventos del menú",
              content: [
                "Con las flechas arriba/abajo cambiamos `selected_option`, usando `%` (módulo) para que el índice dé la vuelta al llegar al final o al principio.",
                "Con Enter, ejecutamos la opción seleccionada: \"Jugar\" pasa al overworld, \"Salir\" termina el juego.",
              ],
              step: "09_menu.py",
              code: `        # Eventos del menú principal
        # ... (dentro del for de eventos)
        if event.type == pygame.KEYDOWN and current_area == AREA_MENU:
            if event.key == pygame.K_DOWN:
                selected_option = (selected_option + 1) % len(menu_options)
            if event.key == pygame.K_UP:
                selected_option = (selected_option - 1) % len(menu_options)
            if event.key == pygame.K_RETURN:
                if menu_options[selected_option] == "Jugar":
                    current_area = AREA_OVERWORLD
                elif menu_options[selected_option] == "Salir":
                    running = False`,
            },
            {
              title: "Dibujar el menú",
              content: [
                "Pintamos un fondo negro, el título \"LA LEYENDA DE ZELDA\" en dorado y centrado, y la lista de opciones.",
                "La opción seleccionada se dibuja en verde con el prefijo `\"> \"`; las demás en blanco.",
              ],
              step: "09_menu.py",
              code: `    # Dibujo según el área actual
    # ... (al inicio de la sección de dibujo, antes de los demás elif)
    if current_area == AREA_MENU:
        # Fondo negro y título centrado
        screen.fill("black")
        title_text = title_font.render("LA LEYENDA DE ZELDA", True, "gold")
        screen.blit(title_text, title_text.get_rect(center=(400, 180)))

        # Dibujar las opciones del menú (la seleccionada en verde con prefijo)
        option_y = 300
        for index in range(len(menu_options)):
            if index == selected_option:
                option_text = font.render("> " + menu_options[index], True, "green")
            else:
                option_text = font.render(menu_options[index], True, "white")
            screen.blit(option_text, (350, option_y))
            option_y += 50`,
            },
            {
              title: "Resultado",
              content: [
                "Al iniciar el juego verás el menú principal; usa las flechas para elegir y Enter para confirmar.",
              ],
              gif: "img/steps/step09.gif",
              caption: "Menú principal navegable con el teclado.",
            },
          ],
        },
      ],
    },
    {
      id: 5,
      title: "5. Dando vida",
      topics: [
        {
          id: 13,
          num: 13,
          title: "Paso 10: Animaciones",
          description: "Spritesheets y animación por frames.",
          file: "10_animaciones.py",
          slides: [
            {
              title: "Spritesheets y subsurface",
              content: [
                "Una **spritesheet** es una sola imagen que contiene varios frames de animación, organizados en una cuadrícula.",
                "Con `surface.subsurface((x, y, ancho, alto))` recortamos un fragmento de la imagen sin copiar los píxeles.",
                "Para animar, alternamos entre los frames recortados usando un temporizador.",
              ],
            },
            {
              title: "Explora la spritesheet de Link",
              content: [
                "Cada fila de 16x16 corresponde a una dirección (abajo, arriba, derecha, izquierda) con 2 frames de caminado.",
                "Usa el D-pad para elegir la dirección y presiona ▶ para ver la animación de caminar.",
              ],
              interactive: "sprite-demo",
            },
            {
              title: "Cargar la spritesheet",
              content: [
                "Cargamos `link_sheet.png`. Sobre ella recortaremos los frames de cada dirección con `subsurface`.",
              ],
              step: "10_animaciones.py",
              code: `# Cargar la hoja de animación del jugador
# ... (junto a la carga de las demás imágenes, antes del ciclo principal)
sheet = pygame.image.load("assets/link_sheet.png")
frames = {}`,
            },
            {
              title: "Recortar los frames: abajo y arriba",
              content: [
                "Construimos el diccionario `frames` con 2 frames por dirección, recortados con `subsurface` y escalados a 48x48.",
                "Empezamos por las filas \"abajo\" (y=0) y \"arriba\" (y=16).",
              ],
              step: "10_animaciones.py",
              code: `# ... (justo después de cargar sheet, antes del ciclo principal)
frames["down"] = [
    pygame.transform.scale(sheet.subsurface((0, 0, 16, 16)), (48, 48)),
    pygame.transform.scale(sheet.subsurface((16, 0, 16, 16)), (48, 48)),
]
frames["up"] = [
    pygame.transform.scale(sheet.subsurface((0, 16, 16, 16)), (48, 48)),
    pygame.transform.scale(sheet.subsurface((16, 16, 16, 16)), (48, 48)),
]`,
            },
            {
              title: "Recortar los frames: derecha e izquierda",
              content: [
                "Completamos el diccionario `frames` con las filas \"derecha\" (y=32) e \"izquierda\" (y=48).",
              ],
              step: "10_animaciones.py",
              code: `# ... (justo después de frames["up"], antes del ciclo principal)
frames["right"] = [
    pygame.transform.scale(sheet.subsurface((0, 32, 16, 16)), (48, 48)),
    pygame.transform.scale(sheet.subsurface((16, 32, 16, 16)), (48, 48)),
]
frames["left"] = [
    pygame.transform.scale(sheet.subsurface((0, 48, 16, 16)), (48, 48)),
    pygame.transform.scale(sheet.subsurface((16, 48, 16, 16)), (48, 48)),
]`,
            },
            {
              title: "Variables de animación",
              content: [
                "Necesitamos saber: hacia dónde mira el jugador (`player_dir`), qué frame toca mostrar (`frame_index`), cuánto tiempo lleva ese frame (`frame_timer`) y si el jugador se está moviendo (`moving`).",
              ],
              step: "10_animaciones.py",
              code: `# Variables para la animación del jugador
# ... (antes del ciclo principal, junto a player_x/player_y)
player_dir = "down"
frame_index = 0
frame_timer = 0
FRAME_TIME = 0.15
moving = False`,
            },
            {
              title: "Actualizar dirección al moverse",
              content: [
                "Cada `if` de movimiento ahora también actualiza `player_dir` y marca `moving = True`.",
              ],
              step: "10_animaciones.py",
              code: `    # Leer las teclas presionadas y mover al jugador
    # ... (dentro del ciclo principal, reemplaza el bloque de movimiento)
    moving = False
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_x -= player_speed * dt
        player_dir = "left"  # modificado
        moving = True  # modificado
    if keys[pygame.K_RIGHT]:
        player_x += player_speed * dt
        player_dir = "right"  # modificado
        moving = True  # modificado
    if keys[pygame.K_UP]:
        player_y -= player_speed * dt
        player_dir = "up"  # modificado
        moving = True  # modificado
    if keys[pygame.K_DOWN]:
        player_y += player_speed * dt
        player_dir = "down"  # modificado
        moving = True  # modificado`,
            },
            {
              title: "Avanzar el frame y dibujar",
              content: [
                "Si el jugador se mueve, acumulamos `dt` en `frame_timer`; al superar `FRAME_TIME` (0.15s), pasamos al siguiente frame con `% 2`.",
                "Si no se mueve, mostramos siempre el frame 0 (de pie). Finalmente dibujamos `frames[player_dir][frame_index]` en vez del sprite estático — **en las dos áreas**: overworld y mazmorra.",
              ],
              step: "10_animaciones.py",
              code: `    # Animación: avanzar de frame solo si el jugador se está moviendo
    # ... (dentro del ciclo principal, después del bloque de movimiento)
    if moving:
        frame_timer += dt
        if frame_timer >= FRAME_TIME:
            frame_timer = 0
            frame_index = (frame_index + 1) % 2
    else:
        frame_index = 0

    # ...

    elif current_area == AREA_OVERWORLD:
        screen.blit(background_img, (0, 0))
        screen.blit(frames[player_dir][frame_index], (player_x, player_y))  # modificado

    # ... (y también en el dibujo de la mazmorra)
    elif current_area == AREA_DUNGEON:
        # ...
        screen.blit(frames[player_dir][frame_index], (player_x, player_y))  # modificado`,
            },
            {
              title: "Resultado",
              content: [
                "¡Listo! Ahora Link camina animado en las 4 direcciones.",
              ],
              gif: "img/steps/step10.gif",
              caption: "Link caminando animado en las 4 direcciones.",
            },
          ],
        },
        {
          id: 14,
          num: 14,
          title: "Paso 11: Movimiento Ondulante",
          description: "Ondas con seno y coseno para dar vida.",
          file: "11_trigonometria.py",
          slides: [
            {
              title: "Seno, coseno y vaivén",
              content: [
                "Las funciones `math.sin()` y `math.cos()` oscilan suavemente entre **-1 y 1**.",
                "Si multiplicamos ese valor por una **amplitud** (en píxeles), obtenemos un vaivén suave de ida y vuelta.",
                "El **tiempo acumulado** controla la fase: es lo que hace que el vaivén avance frame a frame. Perfecto para hacer flotar u ondular elementos del juego.",
              ],
            },
            {
              title: "Acumular el tiempo transcurrido",
              content: [
                "Importamos `math` y creamos una variable `time_elapsed` que acumula `dt` en cada vuelta del ciclo.",
                "Esta variable será la entrada para nuestras funciones seno/coseno.",
              ],
              step: "11_trigonometria.py",
              code: `# Inicializar pygame y configurar la ventana
import pygame
import math  # para las funciones seno y coseno
# ... (al inicio del archivo)

# ...

# Tiempo acumulado para las ondas
# ... (antes del ciclo principal)
time_elapsed = 0

# ...

while running:
    dt = clock.tick(60) / 1000

    # Acumular el tiempo total transcurrido (usado para las ondas senoidales)
    # ... (dentro del ciclo principal, justo después de calcular dt)
    time_elapsed += dt`,
            },
            {
              title: "Corazón flotante en el overworld",
              content: [
                "Cargamos `heart_img` antes del ciclo principal.",
                "El seno oscila entre -1 y 1; multiplicado por la amplitud (10 píxeles) hace subir y bajar al corazón sobre la cueva.",
              ],
              step: "11_trigonometria.py",
              code: `# Cargar imagen del corazón
# ... (junto a la carga de las demás imágenes, antes del ciclo principal)
heart_img = pygame.image.load("assets/heart.png")
heart_img = pygame.transform.scale(heart_img, (32, 32))

# ...

    elif current_area == AREA_OVERWORLD:
        screen.blit(background_img, (0, 0))
        screen.blit(frames[player_dir][frame_index], (player_x, player_y))
        if near_cave:
            screen.blit(cave_text, (220, 130))

        # Corazón flotante sobre la cueva: el seno oscila entre -1 y 1,
        # multiplicamos por la amplitud (10 píxeles) para subir y bajar,
        # y el tiempo acumulado controla la fase (la velocidad del vaivén)
        # ... (al final del dibujo del área overworld)
        heart_y = 20 + math.sin(time_elapsed * 3) * 10
        screen.blit(heart_img, (209, heart_y))`,
            },
            {
              title: "Enemigo ondulante en la mazmorra",
              content: [
                "El seno controla el movimiento vertical del enemigo (amplitud de 25 píxeles).",
                "El coseno agrega un ligero vaivén horizontal (amplitud de 40 píxeles), con una fase distinta para que no se mueva en línea recta.",
              ],
              step: "11_trigonometria.py",
              code: `    elif current_area == AREA_DUNGEON:
        screen.blit(dungeon_img, (0, 0))

        # El enemigo flota: el seno controla el movimiento vertical
        # (oscila entre -1 y 1, multiplicado por la amplitud de 25 píxeles)
        # y el coseno agrega un ligero vaivén horizontal (amplitud 40)
        # ... (al inicio del dibujo del área dungeon, antes de dibujar al jugador)
        enemy_y = 150 + math.sin(time_elapsed * 4) * 25
        enemy_x = 376 + math.cos(time_elapsed * 2) * 40
        screen.blit(enemy_img, (enemy_x, enemy_y))

        screen.blit(frames[player_dir][frame_index], (player_x, player_y))`,
            },
            {
              title: "Resultado",
              content: [
                "Ahora el corazón flota suavemente sobre la cueva en el overworld, y el enemigo de la mazmorra se mueve ondulando como si flotara.",
              ],
              gif: "img/steps/step11.gif",
              caption: "Corazón flotante sobre la cueva y enemigo ondulante en la mazmorra.",
            },
          ],
        },
        {
          id: 15,
          num: 15,
          title: "Paso 12: Luces y Sombras",
          description: "Efecto linterna en la mazmorra, al estilo shader.",
          file: "12_luces.py",
          slides: [
            {
              title: "Simulando iluminación con BLEND_MULT",
              content: [
                "Podemos simular un efecto de iluminación **multiplicando** colores, sin necesidad de un motor 3D.",
                "Con `special_flags=pygame.BLEND_MULT`, cada píxel de la pantalla se multiplica por el píxel correspondiente de otra superficie:",
                "• Blanco (255,255,255) → el resultado **se ve igual** (multiplicar por 1).",
                "• Gris → el resultado **se oscurece**.",
                "• Negro (0,0,0) → el resultado **se apaga por completo**.",
                "Esta técnica es la base de muchos shaders sencillos de iluminación.",
              ],
            },
            {
              title: "Crear la superficie de oscuridad",
              content: [
                "Creamos una `Surface` del mismo tamaño que la pantalla; sobre ella dibujaremos la \"máscara\" de luz cada frame.",
              ],
              step: "12_luces.py",
              code: `# Superficie de oscuridad para simular iluminación en la mazmorra
# ... (junto a la carga de imágenes, antes del ciclo principal)
darkness = pygame.Surface((800, 600))`,
            },
            {
              title: "Pintar la oscuridad y el círculo de luz",
              content: [
                "En cada frame de la mazmorra: llenamos `darkness` de gris oscuro, dibujamos un círculo gris claro (penumbra) y otro blanco (luz plena) centrados en el jugador.",
                "Luego \"pegamos\" `darkness` sobre la pantalla con `BLEND_MULT`: donde hay blanco se ve igual, donde hay gris se oscurece.",
              ],
              step: "12_luces.py",
              code: `    elif current_area == AREA_DUNGEON:
        screen.blit(dungeon_img, (0, 0))
        # ... (resto del dibujo de la mazmorra: enemigo y jugador)

        # Pintar la oscuridad y "perforar" un círculo de luz alrededor del jugador
        # ... (al final del dibujo del área dungeon, antes de pygame.display.flip())
        darkness.fill((40, 40, 40))
        pygame.draw.circle(darkness, (140, 140, 140), (int(player_x) + 24, int(player_y) + 24), 140)
        pygame.draw.circle(darkness, (255, 255, 255), (int(player_x) + 24, int(player_y) + 24), 80)

        # Multiplicar la oscuridad sobre la pantalla:
        # blanco = se ve igual, gris = se oscurece, negro = no se ve
        screen.blit(darkness, (0, 0), special_flags=pygame.BLEND_MULT)`,
            },
            {
              title: "Resultado",
              content: [
                "¡La mazmorra ahora está a oscuras! Una luz tipo linterna sigue al jugador, iluminando solo lo que está cerca de él.",
              ],
              gif: "img/steps/step12.gif",
              caption: "En la mazmorra, la luz sigue al jugador.",
            },
          ],
        },
      ],
    },
    {
      id: 6,
      title: "6. Cierre",
      topics: [
        {
          id: 16,
          num: 16,
          title: "Conclusión y Contacto",
          description: "Recursos, ideas para seguir y contacto.",
          slides: [
            {
              title: "¿Qué aprendimos?",
              content: [
                "• Paso 1: ventana, ciclo de juego y FPS con `dt`.",
                "• Paso 2: cargar y dibujar imágenes con `blit`.",
                "• Paso 3: mover al jugador con el teclado y `dt`.",
                "• Paso 4: colisiones con bordes y `pygame.Rect`.",
                "• Paso 5: texto con `pygame.font`.",
                "• Paso 6: música de fondo con `pygame.mixer`.",
                "• Paso 7: eventos discretos (`KEYDOWN`) vs. continuos.",
                "• Paso 8: múltiples áreas con una máquina de estados (FSM).",
                "• Paso 9: menú principal navegable.",
                "• Paso 10: animaciones con spritesheets.",
                "• Paso 11: movimiento ondulante con seno y coseno.",
                "• Paso 12: luces y sombras con BLEND_MULT.",
              ],
            },
            {
              title: "Más allá…",
              content: [
                "Algunas ideas para seguir extendiendo tu juego:",
                "• Sistema de vida con `heart.png` y daño al chocar con enemigos.",
                "• Ataques con espada y animaciones de combate.",
                "• Más salas, mazmorras y un mapa más grande.",
                "• Personajes no jugables (NPC) con diálogos.",
                "• Guardar y cargar la partida.",
                "• Efectos de sonido (`pygame.mixer.Sound`) para acciones.",
              ],
            },
            {
              title: "Recursos adicionales",
              content: [
                "Estos sitios tienen sprites, música y fuentes gratuitas para tus propios proyectos:",
              ],
              cards: [
                { name: "The Spriters Resource", icon: "img/icons/spriters.png", description: "Sprites extraídos de videojuegos.", url: "https://www.spriters-resource.com/" },
                { name: "Pixabay", icon: "img/icons/pixabay.png", description: "Imágenes, audio y video libres.", url: "https://pixabay.com/" },
                { name: "OpenGameArt", icon: "img/icons/opengameart.png", description: "Arte 2D/3D para videojuegos.", url: "https://opengameart.org/" },
                { name: "Khinsider", icon: "img/icons/khinsider.png", description: "Música de videojuegos clásicos.", url: "https://downloads.khinsider.com/" },
                { name: "DaFont", icon: "img/icons/dafont.png", description: "Fuentes tipográficas gratuitas.", url: "https://www.dafont.com/" },
              ],
            },
            {
              title: "¡Muchas gracias!",
              content: [
                "Esperamos que hayas disfrutado este recorrido por Pygame y por el mundo de Zelda.",
              ],
              contact: {
                logo: "img/ucab_square.webp",
                name: "Alfonso Suarez",
                subtitle: "Instructor del taller",
                items: [
                  { label: "WhatsApp", value: "+58 424 927 4197", url: "https://wa.me/584249274197", icon: "whatsapp" },
                  { label: "Email", value: "alfosuag@gmail.com", url: "mailto:alfosuag@gmail.com", icon: "email" },
                  { label: "GitHub", value: "github.com/alfosua", url: "https://github.com/alfosua", icon: "github" },
                  { label: "Web", value: "alfosua.com", url: "https://alfosua.com", icon: "web" },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};
