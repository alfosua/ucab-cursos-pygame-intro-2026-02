# Inicializar pygame y configurar la ventana
import pygame

pygame.init()
pygame.font.init()
pygame.mixer.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Zelda")
clock = pygame.time.Clock()

# Cargar las imágenes (escaladas al tamaño que vamos a usar)
background_img = pygame.image.load("assets/overworld.png")
background_img = pygame.transform.scale(background_img, (800, 600))
player_img = pygame.image.load("assets/player.png")
player_img = pygame.transform.scale(player_img, (48, 48))

# Cargar el fondo de la mazmorra y el enemigo
dungeon_img = pygame.image.load("assets/dungeon.png")
dungeon_img = pygame.transform.scale(dungeon_img, (800, 600))
enemy_img = pygame.image.load("assets/enemy.png")
enemy_img = pygame.transform.scale(enemy_img, (48, 48))

# Posición y velocidad del jugador
player_x = 376
player_y = 400
player_speed = 200

# Zona de la cueva (entrada) en el overworld
cave_rect = pygame.Rect(200, 54, 50, 55)

# Zona de salida en la mazmorra (puerta izquierda)
exit_rect = pygame.Rect(0, 250, 40, 120)

# Estados del juego (áreas)
AREA_OVERWORLD = "overworld"
AREA_DUNGEON = "dungeon"
current_area = AREA_OVERWORLD

# Crear la fuente y pre-renderizar el texto del aviso
font = pygame.font.Font("assets/font.ttf", 16)
cave_text = font.render("¡Una cueva misteriosa!", True, "white")

# Bandera para saber si el jugador está cerca de la cueva
near_cave = False

# Cargar y reproducir la música de fondo en bucle
pygame.mixer.music.load("assets/music.mp3")
pygame.mixer.music.set_volume(0.5)
pygame.mixer.music.play(-1)

# Ciclo principal del juego
running = True
while running:
    # Limitar cuadros por segundo a 60 FPS
    dt = clock.tick(60) / 1000  # tiempo en segundos desde el último frame

    # Manejar eventos
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        # Evento discreto: presionar ENTER cerca de la cueva para entrar
        if event.type == pygame.KEYDOWN and event.key == pygame.K_RETURN and near_cave:
            if current_area == AREA_OVERWORLD:
                print("Entrando a la cueva...")
                current_area = AREA_DUNGEON
                player_x, player_y = 376, 480

    # Leer las teclas presionadas y mover al jugador
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_x -= player_speed * dt
    if keys[pygame.K_RIGHT]:
        player_x += player_speed * dt
    if keys[pygame.K_UP]:
        player_y -= player_speed * dt
    if keys[pygame.K_DOWN]:
        player_y += player_speed * dt

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
        screen.blit(player_img, (player_x, player_y))

    # Actualizar la pantalla
    pygame.display.flip()

pygame.quit()
