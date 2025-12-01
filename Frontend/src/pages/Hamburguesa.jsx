import { useState } from "react";
import { NavLink } from "react-router-dom";
import LogoDonaty from "../assets/LogoDEc.png"; // Ajusta la ruta si es necesario

const Hamburguesa = () => {
const [isOpen, setIsOpen] = useState(false);

return (
<header className="w-full bg-gray-400 black shadow-sm px-6 flex justify-between items-center h-24 relative">

    {/* Logo */}
    <div className="flex items-center gap-4">
    <img src={LogoDonaty} className="h-40 w-auto" alt="Logo Donaty" />
    </div>

    {/* Menú escritorio */}
    <nav className="hidden md:flex gap-6 items-center text-gray-800 font-semibold">
        <NavLink
        to="/"
        className={({ isActive }) => isActive ? "text-blue-600" : "hover:text-blue-500"}
        >
        Inicio
        </NavLink>
        <NavLink
        to="/login"
        className={({ isActive }) => isActive ? "text-green-600" : "hover:text-green-500"}
        >
        Login
        </NavLink>
        <NavLink
        to="/register"
        className={({ isActive }) => isActive ? "text-blue-600" : "hover:text-blue-500"}
        >
        Registro
        </NavLink>
    </nav>

      {/* Botón hamburguesa móvil */}
    <button
        className="md:hidden text-3xl font-bold"
        onClick={() => setIsOpen(!isOpen)}
    >
        ☰
    </button>

      {/* Menú móvil */}
    {isOpen && (
        <nav className="absolute top-24 right-6 bg-white shadow-lg rounded-lg flex flex-col gap-4 p-4 md:hidden w-40 z-50">
        <NavLink to="/" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>
            Inicio
        </NavLink>
        <NavLink to="/login" className="hover:text-green-500" onClick={() => setIsOpen(false)}>
            Login
        </NavLink>
        <NavLink to="/register" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>
            Registro
        </NavLink>
        </nav>
    )}
    </header>
);
};

export default Hamburguesa;
