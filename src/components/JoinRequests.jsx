export default function JoinRequests({ requests, onRespondToRequest }) {
	return (
		<div className="bg-[#2a1044] p-6 rounded-xl mb-6 border-2 border-gray-700 hover:border-gray-600 transition-all duration-300">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<i className="fa-solid fa-user-clock text-[#D6B9FC] text-xl"></i>
					<h3 className="text-xl text-[#D6B9FC] font-semibold">Pending Join Requests</h3>
				</div>
				<span className="text-xs px-2 py-1 rounded-full bg-[#38175A] text-gray-300 border border-gray-700">
					{requests.length} pending
				</span>
			</div>

			{requests.length === 0 && (
				<div className="bg-[#1e0c33] p-5 rounded-lg border border-gray-800 text-center text-gray-500">
					<i className="fa-solid fa-inbox text-3xl mb-2 opacity-50"></i>
					<p>No pending requests</p>
				</div>
			)}

			<div className="space-y-3">
				{requests.map((request) => (
					<div
						key={request.requestId}
						className="bg-[#1e0c33] p-4 rounded-lg flex items-center justify-between border border-gray-800 hover:border-gray-700 hover:bg-[#2a1044] transition-all duration-200"
					>
						<div className="min-w-0 pr-4">
							<div className="flex items-center gap-2">
								<i className="fa-solid fa-user text-[#838CE5] text-sm"></i>
								<p className="text-white font-semibold truncate">{request.chosenName}</p>
							</div>
							<p className="text-gray-400 text-xs mt-1 truncate">ID: {request.requestId}</p>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => onRespondToRequest(request.requestId, "accept")}
								className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 transition-all duration-200 flex items-center gap-2"
							>
								<i className="fa-solid fa-check text-xs"></i>
								Accept
							</button>
							<button
								onClick={() => onRespondToRequest(request.requestId, "reject")}
								className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
							>
								<i className="fa-solid fa-xmark text-xs"></i>
								Reject
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
