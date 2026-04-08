import { Server } from "socket.io";
import { getLastPrices } from "./priceEngine.js"; // 🚀 Import the cache getter

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`👤 New Connection: ${socket.id}`);

    // ⚡ INSTANT LOAD: If we have prices in memory, send them immediately
    const cachedPrices = getLastPrices();
    if (cachedPrices) {
      socket.emit("price-update-full", cachedPrices);
      console.log(`📤 Sent cached prices to ${socket.id}`);
    }

    socket.on("disconnect", () => {
      console.log(`🚫 User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
