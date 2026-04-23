import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getLobbySocket } from "./lobby/socketClient";

export default function CreateLobby() {
  const [lobbyName, setLobbyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [maxUsers, setMaxUsers] = useState(6);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const navigate = useNavigate();

  const createLobby = () => {
    if (!lobbyName.trim()) {
      toast.error("Please enter a lobby name");
      return;
    }
    if (!adminName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsCreating(true);

    const socket = getLobbySocket();
    const payload = {
      lobbyName: lobbyName.trim(),
      adminName: adminName.trim(),
      maxUsers: Number(maxUsers),
      isPrivate: Boolean(isPrivate),
    };

    const emitCreate = () => {
      socket.emit("lobby:create", payload, (res) => {
        if (res && res.success) {
          const toastId = toast.success("Lobby created!");
          setTimeout(() => {
            toast.dismiss(toastId);
            navigate(`/lobby/${res.lobby.lobbyId}`, {
              state: {
                isAdmin: true,
                name: adminName.trim(),
                lobby: res.lobby,
                sessionId: res.session?.sessionId || null,
              },
            });
          }, 1000);
          return;
        }

        toast.error(res?.message || "Failed to create lobby");
        setIsCreating(false);
      });
    };

    if (socket.connected) {
      emitCreate();
      return;
    }

    socket.once("connect", emitCreate);
    socket.once("connect_error", () => {
      toast.error("Failed to connect to server");
      setIsCreating(false);
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <Toaster position="top-center" />
      
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
          Create Lobby
        </h2>
        <p className="text-gray-400">Set up your own lobby and invite others</p>
      </div>

      <div className="bg-[#2a1044] p-6 rounded-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Lobby Name
          </label>
          <input
            placeholder="Enter lobby name"
            value={lobbyName}
            onChange={e => setLobbyName(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#38175A] text-white outline-none border-2 border-transparent focus:border-[#838CE5] transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Your Name
          </label>
          <input
            placeholder="Enter your name"
            value={adminName}
            onChange={e => setAdminName(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#38175A] text-white outline-none border-2 border-transparent focus:border-[#838CE5] transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Max Users
          </label>
          <input
            type="number"
            min="2"
            max="10"
            value={maxUsers}
            onChange={e => setMaxUsers(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#38175A] text-white outline-none border-2 border-transparent focus:border-[#838CE5] transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="private"
            checked={isPrivate}
            onChange={e => setIsPrivate(e.target.checked)}
            className="w-5 h-5 accent-[#838CE5]"
          />
          <label htmlFor="private" className="text-white">
            Private Lobby
          </label>
        </div>

        <button
          onClick={createLobby}
          disabled={isCreating}
          className={`w-full bg-[#D6B9FC] px-6 py-3 rounded-xl text-black font-bold transition-all ${
            isCreating ? "opacity-50 cursor-not-allowed" : "hover:bg-[#bda1f5] hover:scale-105"
          }`}
        >
          {isCreating ? "Creating..." : "Create Lobby"}
        </button>
      </div>
    </div>
  );
}