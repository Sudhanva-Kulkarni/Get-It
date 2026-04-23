import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Retrieve from "./pages/Retrieve";
import { Toaster } from "react-hot-toast";
import LobbyList from "./pages/LobbyList";
import CreateLobby from "./pages/CreateLobby";
import LobbyRoom from "./pages/LobbyRoom";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/retrieve" element={<Retrieve />} />
        <Route path="/lobbies" element={<LobbyList />} />
        <Route path="/lobby/:id" element={<LobbyRoom />} />
        <Route path="/lobbies/create" element={<CreateLobby />} />
      </Routes>
    </BrowserRouter>
  );
}
