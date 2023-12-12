const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("player", "/img/player.gif");
}

function create() {
  console.log("El juego se ha cargado correctamente.");
  this.player = this.physics.add.sprite(100, 450, "player");
  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  const maxY = 550; // Cambia esto al valor que desees como límite superior en Y

  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(160);
  } else {
    this.player.setVelocityX(0);
  }

  // Limitar la posición Y
  if (this.player.y > maxY) {
    this.player.y = maxY;
    this.player.setVelocityY(0); // Detener la velocidad en Y si se alcanza el límite
  }
}

/* document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("player");
  let playerX = 0;
  let playerY = 0;
  let isJumping = false;
  let jumpDirection = 1; // 1 para derecha, -1 para izquierda

  let screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const levelWidth = 4000; // Ancho total del nivel del juego
  let cameraX = 0;

  function updatePlayerPosition() {
    // Ajustar la posición del jugador
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    // Limitar la posición del jugador para que no se vaya más allá del nivel
    playerX = Math.max(0, Math.min(playerX, levelWidth - screenWidth));

    // Mover el fondo en relación con la posición del jugador
    cameraX = Math.min(playerX, levelWidth - screenWidth);
    document.body.style.backgroundPositionX = `-${playerX}px`;
  }

  window.addEventListener("resize", () => {
    screenWidth = window.innerWidth;
    updatePlayerPosition();
  });

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

  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
      changePlayerGif("centerAlternativa");
    } else {
      // Se llama cuando se suelta la tecla, cambiar el gif a "center"
      changePlayerGif("center");
    }
  });

  function jump() {
    isJumping = true;
    let jumpHeight = 100;
    let jumpSpeed = 5;
    let gravity = 7.5;
    let initialY = playerY;

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
        gifPath =
          "url('https://dinamitadog-01a0d2a58fb2.herokuapp.com/static/img/imgGallinaCenter.gif')";
        break;
      case "centerAlternativa":
        gifPath =
          "url('https://dinamitadog-01a0d2a58fb2.herokuapp.com/static/img/imgGallinaCenterAlternativa.gif')";
        break;
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
