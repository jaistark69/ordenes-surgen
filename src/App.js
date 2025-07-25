// src/App.js
import { useState } from 'react';
import Login from './Login';
import OrdenesApp from './OrdenesApp';

function App() {
  const [usuario, setUsuario] = useState(null);

  return usuario ? (
    <OrdenesApp usuario={usuario} />
  ) : (
    <Login onLogin={setUsuario} />
  );
}

export default App;
