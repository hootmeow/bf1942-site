"use client"

import { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/toast-simple" // Updated to use toast-simple as seen in other files
import { Pencil, Loader2, Save } from "lucide-react"
import { updateProfileSettings, type ProfileUpdateState } from "@/app/actions/profile-actions"

// --- ISO Country List (Partial for now, can be expanded) ---
const COUNTRIES = [
    { code: "", name: "No Flag" },
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "PL", name: "Poland" },
    { code: "NL", name: "Netherlands" },
    { code: "RU", name: "Russia" },
    { code: "UA", name: "Ukraine" },
    { code: "BR", name: "Brazil" },
    { code: "AU", name: "Australia" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "CN", name: "China" },
    { code: "SE", name: "Sweden" },
    { code: "FI", name: "Finland" },
    { code: "NO", name: "Norway" },
    { code: "DK", name: "Denmark" },
    { code: "ES", name: "Spain" },
    { code: "IT", name: "Italy" },
]

interface EditProfileDialogProps {
    playerId: number
    initialBio?: string | null
    initialCountry?: string | null
    initialTitle?: string | null
    initialDiscordVisible?: boolean
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
        </Button>
    )
}

export function EditProfileDialog({
    playerId,
    initialBio,
    initialCountry,
    initialTitle,
    initialDiscordVisible
}: EditProfileDialogProps) {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    // Using simple action binding for now, effectively handling response in client wrapper if needed
    // or utilizing standard useFormState
    const [state, formAction] = useFormState(updateProfileSettings, {})

    // Effect to close dialog on success
    if (state.ok && open) {
        setOpen(false)
        toast({ title: "Updated", description: state.message, variant: "success" })
        // Reset state so it doesn't immediately close next time
        state.ok = false
    } else if (state.error && open) {
        // We can toast here too, but React rendering lifecycle might make it spammy if not careful.
        // Better to show error in UI.
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Customize how you appear to others on the site.
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-6 pt-4">
                    <input type="hidden" name="playerId" value={playerId} />

                    {/* Error Display */}
                    {state.error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                            {state.error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Custom Title */}
                        <div className="space-y-2">
                            <Label htmlFor="customTitle">Battle Title</Label>
                            <Input
                                id="customTitle"
                                name="customTitle"
                                defaultValue={initialTitle || ""}
                                placeholder="e.g. Tank Ace, Pilot, Medic..."
                                maxLength={50}
                            />
                            <p className="text-[0.8rem] text-muted-foreground">Appears next to your name. Max 50 chars.</p>
                        </div>

                        {/* Country / Flag */}
                        <div className="space-y-2">
                            <Label htmlFor="isoCountryCode">Country / Flag</Label>
                            <select
                                id="isoCountryCode"
                                name="isoCountryCode"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                defaultValue={initialCountry || ""}
                            >
                                {COUNTRIES.map(c => (
                                    <option key={c.code} value={c.code}>
                                        {c.code ? `${getFlagEmoji(c.code)} ${c.name}` : "No Flag"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio / About Me</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                defaultValue={initialBio || ""}
                                placeholder="Tell other players about yourself..."
                                maxLength={280}
                                className="resize-none h-24"
                            />
                            <p className="text-[0.8rem] text-muted-foreground">Max 280 characters.</p>
                        </div>

                        {/* Show Discord ID */}
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="displayDiscordId" className="text-base">Show Discord ID</Label>
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Allow others to see your connected Discord tag.
                                </p>
                            </div>
                            <Switch
                                id="displayDiscordId"
                                name="displayDiscordId"
                                defaultChecked={initialDiscordVisible}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <SubmitButton />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// Simple Utility to get emoji flag from country code
function getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}
