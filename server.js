const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); // Importa el paquete cors

const app = express();
const server = http.createServer(app);

// Configura CORS para permitir solicitudes desde http://localhost:5173
app.use(cors({
  origin: "http://localhost:5173", // Origen permitido
  methods: ["GET", "POST"], // Métodos HTTP permitidos
}));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Permite conexiones Socket.IO desde este origen
    methods: ["GET", "POST"], // Métodos HTTP permitidos
  },
});

let boardState = []; // Estado del tablero

io.on("connection", (socket) => {
  console.log("Un jugador se ha conectado");

  // Enviar el estado actual del tablero al nuevo jugador
  socket.emit("update-board", boardState);

  // Escuchar cuando un jugador mueve una carta
  socket.on("move-card", (card) => {
    console.log(card);
    
    boardState.push(card); // Agregar la carta al tablero
    io.emit("update-board", boardState); // Actualizar a todos los jugadores
  });
});

server.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});