// src/BotonWhatsApp.js
import React from 'react';

const BotonWhatsApp = ({ telefono, mensaje }) => {
  if (!telefono) return null; // No renderiza el botón si no hay teléfono

  const numero = telefono.startsWith('+') ? telefono.replace('+', '') : telefono;
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
