import { io } from "socket.io-client";
import { API_URL } from "../constants/api";

const socket = io(API_URL, {
  transports: ["websocket"],
  reconnection: true
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

export default socket;