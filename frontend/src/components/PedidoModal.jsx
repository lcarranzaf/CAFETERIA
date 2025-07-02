import { useContext, useEffect, useState } from "react"
import Modal from "./Modal"
import { OrderContext } from "../context/OrderContext"
import { Link } from "react-router-dom"
import api from "../services/api"
import Toast from "./Toast"

const PedidoModal = ({ isOpen, onClose }) => {
  const { pedido, eliminarDelPedido, confirmarPedido, actualizarCantidadPedido } = useContext(OrderContext)
  const [orderId, setOrderId] = useState(null)
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState(false)
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState(null)
  const [comprobante, setComprobante] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const total = pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)

  const hayStockInsuficiente = pedido.some(item => item.cantidad > item.stock)

  useEffect(() => {
    if (!isOpen) {
      setOrderId(null)
      setMensajeConfirmacion(false)
      setMetodoPagoSeleccionado(null)
      setComprobante(null)
      setIsLoading(false)
      setToastMessage('')
      setShowToast(false)
    }
  }, [isOpen])

  const mostrarToast = (mensaje) => {
    setToastMessage(mensaje)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const handleConfirmarPedido = async () => {
    setIsLoading(true)
    try {
      const pedidoCreado = await confirmarPedido()
      setOrderId(pedidoCreado.id)
      setMensajeConfirmacion(true)
    } catch (error) {
      alert("❌ Error al confirmar el pedido")
    } finally {
      setIsLoading(false)
    }
  }

  const handleActualizarCantidad = (id, nuevaCantidad) => {
    const item = pedido.find(p => p.id === id)
    if (!item) return

    if (nuevaCantidad < 1) {
      eliminarDelPedido(id)
    } else if (nuevaCantidad > item.stock) {
      mostrarToast(`❌ Stock agotado para ${item.nombre}`)
    } else {
      actualizarCantidadPedido(id, nuevaCantidad)
    }
  }

  const handleSubirComprobante = async () => {
    if (!comprobante || !orderId || !metodoPagoSeleccionado) {
      alert("❌ Debes seleccionar método de pago.")
      return
    }

    const formData = new FormData()
    formData.append("comprobante_pago", comprobante)
    formData.append("metodo_pago", metodoPagoSeleccionado)

    setIsLoading(true)
    try {
      await api.patch(`orders/${orderId}/upload_comprobante/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      mostrarToast("Comprobante subido correctamente ✅")
      setMetodoPagoSeleccionado(null)
      setComprobante(null)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Error al subir comprobante:", error)
      alert("❌ Error al subir comprobante.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <span className="text-xl">🛒</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Tu Pedido</h2>
          </div>
        </div>

        {pedido.length === 0 && !mensajeConfirmacion ? (
          <div className="text-center py-8">
            <div className="p-3 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl">🛒</span>
            </div>
            <p className="text-slate-500">Tu carrito está vacío</p>
            <p className="text-slate-400 text-sm mt-1">Agrega algunos productos para comenzar</p>
          </div>
        ) : (
          <>
            {pedido.length > 0 && (
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {pedido.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 border border-slate-200 p-3 rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 capitalize mb-1">{item.nombre}</h3>
                        <div className="space-y-1 mb-3">
                          <p className="text-xs text-slate-600">
                            Precio: <span className="font-medium text-slate-800">${item.precio}</span>
                          </p>
                          <p className="text-xs text-emerald-600 font-medium">
                            Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls con stock */}
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-xs font-medium text-slate-600">Cantidad:</span>
                          <div className="flex items-center bg-white border border-slate-300 rounded overflow-hidden">
                            <button
                              onClick={() => handleActualizarCantidad(item.id, item.cantidad - 1)}
                              className="px-2 py-1 bg-gray-300 hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-800 font-bold"
                              disabled={item.cantidad <= 1}
                            >
                              −
                            </button>
                            <span className="px-3 py-1 font-medium text-slate-800 text-sm">{item.cantidad}</span>
                            <button
                              onClick={() => handleActualizarCantidad(item.id, item.cantidad + 1)}
                              className="px-2 py-1 bg-gray-300 hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-800 font-bold"
                              disabled={item.cantidad >= item.stock}
                            >
                              +
                            </button>
                          </div>

                          <p className="text-xs text-slate-500">
                            Stock disponible: <span className={`font-semibold ${item.stock === 0 ? "text-red-500" : "text-emerald-600"}`}>{item.stock}</span>
                          </p>

                          {item.cantidad > item.stock && (
                            <p className="text-xs text-red-500 font-medium mt-1">
                              Stock insuficiente para {item.nombre}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => eliminarDelPedido(item.id)}
                        className="ml-2 p-1 bg-gray-300 text-red-500 hover:bg-red-400 rounded transition-colors group"
                        title="Eliminar producto"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-150 inline-block ">🗑️</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pedido.length > 0 && !mensajeConfirmacion && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-slate-600">Total a pagar:</span>
                    <span className="text-2xl font-bold text-emerald-600">${total}</span>
                  </div>
                  <button
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleConfirmarPedido}
                    disabled={isLoading || hayStockInsuficiente}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Procesando...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>✅</span>
                        Confirmar pedido
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Confirmación de pedido y subida de comprobante */}
            {mensajeConfirmacion && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">💳</span>
                    <h3 className="font-semibold text-slate-800">Método de pago</h3>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                        metodoPagoSeleccionado === "DEUNA"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white border-2 border-slate-300 text-slate-700 hover:border-blue-400"
                      }`}
                      onClick={() => setMetodoPagoSeleccionado("DEUNA")}
                    >
                      <span className="text-sm">💳</span>
                      DEUNA
                    </button>
                  </div>
                </div>

                {metodoPagoSeleccionado === "DEUNA" && (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center space-y-3">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-lg">📱</span>
                        <h4 className="font-semibold text-blue-800">Pago con DEUNA</h4>
                      </div>
                      <a
                        href="https://pagar.deuna.app/H92p/..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                      >
                        <span>🔗</span>
                        Ir a DEUNA
                      </a>
                      <div className="bg-white p-3 rounded-lg border border-blue-200 inline-block">
                        <img src="/qrDeuna.jpeg" alt="QR Deuna" className="w-24 h-24 mx-auto rounded" />
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">📄</span>
                        <h3 className="font-semibold text-slate-800">Comprobante de pago</h3>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setComprobante(e.target.files[0])}
                          className="w-full p-3 border-2 border-dashed border-slate-300 rounded-lg bg-white hover:border-slate-400 transition-colors duration-200 text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                        />
                        <button
                          onClick={handleSubirComprobante}
                          disabled={!comprobante || isLoading}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Subiendo...
                            </>
                          ) : (
                            <>
                              <span>📤</span>
                              Subir comprobante
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl">✅</span>
                    <p className="text-green-800 font-semibold">Pedido confirmado correctamente</p>
                  </div>
                  <p className="text-slate-600 text-sm">
                    Revisa tus {" "}
                    <Link
                      to="/reservas"
                      className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
                      onClick={onClose}
                    >
                      reservas
                    </Link>{" "}
                    para ver el estado de tu pedido.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
      <Toast message={toastMessage} show={showToast} type="success" />
    </>
  )
}

export default PedidoModal
