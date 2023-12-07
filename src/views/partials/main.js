import { Gallina } from "./objetos.js";

const gallinaContainer = document.getElementById("gallina-container");
const gallina = new Gallina(gallinaContainer);

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
