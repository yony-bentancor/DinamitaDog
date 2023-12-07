const express = require("express");
const app = express();
const { PORT } = require("./config");
const nunjucks = require("nunjucks");
const expressWs = require("express-ws");
const db = require("./db");
var fs = require("fs");
require("dotenv").config();
const pageRoutes = require("./routes/page.routes");

const nodemailer = require("nodemailer");
expressWs(app);

nunjucks.configure("./src/views", {
  autoescape: true,
  express: app,
});
db();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", pageRoutes);
app.ws("/", (ws, req) => {
  ws.on("message", (msg) => {
    // Aquí deberías manejar los mensajes enviados desde el cliente
    console.log(`Mensaje recibido: ${msg}`);
  });

  // Aquí deberías enviar información sobre el estado del juego al cliente
  // (posición del jugador, etc.) y manejar los eventos del teclado para actualizar ese estado.
});

app.ws("/keyboard", (ws, req) => {
  ws.on("message", (msg) => {
    console.log("Mensaje de teclado recibido en el servidor:", msg);
    onKeyPress(msg); // Implementa esta función para manejar eventos de teclado
  });
});
app.use(express.static("/"));
app.set("view engine", "njk");
app.use("/static", express.static(__dirname + "/public"));
/*app.use("/public", express.static("${__dirname}/public"));*/

app.listen(PORT, () =>
  console.log(`Servidor corriendo en el puerto de heroku ${PORT}!`)
);
