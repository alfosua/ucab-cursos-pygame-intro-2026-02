# Inicializar pygame y configurar la ventana
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Zelda")
clock = pygame.time.Clock()

# Ciclo principal del juego
running = True
while running:
    # Limitar cuadros por segundo a 60 FPS
    dt = clock.tick(60) / 1000  # tiempo en segundos desde el último frame

    # Manejar eventos
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Dibujar el fondo
    screen.fill("darkgreen")

    # Actualizar la pantalla
    pygame.display.flip()

pygame.quit()
