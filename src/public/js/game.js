document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("player");
  let playerX = 0;
  let playerY = 0;
  let isJumping = false;
  let jumpDirection = 1; // 1 para derecha, -1 para izquierda

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowLeft":
        playerX -= 10;
        jumpDirection = -1; // Actualizar dirección al mover a la izquierda
        break;
      case "ArrowRight":
        playerX += 10;
        jumpDirection = 1; // Actualizar dirección al mover a la derecha
        break;
      case " ":
        if (!isJumping) {
          jump();
        }
        break;
    }

    updatePlayerPosition();
  });

  function updatePlayerPosition() {
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
  }

  function jump() {
    isJumping = true;
    let jumpHeight = 100;
    let jumpSpeed = 5;
    let gravity = 1.5;
    let initialY = playerY;
    let jumpDistance = 50; // Distancia horizontal del salto
    let jumpArc = 2 * Math.PI; // Un círculo completo para un salto redondo

    function jumpStep() {
      if (jumpHeight > 0) {
        const jumpProgress = (initialY - playerY) / jumpHeight;
        const angle = jumpProgress * jumpArc;
        const xOffset = jumpDistance * Math.cos(angle) * jumpDirection;
        const yOffset = jumpHeight * Math.sin(angle);

        playerX += xOffset;
        playerY -= jumpSpeed;
        updatePlayerPosition();
        requestAnimationFrame(jumpStep);
      } else {
        fall();
      }
    }

    function fall() {
      if (playerY < initialY) {
        playerY += gravity;
        playerX += gravity * jumpDirection; // Mover en la dirección actual
        updatePlayerPosition();
        requestAnimationFrame(fall);
      } else {
        playerY = initialY;
        isJumping = false;
        updatePlayerPosition();
      }
    }

    jumpStep();
  }
});
