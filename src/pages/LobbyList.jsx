import { useEffect, useState } from "react";
import axios from "axios";
import LobbyCard from "../components/LobbyCard";

export default function LobbyList() {
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/get-it/lobbies/public")
      .then(res => setLobbies(res.data.lobbies))
      .catch(() => console.log("Error fetching lobbies"));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Public Lobbies</h2>

      {lobbies.map((lobby) => (
        <LobbyCard key={lobby.lobbyId} lobby={lobby} />
      ))}
    </div>
  );
}