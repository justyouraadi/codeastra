import { io } from "socket.io-client";

const SOCKET_URL = "https://gateway.codeastra.ai";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"]
});
