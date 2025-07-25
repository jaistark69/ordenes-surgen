// src/components/FirmaCanvas.js
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const FirmaCanvas = ({ onGuardar }) => {
  const sigRef = useRef();

  const limpiar = () => {
    sigRef.current.clear();
  };

  const guardar = () => {
    if (!sigRef.current.isEmpty()) {
      const imagen = sigRef.current.toDataURL();
      onGuardar(imagen);
    } else {
      alert('La firma está vacía');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <SignatureCanvas
        penColor="black"
        canvasProps={{
          width: 300,
          height: 150,
          className: 'firma-canvas',
          style: {
            touchAction: 'none',
            border: '1px solid #ddd',
            borderRadius: '8px',
          },
        }}
        ref={sigRef}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={limpiar}>Borrar</button>
        <button onClick={guardar} style={{ marginLeft: '10px' }}>Guardar firma</button>
      </div>
    </div>
  );
};

export default FirmaCanvas;
