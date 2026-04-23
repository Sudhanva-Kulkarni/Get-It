import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getLobbySocket } from "./lobby/socketClient";
import ChatBox from "../components/ChatBox";
import JoinRequests from "../components/JoinRequests";
import UserList from "../components/UserList";

const FILE_MESSAGE_PREFIX = "__FILE__:";

const createFileMessagePayload = ({ fileUrl, fileName }) => {
  return `${FILE_MESSAGE_PREFIX}${JSON.stringify({ fileUrl, fileName })}`;
};

const parseIncomingMessage = (msg) => {
  const content = msg?.messageContent;
  if (typeof content !== "string" || !content.startsWith(FILE_MESSAGE_PREFIX)) {
    return { ...msg, type: "text" };
  }

  try {
    const parsed = JSON.parse(content.slice(FILE_MESSAGE_PREFIX.length));
    if (!parsed?.fileUrl || !parsed?.fileName) {
      return { ...msg, type: "text" };
    }

    return {
      ...msg,
      type: "file",
      fileUrl: parsed.fileUrl,
      fileName: parsed.fileName,
    };
  } catch {
    return { ...msg, type: "text" };
  }
};

export default function LobbyRoom() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const lobbyId = useMemo(() => String(id || "").toUpperCase(), [id]);
  const initialLobby = location.state?.lobby || null;
  const isAdminUser = Boolean(location.state?.isAdmin);
  const adminName = location.state?.name || "";

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(initialLobby?.currentUsers || []);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSendingFile, setIsSendingFile] = useState(false);
  const [joined, setJoined] = useState(
    Boolean(isAdminUser && initialLobby?.lobbyId === lobbyId)
  );
  const [name, setName] = useState("");
  const [requests, setRequests] = useState(initialLobby?.pendingJoinRequests || []);
  const [sessionId, setSessionId] = useState(location.state?.sessionId || null);
  const [hasRequested, setHasRequested] = useState(false);
  const [mutedSessionIds, setMutedSessionIds] = useState(new Set());

  const sessionIdRef = useRef(sessionId);
  const fileInputRef = useRef(null);
  const baseUrl = import.meta.env.VITE_BASEURL;

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    if (!lobbyId) {
      navigate("/lobbies");
      return;
    }

    const s = getLobbySocket();
    setSocket(s);

    const onSessionCreated = (data) => {
      setSessionId(data?.sessionId || null);
    };

    const onJoinRequestSent = (data) => {
      if (!isAdminUser || !data?.request) {
        return;
      }

      setRequests((prev) => {
        if (prev.some((req) => req.requestId === data.request.requestId)) {
          return prev;
        }
        return [...prev, data.request];
      });
    };

    const onJoinRequestResolved = (res) => {
      if (!res) {
        return;
      }

      if (res.status === "accepted") {
        setJoined(true);
        setHasRequested(false);
        if (res.lobby?.currentUsers) {
          setUsers(res.lobby.currentUsers);
        }
      } else if (res.status === "rejected") {
        alert("Your request was rejected");
        navigate("/lobbies");
      }
    };

    const onUserJoined = (data) => {
      if (data?.lobbyId === lobbyId) {
        setUsers(data.currentUsers || []);
      }
    };

    const onUserLeft = (data) => {
      if (data?.lobbyId === lobbyId) {
        setUsers(data.currentUsers || []);
        if (data.user?.sessionId) {
          setMutedSessionIds((prev) => {
            if (!prev.has(data.user.sessionId)) {
              return prev;
            }

            const next = new Set(prev);
            next.delete(data.user.sessionId);
            return next;
          });
        }
      }
    };

    const onUserKicked = () => {
      alert("You were kicked from the lobby");
      navigate("/lobbies");
    };

    const onMessageReceived = (msg) => {
      setMessages((prev) => [...prev, parseIncomingMessage(msg)]);
    };

    const onUserMuted = (data) => {
      if (!data || data.lobbyId !== lobbyId || !data.targetSessionId) {
        return;
      }

      setMutedSessionIds((prev) => {
        const next = new Set(prev);
        if (data.muted) {
          next.add(data.targetSessionId);
        } else {
          next.delete(data.targetSessionId);
        }
        return next;
      });
    };

    const onLobbyCreated = (data) => {
      if (!data || data.lobbyId !== lobbyId) {
        return;
      }

      setJoined(true);
      setUsers(data.currentUsers || []);
      setRequests(data.pendingJoinRequests || []);
    };

    s.on("session:created", onSessionCreated);
    s.on("lobby:joinRequestSent", onJoinRequestSent);
    s.on("lobby:joinRequestResolved", onJoinRequestResolved);
    s.on("lobby:userJoined", onUserJoined);
    s.on("lobby:userLeft", onUserLeft);
    s.on("lobby:userKicked", onUserKicked);
    s.on("lobby:userMuted", onUserMuted);
    s.on("chat:messageReceived", onMessageReceived);
    s.on("lobby:created", onLobbyCreated);

    if (isAdminUser && initialLobby?.lobbyId === lobbyId) {
      setJoined(true);
      setUsers(initialLobby.currentUsers || []);
      setRequests(initialLobby.pendingJoinRequests || []);
    }

    return () => {
      s.off("session:created", onSessionCreated);
      s.off("lobby:joinRequestSent", onJoinRequestSent);
      s.off("lobby:joinRequestResolved", onJoinRequestResolved);
      s.off("lobby:userJoined", onUserJoined);
      s.off("lobby:userLeft", onUserLeft);
      s.off("lobby:userKicked", onUserKicked);
      s.off("lobby:userMuted", onUserMuted);
      s.off("chat:messageReceived", onMessageReceived);
      s.off("lobby:created", onLobbyCreated);
    };
  }, [lobbyId, isAdminUser, initialLobby, navigate]);

  useEffect(() => {
    if (!isAdminUser || !socket || !adminName || joined) {
      return;
    }

    socket.emit(
      "lobby:joinRequest",
      {
        lobbyId,
        chosenName: adminName,
      },
      (res) => {
        if (!res?.success) {
          alert(res?.message || "Failed to join lobby");
          navigate("/lobbies");
        }
      }
    );
  }, [adminName, isAdminUser, joined, lobbyId, navigate, socket]);

  const handleJoinRequest = () => {
    if (!socket || !name.trim()) {
      alert("Please enter your name");
      return;
    }

    socket.emit(
      "lobby:joinRequest",
      {
        lobbyId,
        chosenName: name.trim(),
      },
      (res) => {
        if (res?.success) {
          setHasRequested(true);
          return;
        }

        alert(res?.message || "Failed to send join request");
      }
    );
  };

  const sendMessage = () => {
    if (!socket || !message.trim()) {
      return;
    }

    socket.emit(
      "chat:sendMessage",
      {
        lobbyId,
        messageContent: message,
      },
      (response) => {
        if (response?.success) {
          setMessage("");
          return;
        }

        alert(response?.message || "Message could not be sent");
      }
    );
  };

  const resolveUploadedFileMeta = async (uploadData, fallbackFileName) => {
    const directUrl =
      uploadData?.fileUrl ||
      uploadData?.url ||
      uploadData?.file?.url ||
      uploadData?.files?.[0]?.url;

    const directName =
      uploadData?.fileName ||
      uploadData?.file?.name ||
      uploadData?.files?.[0]?.name ||
      fallbackFileName;

    if (directUrl) {
      return { fileUrl: directUrl, fileName: directName };
    }

    const uploadKey = uploadData?.key;
    if (!uploadKey) {
      throw new Error("Upload response did not include file URL");
    }

    const details = await axios.get(`${baseUrl}/files/${uploadKey}`);
    const uploadedFiles = details?.data?.files || [];
    const matched =
      uploadedFiles.find(
        (file) => file?.originalName === fallbackFileName || file?.name === fallbackFileName
      ) || uploadedFiles[uploadedFiles.length - 1];

    if (!matched?.url) {
      throw new Error("Uploaded file URL could not be resolved");
    }

    return {
      fileUrl: matched.url,
      fileName: matched.name || matched.originalName || fallbackFileName,
    };
  };

  const sendFile = async () => {
    if (!socket || !selectedFile || isSendingFile) {
      return;
    }

    setIsSendingFile(true);

    try {
      const formData = new FormData();
      formData.append("files", selectedFile);
      formData.append("names", JSON.stringify([selectedFile.name]));

      const uploadRes = await axios.post(`${baseUrl}/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { fileUrl, fileName } = await resolveUploadedFileMeta(
        uploadRes?.data,
        selectedFile.name
      );

      const encodedFileMessage = createFileMessagePayload({ fileUrl, fileName });

      socket.emit(
        "chat:sendMessage",
        {
          lobbyId,
          messageContent: encodedFileMessage,
        },
        (res) => {
          if (!res?.success) {
            alert(res?.message || "Failed to share file in chat");
            return;
          }

          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      );
    } catch (error) {
      alert(error?.response?.data?.message || error?.message || "File upload failed");
    } finally {
      setIsSendingFile(false);
    }
  };

  const respondToRequest = (requestId, action) => {
    if (!socket) {
      return;
    }

    socket.emit(
      "lobby:joinRequest:respond",
      {
        lobbyId,
        requestId,
        action,
      },
      (response) => {
        if (response?.success) {
          setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
        }
      }
    );
  };

  const kickUser = (targetSessionId) => {
    if (!socket) {
      return;
    }

    socket.emit("lobby:kick", {
      lobbyId,
      targetSessionId,
    });
  };

  const setUserMuteState = (targetSessionId, muted) => {
    if (!socket) {
      return;
    }

    socket.emit(
      "lobby:mute",
      {
        lobbyId,
        targetSessionId,
        muted,
      },
      (res) => {
        if (!res?.success) {
          alert(res?.message || "Failed to update mute state");
        }
      }
    );
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 md:p-8 max-w-5xl mx-auto"
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Lobby: {lobbyId}</h2>
        {isAdminUser && (
          <span className="text-[#D6B9FC] inline-flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m2 4 3 12h14l3-12-5.5 4L12 2 7.5 8 2 4" />
              <path d="M5 21h14" />
            </svg>
            <span>Admin</span>
          </span>
        )}
        {sessionIdRef.current && (
          <p className="text-gray-400 text-sm mt-2">Session: {sessionIdRef.current}</p>
        )}
      </div>

      {!joined && !isAdminUser && (
        <div className="bg-[#2a1044] p-6 rounded-xl mb-6">
          <h3 className="text-xl text-white mb-4">Request to Join</h3>
          <div className="flex gap-3">
            <input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-[#38175A] text-white outline-none"
            />
            <button
              onClick={handleJoinRequest}
              disabled={hasRequested}
              className="bg-[#D6B9FC] px-6 py-3 rounded-xl text-black font-semibold hover:bg-[#bda1f5] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {hasRequested ? "Request Sent" : "Request to Join"}
            </button>
          </div>
        </div>
      )}

      {joined && (
        <>
          {isAdminUser && requests.length > 0 && (
            <JoinRequests requests={requests} onRespondToRequest={respondToRequest} />
          )}

          <UserList
            users={users}
            isAdminUser={isAdminUser}
            mutedSessionIds={mutedSessionIds}
            onKickUser={kickUser}
            onSetUserMuteState={setUserMuteState}
          />

          <ChatBox
            messages={messages}
            message={message}
            onMessageChange={setMessage}
            onSendMessage={sendMessage}
            fileInputRef={fileInputRef}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            onSendFile={sendFile}
            isSendingFile={isSendingFile}
          />
        </>
      )}

      {!joined && !isAdminUser && hasRequested && (
        <div className="bg-[#2a1044] p-6 rounded-xl text-center">
          <p className="text-gray-400">Waiting for admin approval...</p>
        </div>
      )}
    </div>
  );
}