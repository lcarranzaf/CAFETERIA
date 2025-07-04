import { useState, useEffect } from "react"
import api from "../services/api"

const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([])
  const [nuevas, setNuevas] = useState(0)

  const cargarNotificaciones = async () => {
    try {
      const response = await api.get("/notificaciones/")
      const lista = Array.isArray(response.data) ? response.data : []
      setNotificaciones(lista)
      const nuevasNoLeidas = lista.filter(n => !n.leido).length
      setNuevas(nuevasNoLeidas)
    } catch (error) {
      console.error("Error al cargar notificaciones:", error)
    }
  }

  const marcarComoLeidas = async () => {
    try {
      await api.post("/notificaciones/marcar_como_leidas/")
      setNuevas(0)
      await cargarNotificaciones() 
    } catch (error) {
      console.error("Error al marcar notificaciones como leídas:", error)
    }
  }

  useEffect(() => {
    cargarNotificaciones()
  }, [])

  return {
    notificaciones,
    nuevas,
    cargarNotificaciones,
    marcarComoLeidas,
  }
}

export default useNotificaciones
