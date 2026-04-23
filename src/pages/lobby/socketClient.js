import { io } from "socket.io-client";

let lobbySocket = null;

export function getLobbySocket() {
  if (!lobbySocket) {
    lobbySocket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket", "polling"],
    });
  }

  return lobbySocket;
}

export function disconnectLobbySocket() {
  if (lobbySocket) {
    lobbySocket.disconnect();
    lobbySocket = null;
  }
}
