import { useEffect, useRef } from "react";

export default function ChatBox({
	messages,
	message,
	onMessageChange,
	onSendMessage,
	fileInputRef,
	selectedFile,
	onFileSelect,
	onSendFile,
	isSendingFile,
}) {
	const textareaRef = useRef(null);

	const resizeTextarea = () => {
		const el = textareaRef.current;
		if (!el) {
			return;
		}

		el.style.height = "auto";
		const maxHeight = 220;
		const nextHeight = Math.max(56, Math.min(el.scrollHeight, maxHeight));
		el.style.height = `${nextHeight}px`;
		el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
	};

	useEffect(() => {
		resizeTextarea();
	}, [message]);

	const copyMessageToClipboard = async (text) => {
		if (!text || !navigator?.clipboard) {
			return;
		}

		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// Ignore clipboard failures silently to avoid interrupting chat usage.
		}
	};

	const handleMessagePaste = (e) => {
		const pastedText = e.clipboardData.getData("text/plain");
		if (typeof pastedText !== "string") {
			return;
		}

		e.preventDefault();
		const start = e.target.selectionStart;
		const end = e.target.selectionEnd;
		const nextValue = `${message.slice(0, start)}${pastedText}${message.slice(end)}`;

		onMessageChange(nextValue);

		requestAnimationFrame(() => {
			e.target.selectionStart = e.target.selectionEnd = start + pastedText.length;
			resizeTextarea();
		});
	};

	const handleMessageKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			onSendMessage();
			return;
		}

		if (e.key === "Tab") {
			e.preventDefault();
			const start = e.target.selectionStart;
			const end = e.target.selectionEnd;
			const nextValue = `${message.slice(0, start)}\t${message.slice(end)}`;
			onMessageChange(nextValue);

			requestAnimationFrame(() => {
				e.target.selectionStart = e.target.selectionEnd = start + 1;
				resizeTextarea();
			});
		}
	};

	return (
		<div className="bg-[#2a1044] p-6 rounded-xl border-2 border-gray-700 hover:border-gray-600 transition-all duration-300">
			<div className="flex items-center gap-2 mb-4">
				<i className="fa-solid fa-comments text-[#D6B9FC] text-xl"></i>
				<h3 className="text-xl text-[#D6B9FC] font-semibold">Chat</h3>
			</div>

			{/* Messages Container */}
			<div className="h-80 overflow-y-auto bg-[#1e0c33] p-4 rounded-lg mb-4 space-y-3 custom-scrollbar">
				{messages.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-gray-500">
						<i className="fa-solid fa-inbox text-5xl mb-3 opacity-50"></i>
						<p className="text-center">No messages yet</p>
						<p className="text-sm text-center mt-1">Start the conversation!</p>
					</div>
				) : (
					messages.map((item, index) => (
						(() => {
							const rawTextContent =
								typeof item.messageContent === "string" ? item.messageContent : "";
							const textContent = rawTextContent.trim();
							const isCopyableTextMessage = item.type !== "file" && textContent.length > 0;
							const shouldRenderAsCodeBlock =
								item.type !== "file" &&
								(rawTextContent.includes("\n") || /(^|\n)[ \t]{2,}\S/.test(rawTextContent));

							return (
						<div 
							key={index} 
							className="bg-[#2a1044] p-3 rounded-lg hover:bg-[#38175A] transition-all duration-200 animate-[slideIn_0.3s_ease-out]"
						>
							<div className="flex items-start gap-2">
								<i className="fa-solid fa-user-circle text-[#838CE5] text-lg mt-0.5"></i>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-[#838CE5] text-sm">
											{item.senderName}
										</span>
										<span className="text-gray-500 text-xs">
											{new Date(item.timestamp || Date.now()).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</span>
										{isCopyableTextMessage && (
											<button
												type="button"
												onClick={() => copyMessageToClipboard(rawTextContent)}
												aria-label="Copy message"
												title="Copy message"
												className="ml-auto text-gray-400 hover:text-[#D6B9FC] transition-colors"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="15"
													height="15"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
													<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
												</svg>
											</button>
										)}
									</div>
									<div className="mt-1">
										{item.type === "file" ? (
											<a
												href={item.fileUrl}
												target="_blank"
												rel="noreferrer"
												className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 underline transition-colors"
											>
												<i className="fa-solid fa-file-arrow-down"></i>
												<span className="break-all">{item.fileName}</span>
											</a>
										) : (
											shouldRenderAsCodeBlock ? (
												<pre className="text-white whitespace-pre-wrap font-mono text-sm leading-6 bg-[#1a0b2c] border border-gray-700 rounded-md p-3 overflow-x-auto">
													{rawTextContent}
												</pre>
											) : (
												<span className="text-white wrap-break-word whitespace-pre-wrap">{rawTextContent}</span>
											)
										)}
									</div>
								</div>
							</div>
						</div>
							);
						})()
					))
				)}
			</div>

			{/* File Upload Section */}
			<div className="bg-[#1e0c33] p-4 rounded-lg mb-4 border border-gray-800">
				<div className="flex flex-wrap items-center gap-3">
					<label className="bg-[#38175A] px-4 py-2 rounded-lg text-white hover:bg-[#4a1f6e] transition-all cursor-pointer flex items-center gap-2 border border-gray-700 hover:border-gray-600">
						<i className="fa-solid fa-paperclip"></i>
						<span>Choose File</span>
						<input
							ref={fileInputRef}
							type="file"
							className="hidden"
							onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
						/>
					</label>
					
					{selectedFile ? (
						<div className="flex items-center gap-2 flex-1 min-w-0">
							<i className="fa-solid fa-file text-[#D6B9FC]"></i>
							<span className="text-sm text-gray-300 truncate flex-1">
								{selectedFile.name}
							</span>
							<span className="text-xs text-gray-500">
								({(selectedFile.size / 1024).toFixed(2)} KB)
							</span>
						</div>
					) : (
						<span className="text-sm text-gray-500 italic">
							No file selected
						</span>
					)}
					
					<button
						onClick={onSendFile}
						disabled={!selectedFile || isSendingFile}
						className="bg-[#D6B9FC] px-4 py-2 rounded-lg text-black font-semibold hover:bg-[#bda1f5] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
					>
						{isSendingFile ? (
							<>
								<svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Sending...
							</>
						) : (
							<>
								<i className="fa-solid fa-upload"></i>
								Send File
							</>
						)}
					</button>
				</div>
			</div>

			{/* Message Input */}
			<div className="flex items-center gap-3">
				<div className="flex-1 relative">
					<i className="fa-solid fa-message absolute left-3 top-4 text-gray-500 pointer-events-none"></i>
					<textarea
						ref={textareaRef}
						value={message}
						onChange={(e) => {
							onMessageChange(e.target.value);
							resizeTextarea();
						}}
						onPaste={handleMessagePaste}
						onKeyDown={handleMessageKeyDown}
						placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
						rows={2}
						className="w-full min-h-14 max-h-[220px] pl-10 pr-4 py-3 rounded-xl bg-[#38175A] text-white outline-none border-2 border-transparent focus:border-[#838CE5] transition-all resize-none"
					/>
				</div>
				<button
					onClick={onSendMessage}
					disabled={!message.trim()}
					className="h-14 shrink-0 bg-[#838CE5] px-6 rounded-xl text-black font-semibold hover:bg-[#6e76dc] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
				>
					<i className="fa-solid fa-paper-plane"></i>
					<span className="hidden sm:inline">Send</span>
				</button>
			</div>

			<style>{`
				@keyframes slideIn {
					from {
						opacity: 0;
						transform: translateX(-10px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				.custom-scrollbar::-webkit-scrollbar {
					width: 8px;
				}

				.custom-scrollbar::-webkit-scrollbar-track {
					background: #1e0c33;
					border-radius: 10px;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: #838CE5;
					border-radius: 10px;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #6e76dc;
				}
			`}</style>
		</div>
	);
}