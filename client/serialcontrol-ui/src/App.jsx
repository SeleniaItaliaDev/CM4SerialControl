import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position='bottom-right' toastOptions={{ classNames: { error: 'red-border', success: 'green-border' } }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<div>Damn you are lost!</div>} />
      </Routes>
    </BrowserRouter>
  );
}

/*
return (
  <div className="flex flex-col items-center justify-center h-screen gap-4">
    <h1 className="text-xl font-bold">RS485 Control Panel</h1>
    <button onClick={connect} className="bg-blue-500 text-white px-4 py-2 rounded-xl">Connect</button>
    <button onClick={toggleLed} className="bg-green-500 text-white px-4 py-2 rounded-xl">
      {ledOn ? 'Turn OFF LED' : 'Turn ON LED'}
    </button>
  </div>
);*/
