// src/Login.js
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const acceder = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      onLogin(cred.user.email);
    } catch (e) {
      console.log(e.message); // Muestra el error exacto
      setError("Datos incorrectos. Verifica el correo y la contraseña.");
    }
  };

  return (
    <div className="p-4 space-y-4 text-center">
      <h1 className="text-2xl font-bold mb-4">🔐 Inicia sesión para acceder</h1>
      <input
        type="email"
        placeholder="Correo electrónico"
        className="border p-2 rounded w-full"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="border p-2 rounded w-full"
        onChange={(e) => setPass(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={acceder}>
        Entrar
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
