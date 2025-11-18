// src/socket.js
import { io } from "socket.io-client";

// 👇 Jab backend ready ho jaaye, yahan URL change kar dena
const SOCKET_URL = "http://localhost:5000";

// 🔌 Ek single socket instance create kar lo
export const socket = io(SOCKET_URL, {
  autoConnect: false, // manually connect karenge component ke andar
});
