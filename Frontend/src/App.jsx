import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Hamburguesa from "./pages/Hamburguesa.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import GoogleCallback from "./pages/GoogleCallback.jsx";
import Register from "./pages/Register.jsx";
import Forgot from "./pages/Forgot.jsx";
import Reset from "./pages/Reset.jsx";
import Confirm from "./pages/Confirm.jsx";
import PoliticasTerms from "./pages/PoliticasTerms.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentCancel from "./pages/PaymentCancel.jsx";
import AiSimilarity from "./pages/AiSimilarity.jsx";

import DashboardDonante from "./pages/DashboardDonante.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RecolectorDashboard from "./pages/RecolectorDashboard.jsx";

function App() {
  return (
    <Router>
      {/* Menú visible siempre */}
      <Hamburguesa />

      <Routes>
        
        {/* Páginas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/google/callback" element={<GoogleCallback />} />
        <Route path="/register" element={<Register />} />
        
        {/* Recuperación de contraseña */}
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset/:token" element={<Reset />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentCancel />} />
        <Route path="/ai-test" element={<AiSimilarity />} />

        {/* Confirmación de cuenta */}
        <Route path="/confirm/:token" element={<Confirm />} />

        {/* Dashboard del Donante */}
        <Route path="/donante" element={<DashboardDonante />} />
        {/* Dashboard del Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Dashboard del Recolector */}
        <Route path="/recolector" element={<RecolectorDashboard />} />

        {/* Políticas y términos */}
        <Route path="/politicsterms" element={<PoliticasTerms />} />

        {/* Rutas no encontradas */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />

      </Routes>
    </Router>
  );
}

export default App;
