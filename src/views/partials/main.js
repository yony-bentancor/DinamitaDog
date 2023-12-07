import { Gallina } from "./objetos.js";

const gallina = new Gallina(document.getElementById("gallina"));

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowRight":
      gallina.moveRight();
      break;
    case "ArrowLeft":
      gallina.moveLeft();
      break;
    case "Space":
      gallina.jump();
      break;
    default:
      break;
  }
});
