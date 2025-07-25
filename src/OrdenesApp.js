// src/OrdenesApp.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, updateDoc, doc } from 'firebase/firestore';

function OrdenesApp() {
  const [ordenes, setOrdenes] = useState([]);
  const [nueva, setNueva] = useState({ cliente: '', direccion: '', estado: 'pendiente' });

  useEffect(() => {
    const ref = collection(db, 'ordenes');
    const unsubscribe = onSnapshot(ref, snapshot => {
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrdenes(datos);
    });
    return unsubscribe;
  }, []);

  const agregar = async () => {
    if (!nueva.cliente || !nueva.direccion) {
      alert('Faltan datos');
      return;
    }
    await addDoc(collection(db, 'ordenes'), nueva);
    setNueva({ cliente: '', direccion: '', estado: 'pendiente' });
  };

  const cambiarEstado = async (id, estado) => {
    const ref = doc(db, 'ordenes', id);
    await updateDoc(ref, { estado });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', background: '#fff', borderRadius: '12px' }}>
      <h1>📋 Órdenes Surgen</h1>
      <input
        placeholder="Cliente"
        value={nueva.cliente}
        onChange={e => setNueva({ ...nueva, cliente: e.target.value })}
      />
      <input
        placeholder="Dirección"
        value={nueva.direccion}
        onChange={e => setNueva({ ...nueva, direccion: e.target.value })}
      />
      <button onClick={agregar}>Agregar</button>

      <ul>
        {ordenes.map(o => (
          <li key={o.id}>
            <strong>{o.cliente}</strong> - {o.direccion} - Estado: 
            <select value={o.estado} onChange={e => cambiarEstado(o.id, e.target.value)}>
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En progreso</option>
              <option value="completado">Completado</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdenesApp;
