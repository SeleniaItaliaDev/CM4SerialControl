import { Routes, Route, HashRouter } from "react-router-dom";
import { connectWS } from './api/apiService';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import Home from './pages/Home';

export default function App() {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = connectWS(setWs, setConnected, toast);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <HashRouter>
      <Toaster
        position="top-center"
        theme="dark"
        richColors
      />
      <Routes>
        <Route path="/" element={<Home ws={ws} connected={connected} />} />
      </Routes>
    </HashRouter>
  );
}