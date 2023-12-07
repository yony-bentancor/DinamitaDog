import { Gallina } from "../src/views/partials/objetos";

const gallinaContainer = document.getElementById("gallina-container");

if (!gallinaContainer) {
  alert("Error: No se encontró el contenedor de la gallina.");
} else {
  alert("Contenedor de la gallina encontrado. Creando la gallina...");

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
}
