import { createPortal } from "react-dom"

const Modal = ({ isOpen, onClose, children, size = "lg" }) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-4xl",
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className={`bg-white text-black font-normal p-4 sm:p-6 rounded-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto shadow-xl relative`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-300 text-gray-950 hover:text-red-600 text-xl rounded-full px-2 z-10"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") || document.body,
  )
}

export default Modal
