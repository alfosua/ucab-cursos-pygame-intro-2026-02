# Inicializar pygame y configurar la ventana
import pygame

pygame.init()
pygame.font.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Zelda")
clock = pygame.time.Clock()

# Cargar las imágenes (escaladas al tamaño que vamos a usar)
background_img = pygame.image.load("assets/overworld.png")
background_img = pygame.transform.scale(background_img, (800, 600))
player_img = pygame.image.load("assets/player.png")
player_img = pygame.transform.scale(player_img, (48, 48))

# Posición y velocidad del jugador
player_x = 376
player_y = 400
player_speed = 200

# Zona de la cueva (entrada)
cave_rect = pygame.Rect(200, 54, 50, 55)

# Crear la fuente y pre-renderizar el texto del aviso
font = pygame.font.Font("assets/font.ttf", 16)
cave_text = font.render("¡Una cueva misteriosa!", True, "white")

# Bandera para saber si el jugador está cerca de la cueva
near_cave = False

# Ciclo principal del juego
running = True
while running:
    # Limitar cuadros por segundo a 60 FPS
    dt = clock.tick(60) / 1000  # tiempo en segundos desde el último frame

    # Manejar eventos
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

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

    # Revisar si el jugador está tocando la entrada de la cueva
    player_rect = pygame.Rect(player_x, player_y, 48, 48)
    if player_rect.colliderect(cave_rect):
        near_cave = True
    else:
        near_cave = False

    # Dibujar el fondo
    screen.fill("darkgreen")

    # Dibujar el fondo del overworld y al jugador
    screen.blit(background_img, (0, 0))
    screen.blit(player_img, (player_x, player_y))

    # pygame.draw.rect(screen, "red", cave_rect, 3)  # ya no lo necesitamos

    # Mostrar el aviso de la cueva si el jugador está cerca
    if near_cave:
        screen.blit(cave_text, (220, 130))

    # Actualizar la pantalla
    pygame.display.flip()

pygame.quit()
