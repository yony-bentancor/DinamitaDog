// En tu archivo game.js
document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("player");
  let playerX = 0;
  let playerY = 0;
  let isJumping = false;

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowLeft":
        playerX -= 10;
        break;
      case "ArrowRight":
        playerX += 10;
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
    let jumpHeight = 40;
    let jumpSpeed = 1;
    let gravity = 0.8;
    let initialY = playerY;

    function jumpStep() {
      if (jumpHeight > 0) {
        playerY -= jumpSpeed;
        jumpHeight -= jumpSpeed;
        updatePlayerPosition();
        requestAnimationFrame(jumpStep);
      } else {
        fall();
      }
    }

    function fall() {
      if (playerY < initialY) {
        playerY += gravity;
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
