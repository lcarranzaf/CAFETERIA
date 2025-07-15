import { useState } from "react"
import { HiDownload } from "react-icons/hi"
import Navbar from "../components/layout/Navbar"
import { FaJs, FaPython, FaHtml5, FaCss3Alt, FaReact, FaFigma } from "react-icons/fa"
import { SiTailwindcss, SiDjango } from "react-icons/si"

import cvLuis from "../assets/Currículum Vitae Cv LuisCarranza.png"
import fotoLuis from "../assets/LuisCarranza.jpeg"
import cvAna from "../assets/Currículum Vitae Cv AnadiaOlvera.png"
import fotoAna from "../assets/AnadiaOlvera.jpeg"

const iconosLenguajes = {
  JavaScript: <FaJs className="text-yellow-400 text-lg" />,
  Python: <FaPython className="text-blue-500 text-lg" />,
  HTML: <FaHtml5 className="text-orange-600 text-lg" />,
  CSS: <FaCss3Alt className="text-blue-600 text-lg" />,
  Django: <SiDjango className="text-green-700 text-lg" />,
  "Django Rest Framework": <SiDjango className="text-green-700 text-lg" />,
  React: <FaReact className="text-cyan-400 text-lg" />,
  Figma: <FaFigma className="text-pink-600 text-lg" />,
  TailwindCSS: <SiTailwindcss className="text-sky-400 text-lg" />,
}

const AcercaDesarrolladores = () => {
  const [mostrarCVs, setMostrarCVs] = useState(false)
  const [modalImagen, setModalImagen] = useState(null)

  const desarrolladores = [
    {
      id: 1,
      nombre: "Luis Carranza",
      descripcion: "Desarrollador Backend. Apasionado por construir soluciones prácticas.",
      lenguajes: ["JavaScript", "Python", "Django", "Django Rest Framework", "React", "TailwindCSS"],
      imagenCV: cvLuis,
      fotoPerfil: fotoLuis,
    },
    {
      id: 2,
      nombre: "Anadia Olvera",
      descripcion: "Diseñadora y frontend developer. Enfocada en experiencia de usuario.",
      lenguajes: ["HTML", "CSS", "JavaScript", "React", "Figma", "TailwindCSS"],
      imagenCV: cvAna,
      fotoPerfil: fotoAna,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl text-black font-bold mb-6 text-center">Conoce a los Desarrolladores</h1>

        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
          <div className="grid md:grid-cols-2 gap-6">
            {desarrolladores.map((dev) => (
              <div key={dev.id}>
                <h2 className="text-xl text-black text-center font-semibold">{dev.nombre}</h2>
                <img
                  src={dev.fotoPerfil}
                  alt={`Foto de ${dev.nombre}`}
                  className="mx-auto my-3 w-32 h-32 object-cover rounded-full border-2 border-blue-500 shadow-md"
                />
                <p className="text-gray-600 text-center">{dev.descripcion}</p>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 text-center mb-2">Lenguajes, Framework y Herramientas:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {dev.lenguajes.map((lang, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800"
                      >
                        {iconosLenguajes[lang]}
                        <span>{lang}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => setMostrarCVs(!mostrarCVs)}
            >
              {mostrarCVs ? "Ocultar CVs" : "Ver más"}
            </button>
          </div>

          {mostrarCVs && (
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              {desarrolladores.map((dev) => (
                <div key={dev.id}>
                  <img
                    src={dev.imagenCV}
                    alt={`Currículum de ${dev.nombre}`}
                    className="w-full max-h-[400px] object-contain border rounded-md shadow cursor-pointer"
                    onClick={() => setModalImagen(dev.imagenCV)}
                  />
                  <a
                    href={dev.imagenCV}
                    download={`CV_${dev.nombre.replace(" ", "_")}.png`}
                    className="inline-flex items-center mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    <HiDownload className="mr-2" />
                    Descargar CV
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalImagen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setModalImagen(null)}
        >
          <img
            src={modalImagen}
            alt="Currículum ampliado"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default AcercaDesarrolladores
