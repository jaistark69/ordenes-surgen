import React, { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

function OrdenesApp({ usuario }) {
  const [ordenes, setOrdenes] = useState([]);
  const [nueva, setNueva] = useState({
    cliente: "",
    direccion: "",
    telefono: "",
    fecha: "",
    notas: "",
    estado: "pendiente",
    firma: false,
  });
  const [firmandoId, setFirmandoId] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const ref = collection(db, "ordenes");
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const datos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrdenes(datos);
    });
    return unsubscribe;
  }, []);

  const agregar = async () => {
    if (!nueva.cliente || !nueva.direccion || !nueva.telefono || !nueva.fecha) {
      alert("Faltan datos obligatorios");
      return;
    }
    await addDoc(collection(db, "ordenes"), nueva);
    setNueva({
      cliente: "",
      direccion: "",
      telefono: "",
      fecha: "",
      notas: "",
      estado: "pendiente",
      firma: false,
    });
  };

  const cambiarEstado = async (id, estado) => {
    const ref = doc(db, "ordenes", id);
    await updateDoc(ref, { estado });
  };

  const iniciarFirma = (id) => {
    setFirmandoId(id);
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let pintando = false;
        const iniciar = () => (pintando = true);
        const parar = () => (pintando = false);
        const dibujar = (e) => {
          if (!pintando) return;
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX || e.touches?.[0]?.clientX;
          const y = e.clientY || e.touches?.[0]?.clientY;
          ctx.lineTo(x - rect.left, y - rect.top);
          ctx.stroke();
        };
        canvas.addEventListener("mousedown", iniciar);
        canvas.addEventListener("mouseup", parar);
        canvas.addEventListener("mousemove", dibujar);
        canvas.addEventListener("touchstart", iniciar);
        canvas.addEventListener("touchend", parar);
        canvas.addEventListener("touchmove", dibujar);
      }
    }, 200);
  };

  const guardarFirma = async () => {
    const ref = doc(db, "ordenes", firmandoId);
    await updateDoc(ref, { estado: "completado", firma: true });
    setFirmandoId(null);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>📋 Órdenes Surgen</h1>

      <input
        placeholder="Cliente"
        value={nueva.cliente}
        onChange={(e) => setNueva({ ...nueva, cliente: e.target.value })}
      />
      <input
        placeholder="Dirección"
        value={nueva.direccion}
        onChange={(e) => setNueva({ ...nueva, direccion: e.target.value })}
      />
      <input
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

      <ul>
        {ordenes.map((o) => (
          <li key={o.id} style={{ marginTop: 20, background: "#fff", padding: 10, borderRadius: 10 }}>
            <strong>{o.cliente}</strong> - {o.direccion} - {o.telefono}<br />
            Fecha: {o.fecha} <br />
            Notas: {o.notas} <br />
            Estado: {o.estado} <br />
            {o.telefono && (
              <a href={`https://wa.me/${o.telefono.replace(/[^\\d]/g, "")}`} target="_blank" rel="noopener noreferrer">
                📲 WhatsApp
              </a>
            )}
            <br />
            {o.estado !== "completado" && !o.firma && (
              <>
                <select
                  value={o.estado}
                  onChange={(e) => cambiarEstado(o.id, e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en progreso">En progreso</option>
                  <option value="completado">Completado</option>
                </select>
                <button onClick={() => iniciarFirma(o.id)}>✍️ Firmar</button>
              </>
            )}
            {o.firma && <p>✅ Firmado por el cliente</p>}
          </li>
        ))}
      </ul>

      {firmandoId && (
        <div style={{ marginTop: 20 }}>
          <h3>Firma del cliente:</h3>
          <canvas
            ref={canvasRef}
            width={300}
            height={150}
            style={{ border: "1px solid black", background: "#fff" }}
          ></canvas>
          <br />
          <button onClick={guardarFirma}>Guardar firma y completar</button>
        </div>
      )}
    </div>
  );
}

export default OrdenesApp;
