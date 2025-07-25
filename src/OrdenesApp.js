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
    estado: "pendiente",
    fecha: "",
    notas: "",
  });
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
    if (!nueva.cliente || !nueva.direccion || !nueva.fecha) {
      alert("Faltan datos");
      return;
    }
    await addDoc(collection(db, "ordenes"), nueva);
    setNueva({ cliente: "", direccion: "", estado: "pendiente", fecha: "", notas: "" });
  };

  const cambiarEstado = async (id, estado) => {
    const ref = doc(db, "ordenes", id);
    await updateDoc(ref, { estado });
  };

  const guardarFirma = async (id) => {
    const canvas = canvasRef.current;
    const imagen = canvas.toDataURL();
    const ref = doc(db, "ordenes", id);
    await updateDoc(ref, { estado: "cerrada", firma: imagen });
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const limpiarFirma = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const dibujar = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto", background: "#fff", borderRadius: "12px" }}>
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
        type="date"
        value={nueva.fecha}
        onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
      />
      <textarea
        placeholder="Notas internas"
        value={nueva.notas}
        onChange={(e) => setNueva({ ...nueva, notas: e.target.value })}
      />
      <button onClick={agregar}>Agregar</button>

      <ul>
        {ordenes.map((o) => (
          <li key={o.id} style={{ marginTop: "20px" }}>
            <strong>{o.cliente}</strong> - {o.direccion}<br />
            📅 Cita: {o.fecha}<br />
            🗒️ Notas: {o.notas}<br />
            Estado: {o.estado}
            {o.estado !== "cerrada" && (
              <select
                value={o.estado}
                onChange={(e) => cambiarEstado(o.id, e.target.value)}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en progreso">En progreso</option>
                <option value="completado">Completado</option>
              </select>
            )}
            {o.estado === "completado" && !o.firma && (
              <div style={{ marginTop: "10px" }}>
                <p>✍️ Firma del cliente:</p>
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={100}
                  style={{ border: "1px solid #000" }}
                  onMouseDown={(e) => {
                    const ctx = canvasRef.current.getContext("2d");
                    ctx.beginPath();
                    dibujar(e);
                    canvasRef.current.addEventListener("mousemove", dibujar);
                  }}
                  onMouseUp={() => {
                    canvasRef.current.removeEventListener("mousemove", dibujar);
                  }}
                />
                <div style={{ marginTop: "5px" }}>
                  <button onClick={() => guardarFirma(o.id)}>Guardar firma y cerrar</button>
                  <button onClick={limpiarFirma} style={{ marginLeft: "10px" }}>Limpiar</button>
                </div>
              </div>
            )}
            {o.firma && (
              <div>
                <p>🖊️ Firma guardada:</p>
                <img src={o.firma} alt="Firma del cliente" style={{ width: 200, border: "1px solid #000" }} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdenesApp;
