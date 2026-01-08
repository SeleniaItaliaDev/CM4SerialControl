import React, { useState, useRef, useEffect, useCallback } from 'react';

const CameraControlPanel = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);
  const [error, setError] = useState('');
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  // --- NUOVI STATI PER GLI EFFETTI ---
  const [zoom, setZoom] = useState(1);         // 1 = 100% (Normale)
  const [brightness, setBrightness] = useState(100); // 100%
  const [contrast, setContrast] = useState(100);     // 100%

  // 1. Carica lista camere
  useEffect(() => {
    const getCameras = async () => {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) setSelectedDeviceId(videoDevices[0].deviceId);
      } catch (err) {
        console.error("Errore devices:", err);
      }
    };
    getCameras();
    return () => stopCamera();
  }, []); // eslint-disable-line

  // 2. Start Camera
  const startCamera = async () => {
    setError('');
    try {
      // const constraints = {
      //   audio: false,
      //   video: {
      //     deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
      //     width: { ideal: 1280 },
      //     height: { ideal: 720 },
      //     frameRate: { ideal: 30 }
      //   }
      // };
      const constraints = {
        audio: false,
        video: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          // width: { ideal: 1920 }, // Prova alta risoluzione se il sensore è Sony IMX
          // height: { ideal: 1080 },
          width: { ideal: 3840 }, // Prova altissima risoluzione se il sensore è Sony IMX
          height: { ideal: 2160 },
          // Richiedere 60fps riduce drasticamente il tempo di esposizione massimo possibile
          // costringendo la camera a essere più veloce (e ridurre la scia)
          frameRate: { ideal: 60, min: 30 } 
        }
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
      }
      setIsActive(true);
    } catch (err) {
      console.error("Errore start:", err);
      setError('Impossibile avviare camera.');
      setIsActive(false);
    }
  };

  // 3. Stop Camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, [stream]);

  const handleTogglePlay = () => isActive ? stopCamera() : startCamera();
  const toggleMirror = () => setIsMirrored(prev => !prev);
  
  // Reset settings
  const resetSettings = () => {
    setZoom(1);
    setBrightness(100);
    setContrast(100);
  };

  const handleDeviceChange = (e) => {
    const newId = e.target.value;
    setSelectedDeviceId(newId);
    if (isActive) {
      stopCamera();
      setTimeout(() => { /* Logica di riavvio manuale o automatica se desiderata */ }, 100);
    }
  };

  return (
    <div style={styles.panelContainer}>

      {/* Area Video */}
      <div style={styles.videoWrapper}>
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        {!isActive && !error && (
          <div style={styles.placeholder}>Standby</div>
        )}

        <video
          ref={videoRef}
          style={{
            ...styles.video,
            // Combiniamo Scale (Zoom) e ScaleX (Mirror)
            transform: `scale(${zoom}) scaleX(${isMirrored ? -1 : 1})`,
            // Applichiamo i filtri CSS
            filter: `brightness(${brightness}%) contrast(${contrast}%)`
          }}
          playsInline
          muted
        />
      </div>

      {/* Barra Comandi Laterale */}
      <div style={styles.controlsBar}>
        
        <div style={styles.topControls}>
          <select 
            onChange={handleDeviceChange} 
            value={selectedDeviceId}
            style={styles.select}
            disabled={devices.length === 0}
          >
            {devices.map((d, i) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Cam ${i + 1}`}
              </option>
            ))}
          </select>

          <button 
            onClick={handleTogglePlay}
            style={isActive ? styles.buttonStop : styles.buttonStart}
          >
            {isActive ? 'STOP' : 'START'}
          </button>
        </div>

        {/* Sliders Area - Visibili solo se attivi (opzionale) */}
        <div style={styles.slidersContainer}>
          
          {/* Zoom Control */}
          <div style={styles.sliderGroup}>
            <label style={styles.label}>Zoom: {zoom.toFixed(1)}x</label>
            <input 
              type="range" 
              min="1" 
              max="3" 
              step="0.1" 
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={styles.rangeInput}
            />
          </div>

          {/* Brightness Control */}
          <div style={styles.sliderGroup}>
            <label style={styles.label}>Luminosità: {brightness}%</label>
            <input 
              type="range" 
              min="50" 
              max="200" 
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              style={styles.rangeInput}
            />
          </div>

          {/* Contrast Control */}
          <div style={styles.sliderGroup}>
            <label style={styles.label}>Contrasto: {contrast}%</label>
            <input 
              type="range" 
              min="50" 
              max="200" 
              value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))}
              style={styles.rangeInput}
            />
          </div>

          <div style={styles.miniBtnGroup}>
            <button onClick={toggleMirror} style={styles.buttonSmall}>↔ Flip</button>
            <button onClick={resetSettings} style={styles.buttonSmall}>↺ Reset</button>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- STILI ---
const styles = {
  panelContainer: {
    display: 'flex',
    flexDirection: 'row-reverse', // Video a sinistra, controlli a destra (o viceversa in base a come lo monti)
    width: 'fit-content',
    backgroundColor: '#111',
    borderRadius: '12px',
    overflow: 'hidden',
    fontFamily: 'sans-serif',
    border: '1px solid #333',
    padding: '10px'
  },
  videoWrapper: {
    position: 'relative', // Ho rimosso Absolute per renderlo più stabile nel layout flex
    width: '640px',       // Larghezza fissa o usa prop width
    height: '480px',      // Altezza fissa o usa prop height
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',   // CRUCIALE: Nasconde le parti zoomate che escono fuori
    borderRadius: '8px',
    marginRight: '10px'
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.1s ease-out, filter 0.1s ease-out', // Animazione fluida
    transformOrigin: 'center center' // Lo zoom avviene dal centro
  },
  placeholder: {
    color: '#666',
    fontSize: '18px'
  },
  errorMessage: {
    color: '#ff4d4d',
    padding: '20px',
    textAlign: 'center'
  },
  controlsBar: {
    width: '180px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: '20px',
    padding: '10px 5px',
    color: '#fff'
  },
  topControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  slidersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '10px',
    borderTop: '1px solid #333',
    paddingTop: '15px'
  },
  sliderGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontSize: '12px',
    color: '#aaa',
    fontWeight: 'bold'
  },
  rangeInput: {
    width: '100%',
    cursor: 'pointer',
    accentColor: '#28a745' // Colore dello slider (funziona su Chrome/Electron)
  },
  select: {
    padding: '6px',
    borderRadius: '4px',
    backgroundColor: '#222',
    color: '#fff',
    border: '1px solid #444',
    width: '100%'
  },
  buttonStart: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#28a745',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  buttonStop: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  miniBtnGroup: {
    display: 'flex',
    gap: '5px',
    marginTop: '10px'
  },
  buttonSmall: {
    flex: 1,
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '11px'
  }
};

export default CameraControlPanel;