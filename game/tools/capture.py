# Herramienta (NO es material del curso): captura screenshots de cada paso
# y arma un GIF de demostración para la página del curso.
#
# Uso: SDL_VIDEODRIVER=dummy SDL_AUDIODRIVER=dummy .venv/bin/python tools/capture.py
#
# Ejecutar SIEMPRE con cwd = game/ para que las rutas relativas a assets/ funcionen.

import os
import runpy

import pygame
from PIL import Image


# Estado de teclas controlado por guion: un objeto dict-like que pygame
# puede indexar con sus constantes (K_LEFT, K_UP, etc.)
class ScriptedKeys:
    def __init__(self):
        self.pressed = set()

    def __getitem__(self, key):
        return 1 if key in self.pressed else 0


# Construye un guion de simulación: lista de (frame, set_de_teclas_presionadas)
# y una lista separada de eventos KEYDOWN puntuales (frame, key).
def build_script(name):
    scripted_keys = ScriptedKeys()
    held = []   # lista de (frame_inicio, frame_fin, key) -> teclas mantenidas
    presses = []  # lista de (frame, key) -> eventos KEYDOWN puntuales
    slow_until = 0  # frames iniciales que el GIF muestra en cámara lenta

    if name == "step01":
        total_frames = 60  # ~1 segundo, ventana simple

    elif name == "step03":
        # Caminar en un pequeño cuadrado
        held = [
            (10, 70, pygame.K_RIGHT),
            (70, 130, pygame.K_DOWN),
            (130, 190, pygame.K_LEFT),
            (190, 250, pygame.K_UP),
        ]
        total_frames = 260

    elif name in ("step04", "step05", "step06", "step07"):
        # Caminar desde (376,400) hasta la zona de la cueva (200,54)
        # Izquierda hasta x ~ 205 (~52 frames), luego arriba hasta y ~ 60 (~102 frames)
        held = [
            (10, 62, pygame.K_LEFT),    # x: 376 -> ~205
            (62, 164, pygame.K_UP),     # y: 400 -> ~60
        ]
        if name == "step07":
            # Presionar ENTER una vez que llega cerca de la cueva
            presses = [(180, pygame.K_RETURN)]
            total_frames = 280
        else:
            total_frames = 250

    elif name == "step08":
        # Caminar hasta la cueva, entrar (ENTER), pasear en el dungeon y salir
        held = [
            (10, 62, pygame.K_LEFT),    # x: 376 -> ~205
            (62, 164, pygame.K_UP),     # y: 400 -> ~60
        ]
        presses = [(180, pygame.K_RETURN)]
        # Tras entrar, el jugador aparece en (376,480). Caminar hacia la
        # puerta de salida (0,250,40,120): izquierda y un poco arriba.
        held += [
            (200, 312, pygame.K_LEFT),  # x: 376 -> ~0
            (312, 372, pygame.K_UP),    # y: 480 -> ~280 (dentro del exit_rect)
        ]
        total_frames = 480

    elif name == "step09":
        # Navegar el menú: bajar, subir, ENTER (Jugar), luego caminar un poco
        presses = [
            (10, pygame.K_DOWN),
            (30, pygame.K_UP),
            (50, pygame.K_RETURN),
        ]
        held = [
            (70, 130, pygame.K_RIGHT),
            (130, 190, pygame.K_DOWN),
        ]
        total_frames = 300

    elif name == "step10":
        # Caminar en las 4 direcciones para mostrar la animación
        # (arrancar saltando el menú con ENTER)
        presses = [(10, pygame.K_RETURN)]
        held = [
            (30, 90, pygame.K_DOWN),
            (90, 150, pygame.K_RIGHT),
            (150, 210, pygame.K_UP),
            (210, 270, pygame.K_LEFT),
        ]
        total_frames = 300

    elif name == "step11":
        # Mostrar el corazón flotante en el overworld (~2.5 s quieto),
        # luego entrar a la cueva y ver al enemigo ondulante
        presses = [(10, pygame.K_RETURN), (330, pygame.K_RETURN)]
        held = [
            (160, 212, pygame.K_LEFT),   # x: 376 -> ~205
            (212, 314, pygame.K_UP),     # y: 400 -> ~60
            (350, 420, pygame.K_UP),     # acercarse al enemigo en el dungeon
        ]
        total_frames = 560

    elif name == "step12":
        # Igual que step11 pero pasear por el dungeon para ver la luz seguir al jugador
        presses = [(10, pygame.K_RETURN), (200, pygame.K_RETURN)]
        held = [
            (30, 82, pygame.K_LEFT),
            (82, 184, pygame.K_UP),
            (220, 290, pygame.K_UP),
            (290, 370, pygame.K_RIGHT),
            (370, 460, pygame.K_LEFT),
        ]
        total_frames = 520

    elif name == "final":
        # Demo del resultado final: menú con calma, caminar por el overworld
        # en varias direcciones, entrar a la cueva, pasear con la linterna y salir
        presses = [
            (30, pygame.K_DOWN),
            (80, pygame.K_UP),
            (130, pygame.K_RETURN),   # Jugar
            (580, pygame.K_RETURN),   # entrar a la cueva
        ]
        held = [
            (150, 210, pygame.K_DOWN),   # y: 400 -> 520
            (210, 270, pygame.K_RIGHT),  # x: 376 -> ~576
            (290, 402, pygame.K_LEFT),   # x: 576 -> ~205
            (402, 545, pygame.K_UP),     # y: 520 -> ~60
            (600, 670, pygame.K_UP),     # dungeon: y 480 -> ~246
            (670, 760, pygame.K_LEFT),   # x 376 -> ~76 (hacia la salida)
            (760, 800, pygame.K_LEFT),   # cruzar la puerta de salida
        ]
        total_frames = 880
        slow_until = 140  # frames del menú a cámara lenta

    else:
        total_frames = 60

    return scripted_keys, held, presses, total_frames, slow_until


# Captura los frames del paso indicado y los guarda como GIF.
def capture_step(step_file, gif_name, name):
    os.environ.setdefault("SDL_VIDEODRIVER", "dummy")
    os.environ.setdefault("SDL_AUDIODRIVER", "dummy")

    scripted_keys, held, presses, total_frames, slow_until = build_script(name)

    captured_frames = []  # lista de (frame_original, imagen)
    state = {"frame": 0}

    real_get_pressed = pygame.key.get_pressed
    real_flip = pygame.display.flip
    real_clock = pygame.time.Clock

    # Monkeypatch: get_pressed devuelve el estado del guion
    def fake_get_pressed():
        return scripted_keys

    # Reloj falso: tick() devuelve siempre 1000/60 ms (dt fijo, simulación a 60 fps)
    class FakeClock:
        def tick(self, fps=0):
            return 1000 / 60

    # Monkeypatch: flip captura un frame cada 6 flips e inyecta eventos del guion
    def fake_flip():
        frame = state["frame"]

        # Actualizar las teclas mantenidas según el guion
        scripted_keys.pressed.clear()
        for start, end, key in held:
            if start <= frame < end:
                scripted_keys.pressed.add(key)

        # Inyectar eventos KEYDOWN puntuales del guion
        for press_frame, key in presses:
            if press_frame == frame:
                pygame.event.post(pygame.event.Event(pygame.KEYDOWN, key=key))

        # Capturar un frame cada 6 flips
        if frame % 6 == 0:
            surf = pygame.display.get_surface()
            if surf is not None:
                snapshot = surf.copy()
                raw = pygame.image.tobytes(snapshot, "RGB")
                img = Image.frombytes("RGB", snapshot.get_size(), raw)
                captured_frames.append((frame, img))

        # Inyectar QUIT al final del guion
        if frame >= total_frames:
            pygame.event.post(pygame.event.Event(pygame.QUIT))

        state["frame"] += 1
        return real_flip()

    pygame.key.get_pressed = fake_get_pressed
    pygame.display.flip = fake_flip
    pygame.time.Clock = FakeClock

    try:
        runpy.run_path(step_file, run_name="__main__")
    finally:
        pygame.key.get_pressed = real_get_pressed
        pygame.display.flip = real_flip
        pygame.time.Clock = real_clock
        pygame.quit()

    # Armar el GIF: redimensionar a 400x300 con NEAREST para look pixelado.
    # Los frames anteriores a slow_until (ej. el menú) duran más en pantalla.
    resized = []
    durations = []
    for frame, img in captured_frames:
        resized.append(img.resize((400, 300), Image.NEAREST))
        durations.append(280 if frame < slow_until else 100)

    if not resized:
        # Si no se capturó nada (paso muy corto), usar un frame negro
        resized = [Image.new("RGB", (400, 300), "black")]
        durations = [100]

    out_path = os.path.join("..", "site", "img", "steps", gif_name)
    resized[0].save(
        out_path,
        save_all=True,
        append_images=resized[1:],
        duration=durations,
        loop=0,
        optimize=True,
    )
    print(f"{gif_name}: {len(resized)} frames -> {out_path}")


# Lista de pasos a capturar: (archivo, nombre del gif, clave del guion)
STEPS = [
    ("01_inicio.py", "step01.gif", "step01"),
    ("02_imagenes.py", "step02.gif", "step01"),
    ("03_movimiento.py", "step03.gif", "step03"),
    ("04_colisiones.py", "step04.gif", "step04"),
    ("05_texto.py", "step05.gif", "step05"),
    ("06_musica.py", "step06.gif", "step06"),
    ("07_eventos.py", "step07.gif", "step07"),
    ("08_areas.py", "step08.gif", "step08"),
    ("09_menu.py", "step09.gif", "step09"),
    ("10_animaciones.py", "step10.gif", "step10"),
    ("11_trigonometria.py", "step11.gif", "step11"),
    ("12_luces.py", "step12.gif", "step12"),
    ("12_luces.py", "final.gif", "final"),
]

if __name__ == "__main__":
    for step_file, gif_name, script_name in STEPS:
        capture_step(step_file, gif_name, script_name)
