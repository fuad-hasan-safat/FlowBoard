import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (token: string): Socket => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      transports: ["websocket"], // 🔴 force websocket
      auth: {
        token
      }
    });

    socket.on("connect", () => {
      console.log("✅ frontend socket connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ socket connect error:", err.message);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
