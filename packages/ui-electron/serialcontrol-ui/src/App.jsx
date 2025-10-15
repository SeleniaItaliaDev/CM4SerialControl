import { Toaster, toast } from 'sonner';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import Home from './pages/Home';

export default function App() {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);

  const connect = () => {
    const socket = new WebSocket('ws://localhost:8081');
    socket.onopen = () => toast.success('WebSocket connection established');
    socket.onmessage = (event) => toast.success(`Message from server: ${event.data}`);
    socket.onerror = (err) => toast.error(`WebSocket error: ${err.message}`);
    setWs(socket);

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setConnected(false);
    } else {
      setConnected(true);
    }
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <HashRouter>
      <Toaster position='top-center' toastOptions={{ classNames: { error: 'red-border', success: 'green-border' } }} theme='dark' />
      <Routes>
        <Route path="/" element={<Home ws={ws} connected={connected} />} />
      </Routes>
    </HashRouter>
  );
}