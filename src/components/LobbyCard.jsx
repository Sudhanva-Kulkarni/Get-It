import { Link } from "react-router-dom";

export default function LobbyCard({ lobby }) {
	const isFull = lobby.currentUsers >= lobby.maxUsers;

	return (
		<div className="p-5 bg-[#2a1044] rounded-xl mb-3 border-2 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:-translate-y-px">
			<div className="flex items-start justify-between gap-3 mb-3">
				<div className="min-w-0">
					<div className="flex items-center gap-2">
						<i className="fa-solid fa-door-open text-[#D6B9FC]"></i>
						<p className="text-white font-semibold truncate">{lobby.lobbyName}</p>
					</div>
					<p className="text-gray-400 text-xs mt-1">Room ID: {lobby.lobbyId}</p>
				</div>
				<span
					className={`text-xs px-2 py-1 rounded-full border ${
						isFull
							? "bg-red-500/20 text-red-300 border-red-500/30"
							: "bg-green-500/20 text-green-300 border-green-500/30"
					}`}
				>
					{isFull ? "Full" : "Open"}
				</span>
			</div>

			<div className="bg-[#1e0c33] rounded-lg p-3 border border-gray-800 mb-4">
				<div className="flex items-center justify-between text-sm">
					<span className="text-gray-400">Participants</span>
					<span className="text-[#D6B9FC] font-semibold">
						{lobby.currentUsers}/{lobby.maxUsers}
					</span>
				</div>
			</div>

			<Link to={`/lobby/${lobby.lobbyId}`}>
				<button
					disabled={isFull}
					className="w-full bg-[#838CE5] px-4 py-2.5 rounded-lg text-black font-semibold hover:bg-[#6e76dc] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					<i className="fa-solid fa-right-to-bracket"></i>
					Join Lobby
				</button>
			</Link>
		</div>
	);
}
