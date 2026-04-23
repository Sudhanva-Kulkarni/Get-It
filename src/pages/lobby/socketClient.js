import { io } from "socket.io-client";

let lobbySocket = null;

export function getLobbySocket() {
  if (!lobbySocket) {
    lobbySocket = io("http://localhost:3000", {
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
