"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface ConfirmOptions {
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive"
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>

const ConfirmContext = React.createContext<ConfirmFn | null>(null)

/**
 * Promise-based confirmation dialog. Mount once (e.g. in the admin layout),
 * then call `const confirm = useConfirm()` and `await confirm({...})` in place
 * of the native `window.confirm`.
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const [options, setOptions] = React.useState<ConfirmOptions | null>(null)
    const resolverRef = React.useRef<((result: boolean) => void) | null>(null)

    const confirm = React.useCallback<ConfirmFn>((opts) => {
        setOptions(opts)
        return new Promise<boolean>((resolve) => {
            resolverRef.current = resolve
        })
    }, [])

    const close = React.useCallback((result: boolean) => {
        resolverRef.current?.(result)
        resolverRef.current = null
        setOptions(null)
    }, [])

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <Dialog open={!!options} onOpenChange={(open) => { if (!open) close(false) }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{options?.title}</DialogTitle>
                        {options?.description && (
                            <DialogDescription>{options.description}</DialogDescription>
                        )}
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => close(false)}>
                            {options?.cancelText ?? "Cancel"}
                        </Button>
                        <Button
                            variant={options?.variant === "destructive" ? "destructive" : "default"}
                            onClick={() => close(true)}
                            autoFocus
                        >
                            {options?.confirmText ?? "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ConfirmContext.Provider>
    )
}

export function useConfirm(): ConfirmFn {
    const ctx = React.useContext(ConfirmContext)
    if (!ctx) throw new Error("useConfirm must be used within a ConfirmProvider")
    return ctx
}
