import { COMMAND_TYPES } from '../../../../../shared/messageTypes';
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
const sendCommand = (ws, command) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(command);
    } else {
        console.error('WebSocket is not connected.');
    }
}

export const sendUpdateVoltage = (ws, voltage) => {
    const msg = {
        cmd: COMMAND_TYPES.SET_VOLTAGE,
        voltage: voltage
    };
    sendCommand(ws, JSON.stringify(msg));
}

export const sendUpdatedFrequency = (ws, frequency) => {
    const msg = {
        cmd: COMMAND_TYPES.SET_FREQUENCY,
        frequency: frequency
    };
    sendCommand(ws, JSON.stringify(msg));
}

export const sendUpdateMode = (ws, mode) => {
    if (mode !== 'puls' && mode !== 'cont') {
        console.error('Invalid mode:', mode);
        return;
    }

    const msg = {
        cmd: COMMAND_TYPES.SET_MODE,
        mode: mode
    };
    sendCommand(ws, JSON.stringify(msg));
}

export const sendStartTreatment = (ws) => {
    const msg = {
        cmd: COMMAND_TYPES.START_TREATMENT
    };
    sendCommand(ws, JSON.stringify(msg));
}

export const sendStopTreatment = (ws) => {
    const msg = {
        cmd: COMMAND_TYPES.STOP_TREATMENT
    };
    sendCommand(ws, JSON.stringify(msg));
}
