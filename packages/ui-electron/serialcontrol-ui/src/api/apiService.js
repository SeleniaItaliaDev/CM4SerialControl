/**
 * Connect to WebSocket server
 * @param {*} setWs The state setter for WebSocket instance
 * @param {*} setConnected The state setter for connection status
 * @param {*} toast The toast notification function
 * @returns {WebSocket} socket
 */
export const connectWS = (setWs, setConnected, toast) => {
    const socket = new WebSocket('ws://localhost:8081'); 
    socket.onopen = () => {
        setWs(socket);
        setConnected(true);
        toast.success('WebSocket connected');
    };
    
    socket.onclose = () => {
        setConnected(false);
        toast.error('WebSocket disconnected');
    };
    
    socket.onerror = (error) => {
        setConnected(false);
        // toast.error('WebSocket error: ' + error.message);
    };
    return socket;
}

/**
 * Send command via WebSocket
 * @param {WebSocket} ws The WebSocket instance
 * @param {string} command The command to send
 */
export const sendCommand = (ws, command) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(command);
    } else {
        console.error('WebSocket is not connected.');
    }
} 
