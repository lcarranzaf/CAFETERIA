import { FaFacebookF, FaInstagram, FaWhatsapp, FaGithub } from "react-icons/fa";

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
          <p className="text-sm">📍 Campus Universitario, Polideportivo</p>
          <p className="text-sm">✉️ lcarranzaf@unemi.edu.ec</p>
          <p className="text-sm">✉️ aolverab2@unemi.edu.ec</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-3">Síguenos</h2>

          <div className="flex items-center gap-2 mt-2">
            <FaGithub className="text-lg" />
            <a href="https://github.com/lcarranzaf" className="hover:text-blue-400 text-sm font-medium" target="_blank" rel="noopener noreferrer">
              Luis Carranza
            </a>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <FaGithub className="text-lg" />
            <a href="https://github.com/anadiaolvera" className="hover:text-blue-400 text-sm font-medium" target="_blank" rel="noopener noreferrer">
              Anadia Olvera
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
