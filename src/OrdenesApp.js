// src/OrdenesApp.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';
import BotonWhatsApp from './BotonWhatsApp';
import FirmaCanvas from './components/FirmaCanvas';

function OrdenesApp({ usuario }) {
  const [ordenes, setOrdenes] = useState([]);
  const [nueva, setNueva] = useState({
    cliente: '',
    direccion: '',
    telefono: '',
    fecha: '',
    notas: '',
    estado: 'pendiente',
    firma: false,
  });

  const [firmandoId, setFirmandoId] = useState(null);

  // Cargar órdenes desde Firestore en tiempo real
  useEffect(() => {
    const ref = collection(db, 'ordenes');
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrdenes(datos);
    });
    return unsubscribe;
  }, []);

  // Agregar una nueva orden
  const agregar = async () => {
    if (!nueva.cliente || !nueva.direccion || !nueva.telefono || !nueva.fecha) {
      alert('Faltan datos obligatorios');
      return;
    }

    await addDoc(collection(db, 'ordenes'), nueva);
    setNueva({
      cliente: '',
      direccion: '',
      telefono: '',
      fecha: '',
      notas: '',
      estado: 'pendiente',
      firma: false,
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ color: '#fff', textShadow: '1px 1px 4px #000' }}>
        Gestión de Órdenes - Surgen
      </h2>

      {/* Formulario */}
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <input
          type="text"
          placeholder="Cliente"
          value={nueva.cliente}
          onChange={(e) => setNueva({ ...nueva, cliente: e.target.value })}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={nueva.direccion}
          onChange={(e) => setNueva({ ...nueva, direccion: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={nueva.telefono}
          onChange={(e) => setNueva({ ...nueva, telefono: e.target.value })}
        />
        <input
          type="date"
          value={nueva.fecha}
          onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
        />
        <textarea
          placeholder="Notas internas"
          value={nueva.notas}
          onChange={(e) => setNueva({ ...nueva, notas: e.target.value })}
        />
        <button onClick={agregar}>Agregar orden</button>
      </div>

      <hr />

      {/* Lista de órdenes */}
      {ordenes.map((orden) => (
        <div
          key={orden.id}
          style={{
            marginBottom: '30px',
            padding: '15px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            color: '#000',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <p><strong>Cliente:</strong> {orden.cliente}</p>
          <p><strong>Dirección:</strong> {orden.direccion}</p>
          <p><strong>Teléfono:</strong> {orden.telefono}</p>
          <p><strong>Fecha:</strong> {orden.fecha}</p>
          <p><strong>Notas:</strong> {orden.notas}</p>
          <p><strong>Estado:</strong> {orden.estado}</p>

          {/* Botón de WhatsApp */}
          <BotonWhatsApp
            telefono={orden.telefono}
            mensaje={`Hola ${orden.cliente}, te escribo desde la app Surgen sobre tu cita del ${orden.fecha}`}
          />

          {/* Firma */}
          <div style={{ marginTop: '10px' }}>
            {orden.firma ? (
              <>
                <p><strong>Firma guardada:</strong></p>
                <img
                  src={orden.firma}
                  alt="Firma del cliente"
                  style={{ border: '1px solid #aaa', maxWidth: '100%' }}
                />
              </>
            ) : (
              <>
                {firmandoId === orden.id ? (
                  <FirmaCanvas
                    onGuardar={async (imagenFirma) => {
                      await updateDoc(doc(db, 'ordenes', orden.id), {
                        firma: imagenFirma,
                        estado: 'firmada',
                      });
                      setFirmandoId(null);
                    }}
                  />
                ) : (
                  <button onClick={() => setFirmandoId(orden.id)}>
                    Firmar orden
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdenesApp;
