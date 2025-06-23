"use client"

import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import ChatbotAdmin from "../components/chatbot/ChatbotAdmin"
import Modal from "../components/Modal"
import AdminCard from "../components/panels/AdminCard"
import AdminHeader from "../components/panels/AdminHeader"
import AdminFooter from "../components/panels/AdminFooter"
import { adminOptionsData } from "../data/AdminOptions"

const AdminPanel = () => {
  const { usuario } = useContext(AuthContext)
  const [showChatbot, setShowChatbot] = useState(false)

  const handleChatbotClick = () => {
    setShowChatbot(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <Navbar />

      <div className="px-6 py-10">
        <AdminHeader />

        {/* Grid de opciones */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {adminOptionsData.map((option, index) => (
              <AdminCard
                key={option.id}
                option={option}
                onClick={option.type === "chatbot" ? handleChatbotClick : undefined}
              />
            ))}
          </div>
        </div>

        <AdminFooter />

        {/* Modal del chatbot */}
        <Modal isOpen={showChatbot} onClose={() => setShowChatbot(false)} size="lg">
          <ChatbotAdmin />
        </Modal>
      </div>
    </div>
  )
}

export default AdminPanel
