export default function UserList({
	users,
	isAdminUser,
	mutedSessionIds,
	onKickUser,
	onSetUserMuteState,
}) {
	return (
		<div className="bg-[#2a1044] p-6 rounded-xl mb-6 border-2 border-gray-700 hover:border-gray-600 transition-all duration-300">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<i className="fa-solid fa-users text-[#D6B9FC] text-xl"></i>
					<h3 className="text-xl text-[#D6B9FC] font-semibold">Users</h3>
				</div>
				<span className="text-xs px-2 py-1 rounded-full bg-[#38175A] text-gray-300 border border-gray-700">
					{users.length} online
				</span>
			</div>

			{users.length === 0 && (
				<div className="bg-[#1e0c33] p-5 rounded-lg border border-gray-800 text-center text-gray-500">
					<i className="fa-solid fa-user-slash text-3xl mb-2 opacity-50"></i>
					<p>No users in this lobby</p>
				</div>
			)}

			<div className="space-y-2">
				{users.map((user) => (
					<div
						key={user.sessionId}
						className="bg-[#1e0c33] p-3 rounded-lg flex items-center justify-between border border-gray-800 hover:border-gray-700 hover:bg-[#2a1044] transition-all duration-200"
					>
						<div className="min-w-0 pr-4">
							<div className="flex items-center gap-2">
								<i className="fa-solid fa-user-circle text-[#838CE5]"></i>
								<span className="text-white font-semibold truncate">{user.displayName}</span>
								{user.isAdmin && (
									<span className="text-xs px-2 py-0.5 rounded-full bg-[#38175A] text-[#D6B9FC] border border-[#5b2f83]">
										Admin
									</span>
								)}
								{mutedSessionIds.has(user.sessionId) && (
									<span className="text-yellow-300 text-xs inline-flex items-center gap-1 leading-none">
										<i className="fa-solid fa-volume-xmark text-[10px] leading-none"></i>
										Muted
									</span>
								)}
							</div>
						</div>
						{isAdminUser && !user.isAdmin && (
							<div className="flex items-center gap-2">
								<button
									onClick={() => onKickUser(user.sessionId)}
									className="px-3 py-1.5 rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-semibold transition-all"
								>
									Kick
								</button>
								<div className="flex items-center gap-2 pl-1">
									<span className="text-xs text-gray-300">
										{mutedSessionIds.has(user.sessionId) ? "Muted" : "Unmuted"}
									</span>
									<button
										type="button"
										onClick={() =>
											onSetUserMuteState(
												user.sessionId,
												!mutedSessionIds.has(user.sessionId)
											)
										}
										aria-pressed={mutedSessionIds.has(user.sessionId)}
										aria-label={`Toggle mute for ${user.displayName}`}
										className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-all ${
											mutedSessionIds.has(user.sessionId)
												? "bg-amber-500/60 border-amber-300/60"
												: "bg-[#38175A] border-gray-600"
										}`}
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
												mutedSessionIds.has(user.sessionId) ? "translate-x-6" : "translate-x-1"
											}`}
										/>
									</button>
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
