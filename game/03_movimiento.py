# Inicializar pygame y configurar la ventana
import pygame

pygame.init()
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

    # Dibujar el fondo
    screen.fill("darkgreen")

    # Dibujar el fondo del overworld y al jugador
    screen.blit(background_img, (0, 0))
    screen.blit(player_img, (player_x, player_y))

    # Actualizar la pantalla
    pygame.display.flip()

pygame.quit()
