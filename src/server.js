const express = require("express");
const app = express();
const { PORT } = require("./config");
const nunjucks = require("nunjucks");
const db = require("./db");
var fs = require("fs");
require("dotenv").config();
const pageRoutes = require("./routes/page.routes");
const expressWs = require("express-ws");

const nodemailer = require("nodemailer");

nunjucks.configure("./src/views", {
  autoescape: true,
  express: app,
});
db();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
expressWs(app);
app.use("/", pageRoutes);
app.use(express.static("/"));
app.set("view engine", "njk");
app.use("/static", express.static(__dirname + "/public"));
/*app.use("/public", express.static("${__dirname}/public"));*/
// Ruta WebSocket para manejar eventos del teclado
app.ws("/", (ws, req) => {
  ws.on("message", (msg) => {
    // Aquí deberías manejar los mensajes enviados desde el cliente
    console.log(`Mensaje recibido: ${msg}`);
  });

  // Aquí deberías enviar información sobre el estado del juego al cliente
  // (posición del jugador, etc.) y manejar los eventos del teclado para actualizar ese estado.
});
// Manejo de eventos de teclado
const { onKeyPress } = require("./keyboardEvents"); // Asegúrate de implementar esto

// Configura la función de manejo de eventos de teclado
app.ws("/keyboard", (ws, req) => {
  ws.on("message", (msg) => {
    onKeyPress(msg); // Implementa esta función para manejar eventos de teclado
  });
});

app.listen(PORT, () =>
  console.log(`Servidor corriendo en el puerto de heroku ${PORT}!`)
);
