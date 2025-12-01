import LogoDonaty from '/src/assets/LogoDEc.png'
import Juguetes from '/src/assets/Imagen2.png'
import ComidaVegetales from '/src/assets/Imagen4.png'
import Ropa from '/src/assets/Imagen5.png'
import Facebook from '/src/assets/facebook.png'
import Cash from '/src/assets/Donacion-monetaria.png'
import Whats from '/src/assets/whatsapp.png'
import Insta from '/src/assets/instagram.png'
import { NavLink } from 'react-router-dom'

const Home = () => {

    // Donaciones de ejemplo (estáticas)
    const donaciones = [
        {
            id: 1,
            nombre: "Carlos Q.",
            tipoDonacion: "Juguetes",
            comentarios: "Muy feliz de ayudar",
            fotos: Juguetes
        },
        {
            id: 2,
            nombre: "María P.",
            tipoDonacion: "Alimentos",
            comentarios: "Espero que les guste",
            fotos: ComidaVegetales
        },
        {
            id: 3,
            nombre: "Luis F.",
            tipoDonacion: "Ropa",
            comentarios: "Ropa en buen estado",
            fotos: Ropa
        }
    ];

    return (
        <>
            {/* HEADER */}
            <header className="relative flex flex-col gap-40 bg-black/70 h-full"
                style={{ backgroundImage: "url('https://www.hungersolutions.org/wp-content/uploads/2021/08/group-different-people-volunteering-foodbank-poor-people-scaled.jpg')",
                        backgroundPosition: "center 20%",
                        backgroundSize: "cover" }}>
                <div className="flex items-center w-full px-6 py-40">
                </div>
                
            </header>

<div className="w-full overflow-hidden bg-gray-100 py-4">
<div className="inline-block whitespace-nowrap transition-transform duration-15000 ease-linear hover:translate-x-[-100%]">
    <span className="text-lg md:text-2xl font-sans text-black px-6 inline-block">
    Uniendo corazones, cambiando vidas. "El amor, el apoyo y la amabilidad vienen como regalos con envoltura de esperanza de personas que no conocemos".
    </span>
    <span className="text-lg md:text-2xl font-sans text-black px-6 inline-block">
    Uniendo corazones, cambiando vidas. "El amor, el apoyo y la amabilidad vienen como regalos con envoltura de esperanza de personas que no conocemos".
    </span>
</div>
</div>

            {/* SECCIÓN CATEGORÍAS */}
            <section className="py-8 bg-[#fff3f5]">
                <div className="text-center px-6">
                    <h2 className="text-3xl md:text-4xl text-[#bb5656] mb-4 font-sans">Categorías</h2>
                    <p className="text-xl md:text-2xl text-[#111b30] mb-12">"El amor es donar tu alma a otro".</p>

                    <div className="flex flex-wrap justify-center gap-6">
                        {/* Juguetes */}
                        <div className="bg-[#f6e2e2] rounded-lg shadow-lg w-80 p-5 flex flex-col items-center">
                            <img src={Juguetes} alt="juguetes" className="w-80 h-64 object-cover rounded mb-3 hover:scale-105 transition-transform"/>
                            <h3 className="text-[#772026] text-xl font-bold mb-2 text-center">Juguetes</h3>
                            <p className="text-sm text-center">
                                ¡Haz la diferencia en la vida de un niño! Este año, te invitamos a donar un juguete nuevo o en buen estado para aquellos que no tienen la oportunidad de recibir uno.
                            </p>
                        </div>

                        {/* Alimentos */}
                        <div className="bg-[#f6e2e2] rounded-lg shadow-lg w-80 p-5 flex flex-col items-center">
                            <img src={ComidaVegetales} alt="comida" className="w-80 h-64 object-cover rounded mb-3 hover:scale-105 transition-transform"/>
                            <h3 className="text-[#772026] text-xl font-bold mb-2 text-center">Alimentos</h3>
                            <p className="text-sm text-center">
                                ¡Tu generosidad puede transformar vidas! Te invitamos a donar alimentos no perecederos para niños que necesitan tu ayuda.
                            </p>
                        </div>

                        {/* Vestimenta */}
                        <div className="bg-[#f6e2e2] rounded-lg shadow-lg w-80 p-5 flex flex-col items-center">
                            <img src={Ropa} alt="ropa" className="w-80 h-64 object-cover rounded mb-3 hover:scale-105 transition-transform"/>
                            <h3 className="text-[#772026] text-xl font-bold mb-2 text-center">Vestimenta</h3>
                            <p className="text-sm text-center">
                                ¡Haz que un niño se sienta especial! Te invitamos a donar ropa en buen estado para niños que lo necesitan.
                            </p>
                        </div>

                        {/* Donacion monetaria */}
                        <div className="bg-[#f6e2e2] rounded-lg shadow-lg w-80 p-5 flex flex-col items-center">
                            <img src={Cash} alt="ropa" className="w-80 h-64 object-cover rounded mb-3 hover:scale-105 transition-transform"/>
                            <h3 className="text-[#772026] text-xl font-bold mb-2 text-center">Aportes Económicos</h3>
                            <p className="text-sm text-center">
                                Contribuye para garantizar la continuidad académica de nuestros estudiantes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* DONACIONES */}
            <section className="py-8 px-6 bg-[#FFE9B7] rounded-lg shadow-inner mb-20">
                <h2 className="text-3xl text-center mb-6">Donaciones realizadas por la comunidad de Donaty</h2>

                <div className="flex overflow-x-auto gap-4 py-4">
                    {donaciones.map((donacion) => (
                        <div key={donacion.id} className="bg-white rounded-lg shadow p-4 min-w-[250px] flex flex-col items-center">
                            <img src={donacion.fotos} alt="donacion" className="w-44 h-36 object-cover rounded mb-3"/>
                            <div className="text-sm text-center">
                                <p>Nombre del donante: {donacion.nombre}</p>
                                <p>Tipo de donación: {donacion.tipoDonacion}</p>
                                <p>Comentario: {donacion.comentarios}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* VIDEO */}
            <section className="relative h-screen overflow-hidden">
                <div className="absolute inset-0 bg-black/70 z-10"></div>
                <iframe 
                    className="absolute inset-0 w-full h-full object-cover z-0" 
                    src="https://www.youtube.com/embed/4INwx_tmTKw?start=304&autoplay=1&mute=1&loop=1&playlist=4INwx_tmTKw" 
                    frameBorder="0" 
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20 px-4">
                    <h1 className="text-3xl md:text-5xl text-[#e2bbb7] mb-4 font-sans">
                        Descubre cómo juntos hemos transformado la vida de muchos niños
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-300">
                        ¡Únete a nosotros y sé parte de este hermoso cambio!
                    </p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#170404] text-white py-6 font-sans">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <nav className="flex gap-2">
                        <NavLink to="/politicsterms" className="text-pink-200 hover:underline">Políticas de Privacidad</NavLink>|
                        <NavLink to="/politicsterms" className="text-pink-200 hover:underline">Términos de Uso</NavLink>
                    </nav>

                    <p>© DONATY-EC. Todos los derechos reservados.</p>

                    <div className="flex gap-4">
                        <a href="https://www.facebook.com/profile.php?id=61570160151308" target="_blank">
                            <img src={Facebook} alt="Facebook" className="w-8 h-8 hover:scale-110 transition-transform"/>
                        </a>
                        <a href="https://wa.me/983203628" target="_blank">
                            <img src={Whats} alt="WhatsApp" className="w-8 h-8 hover:scale-110 transition-transform"/>
                        </a>
                        <a href="https://www.instagram.com/donatyecuador/" target="_blank">
                            <img src={Insta} alt="Instagram" className="w-8 h-8 hover:scale-110 transition-transform"/>
                        </a>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Home;
