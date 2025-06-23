"use client"

import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { OrderContext } from "../context/OrderContext"
import api from "../services/api"
import ImagenQR from "../components/ImagenQQR"

const PedidoPage = () => {
  const { pedido, eliminarDelPedido, confirmarPedido } = useContext(OrderContext)
  const [orderId, setOrderId] = useState(null)
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState(false)
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState(null)
  const [comprobante, setComprobante] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const total = pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)

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

  const handleSubirComprobante = async () => {
    if (!comprobante || !orderId) {
      alert("❌ Debes seleccionar una imagen primero.")
      return
    }

    const formData = new FormData()
    formData.append("comprobante_pago", comprobante)

    setIsLoading(true)
    try {
      await api.patch(`orders/${orderId}/upload_comprobante/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      alert("✅ Comprobante subido correctamente.")
    } catch (error) {
      console.error("Error al subir comprobante:", error)
      alert("❌ Error al subir comprobante.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <section className="py-10 px-4 md:px-20">
        {/* Header mejorado */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <span className="text-3xl">🛒</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-800">Tu Pedido</h2>
          </div>
        </div>

        {pedido.length === 0 && !mensajeConfirmacion ? (
          <div className="text-center py-16">
            <div className="p-6 bg-slate-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <span className="text-5xl">🛒</span>
            </div>
            <p className="text-slate-500 text-xl">Tu carrito está vacío</p>
            <p className="text-slate-400 mt-2">Agrega algunos productos para comenzar</p>
          </div>
        ) : (
          <>
            {pedido.length > 0 && (
              <div className="grid gap-6 max-w-4xl mx-auto mb-8">
                {pedido.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold capitalize text-slate-800 mb-3">{item.nombre}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p className="text-slate-600">
                            <span className="font-medium">Descripción:</span> {item.descripcion}
                          </p>
                          <p className="text-slate-600">
                            <span className="font-medium">Cantidad:</span> {item.cantidad}
                          </p>
                          <p className="text-slate-600">
                            <span className="font-medium">Precio unitario:</span>
                            <span className="text-slate-800 font-semibold"> ${item.precio}</span>
                          </p>
                          <p className="text-emerald-600 font-semibold">
                            <span className="font-medium">Subtotal:</span> ${(item.precio * item.cantidad).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => eliminarDelPedido(item.id)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150 group"
                        title="Eliminar producto"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-150 inline-block">
                          🗑️
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="max-w-2xl mx-auto">
              {pedido.length > 0 && !mensajeConfirmacion && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-8 text-center">
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-xl text-slate-600">Total a pagar:</span>
                      <span className="text-4xl font-bold text-emerald-600">${total}</span>
                    </div>
                    <button
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      onClick={handleConfirmarPedido}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Procesando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">✅</span>
                          Confirmar pedido
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {mensajeConfirmacion && (
                <div className="space-y-6">
                  {/* Payment Method Selection - Igual que en PedidoModal */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">💳</span>
                      <h3 className="font-semibold text-slate-800 text-lg">Método de pago</h3>
                    </div>
                    <div className="flex justify-center">
                      <button
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                          metodoPagoSeleccionado === "DEUNA"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white border-2 border-slate-300 text-slate-700 hover:border-blue-400"
                        }`}
                        onClick={() => setMetodoPagoSeleccionado("DEUNA")}
                      >
                        <span className="text-lg">💳</span>
                        DEUNA
                      </button>
                    </div>
                  </div>

                  {/* DEUNA Payment Info + File Upload */}
                  {metodoPagoSeleccionado === "DEUNA" && (
                    <>
                      {/* DEUNA Info */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="text-center space-y-4">
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="text-xl">📱</span>
                            <h4 className="font-semibold text-blue-800 text-lg">Pago con DEUNA</h4>
                          </div>

                          <a
                            href="https://pagar.deuna.app/H92p/..."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                          >
                            <span className="text-lg">🔗</span>
                            Ir a DEUNA
                          </a>

                          <div className="bg-white p-4 rounded-xl border border-blue-200 inline-block">
                            <ImagenQR className="w-32 h-32 mx-auto rounded-lg transition-transform duration-300 ease-in-out hover:scale-110" />
                          </div>
                        </div>
                      </div>

                      {/* File Upload - Aparece después de seleccionar DEUNA */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl">📄</span>
                          <h3 className="font-semibold text-slate-800 text-lg">Comprobante de pago</h3>
                        </div>

                        <div className="space-y-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setComprobante(e.target.files[0])}
                            className="w-full p-4 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:border-slate-400 transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                          />

                          <button
                            onClick={handleSubirComprobante}
                            disabled={!comprobante || isLoading}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {isLoading ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Subiendo...
                              </>
                            ) : (
                              <>
                                <span className="text-lg">📤</span>
                                Subir comprobante
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Success Message */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-2xl">✅</span>
                      <p className="text-green-800 font-semibold text-lg">Pedido confirmado correctamente</p>
                    </div>
                    <p className="text-slate-600">
                      Dirígete a{" "}
                      <Link
                        to="/reservas"
                        className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
                      >
                        Reservas
                      </Link>{" "}
                      para ver el estado de tu pedido.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default PedidoPage
