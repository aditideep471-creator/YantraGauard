import { io } from "socket.io-client";

/* Backend URL */
const API_URL = "http://10.105.195.27:5000";

/* Create socket connection */
const socket = io(API_URL, {
  transports: ["websocket"],   // force websocket
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000
});

/* Debug logs */

socket.on("connect", () => {
  console.log("✅ Web socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Web socket disconnected");
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

/* Optional: debug event listener */
socket.on("new_incident", (data) => {
  console.log(" Socket event received:", data);
});

export default socket;