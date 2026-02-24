"use client"

import { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/toast-simple"
import { Pencil, Loader2, Save, X, Plus } from "lucide-react"
import { updateProfileSettings, type ProfileUpdateState } from "@/app/actions/profile-actions"
import { trackEvent } from "@/lib/analytics"
import { ThemePicker } from "@/components/theme-picker"

// --- ISO Country List ---
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
    initialTheme?: string | null
    initialFavoriteMaps?: string[] | null
    initialGalleryUrls?: string[] | null
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
    initialDiscordVisible,
    initialTheme,
    initialFavoriteMaps,
    initialGalleryUrls,
}: EditProfileDialogProps) {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()
    const [state, formAction] = useFormState(updateProfileSettings, {})

    const [theme, setTheme] = useState(initialTheme || "default")
    const [favoriteMaps, setFavoriteMaps] = useState<string[]>(initialFavoriteMaps || [])
    const [galleryUrls, setGalleryUrls] = useState<string[]>(initialGalleryUrls || [])
    const [newMap, setNewMap] = useState("")
    const [newUrl, setNewUrl] = useState("")

    if (state.ok && open) {
        trackEvent("profile_edit", { player_id: String(playerId) })
        setOpen(false)
        toast({ title: "Updated", description: state.message, variant: "success" })
        state.ok = false
    }

    const addMap = () => {
        const trimmed = newMap.trim()
        if (trimmed && favoriteMaps.length < 10 && !favoriteMaps.includes(trimmed)) {
            setFavoriteMaps([...favoriteMaps, trimmed])
            setNewMap("")
        }
    }

    const addGalleryUrl = () => {
        const trimmed = newUrl.trim()
        if (trimmed && galleryUrls.length < 6) {
            setGalleryUrls([...galleryUrls, trimmed])
            setNewUrl("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Customize how you appear to others on the site.
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-6 pt-4">
                    <input type="hidden" name="playerId" value={playerId} />
                    <input type="hidden" name="profileTheme" value={theme} />
                    <input type="hidden" name="favoriteMaps" value={JSON.stringify(favoriteMaps)} />
                    <input type="hidden" name="galleryUrls" value={JSON.stringify(galleryUrls)} />

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

                        {/* Profile Theme */}
                        <div className="space-y-2">
                            <Label>Profile Theme</Label>
                            <ThemePicker value={theme} onChange={setTheme} />
                        </div>

                        {/* Favorite Maps */}
                        <div className="space-y-2">
                            <Label>Favorite Maps</Label>
                            <div className="flex flex-wrap gap-1.5">
                                {favoriteMaps.map((m, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs">
                                        {m}
                                        <button type="button" onClick={() => setFavoriteMaps(favoriteMaps.filter((_, idx) => idx !== i))}>
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            {favoriteMaps.length < 10 && (
                                <div className="flex gap-2">
                                    <Input
                                        value={newMap}
                                        onChange={(e) => setNewMap(e.target.value)}
                                        placeholder="e.g. El Alamein"
                                        className="flex-1"
                                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMap() } }}
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={addMap}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <p className="text-[0.8rem] text-muted-foreground">Up to 10 maps.</p>
                        </div>

                        {/* Gallery URLs */}
                        <div className="space-y-2">
                            <Label>Gallery Images (URLs)</Label>
                            <div className="space-y-1.5">
                                {galleryUrls.map((url, i) => (
                                    <div key={i} className="flex items-center gap-2 rounded-md bg-secondary/50 px-2 py-1">
                                        <span className="text-xs truncate flex-1">{url}</span>
                                        <button type="button" onClick={() => setGalleryUrls(galleryUrls.filter((_, idx) => idx !== i))}>
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {galleryUrls.length < 6 && (
                                <div className="flex gap-2">
                                    <Input
                                        value={newUrl}
                                        onChange={(e) => setNewUrl(e.target.value)}
                                        placeholder="https://i.imgur.com/..."
                                        className="flex-1"
                                        type="url"
                                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addGalleryUrl() } }}
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={addGalleryUrl}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <p className="text-[0.8rem] text-muted-foreground">Up to 6 image URLs.</p>
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

function getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}
