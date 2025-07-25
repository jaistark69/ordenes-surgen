// src/BotonWhatsApp.js
import React from 'react';

const BotonWhatsApp = ({ telefono, mensaje }) => {
  if (!telefono) return null;

  // Forzar que el número tenga prefijo internacional
  let numero = telefono.toString().trim();
  if (numero.startsWith('6') || numero.startsWith('7')) {
    numero = '34' + numero; // Asumimos España si no tiene prefijo
  }
  if (numero.startsWith('+')) {
    numero = numero.slice(1); // Quitamos el "+"
  }

  const mensajeCodificado = encodeURIComponent(mensaje || '');
  const enlace = `https://wa.me/${numero}?text=${mensajeCodificado}`;

  const abrirWhatsApp = () => {
    window.open(enlace, '_blank');
  };

  return (
    <button
      onClick={abrirWhatsApp}
      style={{
        backgroundColor: '#25D366',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
    >
      Contactar por WhatsApp
    </button>
  );
};

export default BotonWhatsApp;
