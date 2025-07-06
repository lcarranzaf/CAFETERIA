import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Acerca de nosotros */}
        <div>
          <h2 className="text-xl font-bold mb-3">Acerca de Nosotros</h2>
          <p className="text-sm leading-relaxed">
            Somos una cafetería universitaria comprometida con brindar una experiencia única a través de nuestros sabores, atención personalizada y un ambiente acogedor. Nuestro objetivo es ser el punto de encuentro favorito de la comunidad estudiantil.
          </p>
        </div>

        {/* Contacto */}
        <div>
          <h2 className="text-xl font-bold mb-3">Contáctanos</h2>
          <p className="text-sm">📍 Campus Universitario, Edificio C</p>
          <p className="text-sm">📞 +593 987 654 321</p>
          <p className="text-sm">✉️ contacto@cafeteriauni.edu.ec</p>
        </div>

        {/* Redes sociales */}
        <div>
          <h2 className="text-xl font-bold mb-3">Síguenos</h2>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="hover:text-blue-400 text-lg">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-pink-400 text-lg">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-green-400 text-lg">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Cafetería Universitaria. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
