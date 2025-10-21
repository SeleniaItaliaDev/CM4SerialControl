import { Routes, Route, HashRouter } from "react-router-dom";
import { connectWS } from './api/apiService';
import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import Home from './pages/Home';

export default function App() {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const [txState, setTxState] = useState(null);

  const initWebSocket = () => {
    const socket = connectWS(setWs, setConnected, toast);

    // When a message is received, parse it and handle accordingly
    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        switch (msg.event) {
          case 'emitState':
            if (msg.tx) {
              setTxState(JSON.stringify(msg.tx));
            }
            break;
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    // When it closes, schedule a reconnect
    socket.onclose = () => {
      setConnected(false);
      reconnectTimeoutRef.current = setTimeout(() => {
        initWebSocket();
      }, 1000);
    };

    return socket;
  };

  useEffect(() => {
    const socket = initWebSocket();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) socket.close();
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
        <Route path="/" element={<Home ws={ws} connected={connected} currentTxState={txState}/>} />
      </Routes>
    </HashRouter>
  );
}