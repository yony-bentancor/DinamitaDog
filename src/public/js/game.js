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
        jumpDirection = -1;
        changePlayerGif("left");
        break;
      case "ArrowRight":
        playerX += 10;
        jumpDirection = 1;
        changePlayerGif("right");
        break;
      case " ":
        if (!isJumping) {
          jump();
        }
        break;
    }

    updatePlayerPosition();
  });

  document.addEventListener("keyup", () => {
    // Se llama cuando se suelta la tecla, cambiar el gif a "center"
    changePlayerGif("center");
  });

  function updatePlayerPosition() {
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
  }

  function jump() {
    isJumping = true;
    let jumpHeight = 100;
    let jumpSpeed = 5;
    let gravity = 7.5;
    let initialY = playerY;
    let jumpDistance = 50; // Distancia horizontal del salto

    function jumpStep() {
      if (jumpHeight > 0) {
        playerY -= jumpSpeed;
        playerX += jumpSpeed * jumpDirection; // Mover en la dirección actual
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

  function changePlayerGif(direction) {
    let gifPath;

    switch (direction) {
      case "left":
        gifPath =
          "url('https://dinamitadog-01a0d2a58fb2.herokuapp.com/static/img/imgGallinaLeft.gif')";
        break;
      case "right":
        gifPath =
          "url('https://dinamitadog-01a0d2a58fb2.herokuapp.com/static/img/imgGallinaRight.gif')";
        break;
      case "center":
      default:
        gifPath =
          "url('https://dinamitadog-01a0d2a58fb2.herokuapp.com/static/img/imgGallinaCenter.gif')";
        break;
    }

    player.style.backgroundImage = gifPath;

    // Agregar o quitar la clase 'left' según la dirección
    if (direction === "left") {
      player.classList.add("left");
    } else {
      player.classList.remove("left");
    }
  }
});

/* document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("player");
  let playerX = 0;
  let playerY = 0;
  let isJumping = false;
  let jumpDirection = 1; // 1 para derecha, -1 para izquierda

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowLeft":
        playerX -= 10;
        jumpDirection = -1;
        changePlayerGif("left");
        break;
      case "ArrowRight":
        playerX += 10;
        jumpDirection = 1;
        changePlayerGif("right");
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
    let gravity = 7.5;
    let initialY = playerY;
    let jumpDistance = 50; // Distancia horizontal del salto

    function jumpStep() {
      if (jumpHeight > 0) {
        playerY -= jumpSpeed;
        playerX += jumpSpeed * jumpDirection; // Mover en la dirección actual
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

  function changePlayerGif(direction) {
    const gifPath =
      direction === "left"
        ? "url('https://dinamitadog-01a0d2a58fb2.herokuapp.com/static/img/imgGallinaLeft.gif')"
        : "url('https://dinamitadog-01a0d2a58fb2.herokuapp.com/static/img/imgGallinaRight.gif')";

    player.style.backgroundImage = gifPath;

    // Agregar o quitar la clase 'left' según la dirección
    if (direction === "left") {
      player.classList.add("left");
    } else {
      player.classList.remove("left");
    }
  }
}); */

/* document.addEventListener("DOMContentLoaded", () => {
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

    function jumpStep() {
      if (jumpHeight > 0) {
        playerY -= jumpSpeed;
        playerX += jumpSpeed * jumpDirection; // Mover en la dirección actual
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
}); */
