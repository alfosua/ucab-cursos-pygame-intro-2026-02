# Inicializar pygame y configurar la ventana
import pygame
import math  # para las funciones seno y coseno

pygame.init()
pygame.font.init()
pygame.mixer.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Zelda")
clock = pygame.time.Clock()

# Cargar las imágenes (escaladas al tamaño que vamos a usar)
background_img = pygame.image.load("assets/overworld.png")
background_img = pygame.transform.scale(background_img, (800, 600))

# Cargar la hoja de animación del jugador y recortar los 8 frames
sheet = pygame.image.load("assets/link_sheet.png")
frames = {}
frames["down"] = [
    pygame.transform.scale(sheet.subsurface((0, 0, 16, 16)), (48, 48)),
    pygame.transform.scale(sheet.subsurface((16, 0, 16, 16)), (48, 48)),
]
frames["up"] = [
    pygame.transform.scale(sheet.subsurface((0, 16, 16, 16)), (48, 48)),
    pygame.transform.scale(sheet.subsurface((16, 16, 16, 16)), (48, 48)),
]
frames["right"] = [
    pygame.transform.scale(sheet.subsurface((0, 32, 16, 16)), (48, 48)),
    pygame.transform.scale(sheet.subsurface((16, 32, 16, 16)), (48, 48)),
]
frames["left"] = [
    pygame.transform.scale(sheet.subsurface((0, 48, 16, 16)), (48, 48)),
    pygame.transform.scale(sheet.subsurface((16, 48, 16, 16)), (48, 48)),
]

# Cargar el fondo de la mazmorra y el enemigo
dungeon_img = pygame.image.load("assets/dungeon.png")
dungeon_img = pygame.transform.scale(dungeon_img, (800, 600))
enemy_img = pygame.image.load("assets/enemy.png")
enemy_img = pygame.transform.scale(enemy_img, (48, 48))

# Cargar imagen del corazón
heart_img = pygame.image.load("assets/heart.png")
heart_img = pygame.transform.scale(heart_img, (32, 32))

# Posición y velocidad del jugador
player_x = 376
player_y = 400
player_speed = 200

# Variables para la animación del jugador
player_dir = "down"
frame_index = 0
frame_timer = 0
FRAME_TIME = 0.15
moving = False

# Zona de la cueva (entrada) en el overworld
cave_rect = pygame.Rect(200, 54, 50, 55)

# Zona de salida en la mazmorra (puerta izquierda)
exit_rect = pygame.Rect(0, 250, 40, 120)

# Estados del juego (áreas)
AREA_OVERWORLD = "overworld"
AREA_DUNGEON = "dungeon"
AREA_MENU = "menu"
current_area = AREA_MENU

# Crear las fuentes y pre-renderizar el texto del aviso
font = pygame.font.Font("assets/font.ttf", 16)
title_font = pygame.font.Font("assets/font.ttf", 32)
cave_text = font.render("¡Una cueva misteriosa!", True, "white")

# Bandera para saber si el jugador está cerca de la cueva
near_cave = False

# Opciones del menú principal
menu_options = ["Jugar", "Salir"]
selected_option = 0

# Tiempo acumulado para las ondas
time_elapsed = 0

# Cargar y reproducir la música de fondo en bucle
pygame.mixer.music.load("assets/music.mp3")
pygame.mixer.music.set_volume(0.5)
pygame.mixer.music.play(-1)

# Ciclo principal del juego
running = True
while running:
    # Limitar cuadros por segundo a 60 FPS
    dt = clock.tick(60) / 1000  # tiempo en segundos desde el último frame

    # Acumular el tiempo total transcurrido (usado para las ondas senoidales)
    time_elapsed += dt

    # Manejar eventos
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        # Eventos del menú principal
        if event.type == pygame.KEYDOWN and current_area == AREA_MENU:
            if event.key == pygame.K_DOWN:
                selected_option = (selected_option + 1) % len(menu_options)
            if event.key == pygame.K_UP:
                selected_option = (selected_option - 1) % len(menu_options)
            if event.key == pygame.K_RETURN:
                if menu_options[selected_option] == "Jugar":
                    current_area = AREA_OVERWORLD
                elif menu_options[selected_option] == "Salir":
                    running = False
        # Evento discreto: presionar ENTER cerca de la cueva para entrar
        if event.type == pygame.KEYDOWN and event.key == pygame.K_RETURN and near_cave:
            if current_area == AREA_OVERWORLD:
                print("Entrando a la cueva...")
                current_area = AREA_DUNGEON
                player_x, player_y = 376, 480

    # Leer las teclas presionadas y mover al jugador
    moving = False
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_x -= player_speed * dt
        player_dir = "left"
        moving = True
    if keys[pygame.K_RIGHT]:
        player_x += player_speed * dt
        player_dir = "right"
        moving = True
    if keys[pygame.K_UP]:
        player_y -= player_speed * dt
        player_dir = "up"
        moving = True
    if keys[pygame.K_DOWN]:
        player_y += player_speed * dt
        player_dir = "down"
        moving = True

    # Animación: avanzar de frame solo si el jugador se está moviendo
    if moving:
        frame_timer += dt
        if frame_timer >= FRAME_TIME:
            frame_timer = 0
            frame_index = (frame_index + 1) % 2
    else:
        frame_index = 0

    # No dejar que el jugador salga de la pantalla (clamp con los bordes)
    if player_x < 0:
        player_x = 0
    if player_x > 800 - 48:
        player_x = 800 - 48
    if player_y < 0:
        player_y = 0
    if player_y > 600 - 48:
        player_y = 600 - 48

    # Rect del jugador para revisar colisiones
    player_rect = pygame.Rect(player_x, player_y, 48, 48)

    # Lógica según el área actual
    if current_area == AREA_OVERWORLD:
        # Revisar si el jugador está tocando la entrada de la cueva
        if player_rect.colliderect(cave_rect):
            near_cave = True
        else:
            near_cave = False
    elif current_area == AREA_DUNGEON:
        # Revisar si el jugador llegó a la puerta de salida
        if player_rect.colliderect(exit_rect):
            print("Saliendo de la mazmorra...")
            current_area = AREA_OVERWORLD
            player_x, player_y = 220, 140

    # Dibujar el fondo
    screen.fill("darkgreen")

    # Dibujo según el área actual
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
            option_y += 50
    elif current_area == AREA_OVERWORLD:
        screen.blit(background_img, (0, 0))
        screen.blit(frames[player_dir][frame_index], (player_x, player_y))

        # pygame.draw.rect(screen, "red", cave_rect, 3)  # ya no lo necesitamos

        # Mostrar el aviso de la cueva si el jugador está cerca
        if near_cave:
            screen.blit(cave_text, (220, 130))

        # Corazón flotante sobre la cueva: el seno oscila entre -1 y 1,
        # multiplicamos por la amplitud (10 píxeles) para subir y bajar,
        # y el tiempo acumulado controla la fase (la velocidad del vaivén)
        heart_y = 20 + math.sin(time_elapsed * 3) * 10
        screen.blit(heart_img, (209, heart_y))
    elif current_area == AREA_DUNGEON:
        screen.blit(dungeon_img, (0, 0))

        # El enemigo flota: el seno controla el movimiento vertical
        # (oscila entre -1 y 1, multiplicado por la amplitud de 25 píxeles)
        # y el coseno agrega un ligero vaivén horizontal (amplitud 40)
        enemy_y = 150 + math.sin(time_elapsed * 4) * 25
        enemy_x = 376 + math.cos(time_elapsed * 2) * 40
        screen.blit(enemy_img, (enemy_x, enemy_y))

        screen.blit(frames[player_dir][frame_index], (player_x, player_y))

    # Actualizar la pantalla
    pygame.display.flip()

pygame.quit()
