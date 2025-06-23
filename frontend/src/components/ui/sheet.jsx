"use client"

import React from "react"

export const Sheet = ({ children, open, onOpenChange }) => {
  return (
    <>
      {open && <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange(false)} />}
      {children}
    </>
  )
}

export const SheetContent = ({ children, side = "left", className = "" }) => {
  return (
    <div
      className={`fixed inset-y-0 ${side === "left" ? "left-0" : "right-0"} z-50 h-full w-3/4 max-w-sm bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${className}`}
    >
      {children}
    </div>
  )
}

export const SheetTrigger = ({ children, asChild, ...props }) => {
  if (asChild) {
    return React.cloneElement(children, props)
  }
  return <button {...props}>{children}</button>
}

export const SheetHeader = ({ children, className = "" }) => {
  return <div className={`flex flex-col space-y-2 text-center sm:text-left p-6 border-b ${className}`}>{children}</div>
}

export const SheetTitle = ({ children, className = "" }) => {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
}
