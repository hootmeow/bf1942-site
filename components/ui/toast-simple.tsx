"use client"

import * as React from "react"
import { Check, X } from "lucide-react"

interface ToastContextType {
    toast: (props: { title: string; description?: string; variant?: "default" | "destructive" | "success" }) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<{ id: number; title: string; description?: string; variant?: "default" | "destructive" | "success" }[]>([])

    const toast = React.useCallback(({ title, description, variant = "default" }: { title: string; description?: string; variant?: "default" | "destructive" | "success" }) => {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, title, description, variant }])
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 3000)
    }, [])

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`flex items-start gap-3 rounded-md border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5 ${t.variant === "destructive" ? "bg-destructive text-destructive-foreground border-destructive" :
                                t.variant === "success" ? "bg-green-600 text-white border-green-700" :
                                    "bg-background text-foreground border-border"
                            }`}
                    >
                        {t.variant === "success" && <Check className="h-5 w-5 mt-0.5" />}
                        {t.variant === "destructive" && <X className="h-5 w-5 mt-0.5" />}
                        <div>
                            <h3 className="font-semibold text-sm">{t.title}</h3>
                            {t.description && <p className="text-xs opacity-90">{t.description}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
