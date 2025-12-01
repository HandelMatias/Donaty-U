import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Hamburguesa from "./pages/Hamburguesa.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Forgot from "./pages/Forgot.jsx";
import Reset from "./pages/Reset.jsx";
import Confirm from "./pages/Confirm.jsx";

import DashboardDonante from "./pages/DashboardDonante.jsx";

function App() {
  return (
    <Router>
      {/* Menú visible siempre */}
      <Hamburguesa />

      <Routes>
        
        {/* Páginas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Recuperación de contraseña */}
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset/:token" element={<Reset />} />

        {/* Confirmación de cuenta */}
        <Route path="/confirm/:token" element={<Confirm />} />

        {/* Dashboard del Donante */}
        <Route path="/donante" element={<DashboardDonante />} />

        {/* Rutas no encontradas */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />

      </Routes>
    </Router>
  );
}

export default App;
