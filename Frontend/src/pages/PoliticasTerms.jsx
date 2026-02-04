import { NavLink } from "react-router-dom";
import Facebook from "../assets/facebook.png";
import Whats from "../assets/whatsapp.png";
import Insta from "../assets/instagram.png";

const PoliticasTerms = () => {
  return (
    <div className="min-h-screen bg-[#fff3f5] text-[#111b30]">
      {/* HERO */}
      <section
        className="relative h-[45vh] md:h-[55vh] bg-black/70"
        style={{
          backgroundImage:
            "url('https://www.hungersolutions.org/wp-content/uploads/2021/08/group-different-people-volunteering-foodbank-poor-people-scaled.jpg')",
          backgroundPosition: "center 20%",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 h-full flex flex-col justify-center">
          <p className="text-pink-200 uppercase tracking-widest text-sm mb-3">
            Donaty-U
          </p>
          <h1 className="text-3xl md:text-5xl text-white font-bold leading-tight">
            Políticas de Privacidad
            <span className="text-pink-200"> & </span>
            Términos de Uso
          </h1>
          <p className="text-gray-200 mt-4 max-w-2xl">
            Transparencia y confianza. Aquí te explicamos cómo protegemos tu
            información y las reglas básicas para usar la plataforma.
          </p>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="-mt-16 md:-mt-20 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-10">
              {/* PRIVACIDAD */}
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#bb5656] mb-4">
                  Políticas de Privacidad
                </h2>
                <p className="text-sm md:text-base mb-4 text-slate-700">
                  La información que proporcionas se utiliza únicamente para
                  gestionar tu cuenta, mejorar el servicio y comunicarte
                  novedades relevantes.
                </p>
                <ul className="space-y-3 text-sm md:text-base">
                  <li className="flex gap-3">
                    <span className="text-[#bb5656] font-bold">01.</span>
                    <span>
                      Recopilamos datos básicos: nombre, correo, teléfono y
                      dirección.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#bb5656] font-bold">02.</span>
                    <span>
                      Protegemos tus datos con medidas de seguridad razonables.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#bb5656] font-bold">03.</span>
                    <span>No vendemos ni compartimos tu información.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#bb5656] font-bold">04.</span>
                    <span>
                      Puedes solicitar actualización o eliminación de tu cuenta.
                    </span>
                  </li>
                </ul>
              </div>

              {/* TÉRMINOS */}
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#bb5656] mb-4">
                  Términos de Uso
                </h2>
                <p className="text-sm md:text-base mb-4 text-slate-700">
                  Al usar esta plataforma aceptas cumplir con las normas de uso
                  responsable y proporcionar información veraz.
                </p>
                <ul className="space-y-3 text-sm md:text-base">
                  <li className="flex gap-3">
                    <span className="text-[#bb5656] font-bold">01.</span>
                    <span>No usar el servicio para actividades ilícitas.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#bb5656] font-bold">02.</span>
                    <span>Respetar a la comunidad y a los demás usuarios.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#bb5656] font-bold">03.</span>
                    <span>
                      Mantener la confidencialidad de tus credenciales.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#bb5656] font-bold">04.</span>
                    <span>
                      La plataforma puede actualizar estos términos sin previo
                      aviso.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 border-t border-pink-100 pt-6 text-sm text-slate-600">
              Última actualización: 26 de enero de 2026.
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-6 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-6">
          <nav className="flex gap-2">
            <NavLink to="/politicsterms" className="text-white hover:underline">
              Políticas de Privacidad
            </NavLink>
            |
            <NavLink to="/politicsterms" className="text-white hover:underline">
              Términos de Uso
            </NavLink>
          </nav>

          <p>© DONATY-U Todos los derechos reservados.</p>

          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61570160151308"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={Facebook}
                alt="Facebook"
                className="w-8 h-8 hover:scale-110 transition-transform"
              />
            </a>
            <a href="https://wa.me/983203628" target="_blank" rel="noreferrer">
              <img
                src={Whats}
                alt="WhatsApp"
                className="w-8 h-8 hover:scale-110 transition-transform"
              />
            </a>
            <a
              href="https://www.instagram.com/donatyecuador/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={Insta}
                alt="Instagram"
                className="w-8 h-8 hover:scale-110 transition-transform"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PoliticasTerms;
