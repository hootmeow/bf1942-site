import type { Metadata } from 'next';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
    Crosshair,
    Ship,
    Plane,
    Target,
    Users,
    Lightbulb,
    Swords,
    Shield,
    Zap,
    BookOpen,
} from "lucide-react"

export const metadata: Metadata = {
    title: "Ultimate Player's Guide",
    description: "A comprehensive collection of community tips, mechanics, and strategies for Battlefield 1942.",
};

const infantryTips = [
    "**Keep Moving:** Always zig-zag! Standing still makes you an easy target for snipers.",
    "**Barbed Wire:** You can run through or jump over widely spaced wire posts, but the wire itself causes damage over time.",
    "**Sidearm Quick-Switch:** Map your pistol to the middle mouse button for rapid switching in emergencies.",
    "**Medic Intel:** Medics can see health percentages of teammates. Healing has a radius and works through walls.",
    "**Engineer:** You can repair vehicles while moving or prone. Use 'Crouch' (Ctrl) with the wrench to pick up your own mines.",
    "**Mine Tactics:** Mines last for 6 minutes (or 30s after you die). Place them on tank treads of stationary tanks for a nasty surprise when they move.",
    "**Knife:** The knife deals instant death with a headshot. There is no slash animation delay.",
];

const vehicleTips = [
    "**3rd Person View:** Use 'C' to get a wider field of view and see over obstacles.",
    "**Tank Armor:** The rear is weakest. The tracks (on Tigers/M10s) are also vulnerable. Angled hits do less damage.",
    "**Ramming:** Ramming a tank with a jeep (especially one loaded with dynamite) is a valid, high-damage tactic.",
    "**Smoke Signals:** White smoke = ~60% dmg, Grey = ~70%, Black = Critical damage.",
    "**Position Jumping:** In solo artillery or tanks, switch between Driver (1) and Gunner (2) to be a one-man army.",
    "**Resupply:** APCs and Ammo Boxes replenish tank and artillery ammo. Park next to one!",
];

const planeTips = [
    "**Engine Weakness:** Shoot the engines! For B17s, they are on the wings.",
    "**Bombing:** Don't dive *immediately* after dropping a bomb or you might hit it. Pull up!",
    "**Rear Guns:** If pursued, fly smoothly to give your tail gunner a steady shot. Or fly to friendly flak.",
    "**Low Flying:** Flying extremely low makes you harder to hit with flak and hides you from ship defenses.",
    "**Torpedoes:** Drop them low and slow. They have unlimited range in water. 7-8 hits sink a battleship.",
    "**Look Around:** Use 'C' or joystick hat switch to track enemies.",
    "**BF109 vs Spitfire:** The BF109 climbs better; use verticality. The Spitfire turns better; don't dogfight it horizontally.",
];

const shipTips = [
    "**Repair:** Engineers can repair ships! Repair while your main guns reload.",
    "**Gun Switching:** Jump between front and rear guns on destroyers to maximize firepower if you are alone.",
    "**Landing Craft Door:** Use the **Up-Arrow** key while driving (Position 1) to open the door. You can do this before hitting the beach.",
    "**Submarine Depth:** Stay at periscope depth (1.9m Allied, 1.5m Axis) to see but remain mostly hidden.",
    "**Sonar:** Destroyers reload depth charges automatically. Use right-click sonar to find subs.",
    "**Ramming:** Subs can ram landing craft to sink them without taking damage.",
    "**Ship Defense:** Flak guns can hurt destroyers, but it takes a long time.",
];

const mechanicsTips = [
    "**FPS Counter:** Open console (`~`) and type `fps 1` to show frames per second. The number in the top-left is your current/average FPS.",
    "**Buddy List:** Type `~ab <playerid>` in console to add a 'buddy'. Their name will appear green in the kill feed.",
    "**Auto-Run:** Hold 'W' and press 'K' (Chat) to keep running while typing.",
    "**Sound:** Use headphones. Positional audio is a huge advantage for hearing footsteps and vehicle engines.",
    "**Spotting:** Don't spam spot requests. If you are artillery, ask for a spot (`F2 F6`), then confirm (`F1 F1`).",
    "**Flag Cap:** Flags take exactly 10 seconds to change state. If it takes longer, it's contested.",
];

export default function PlayerGuidePage() {
    return (
        <div className="space-y-8">

            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
                {/* Background blur orbs */}
                <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-primary/10 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-blue-500/10 blur-[70px]" />

                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
                        <div className="rounded-xl bg-primary/20 p-3">
                            <BookOpen className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                    Ultimate Player's Guide
                                </h1>
                                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                                    Community Knowledge
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                Veteran tactics, hidden mechanics, and advanced strategies from the BF1942 community.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pro Tip Alert */}
            <Alert className="border-primary/30 bg-primary/5">
                <Lightbulb className="h-5 w-5 text-primary" />
                <AlertTitle className="text-lg font-semibold text-primary">Pro Tip: The Buddy List</AlertTitle>
                <AlertDescription className="mt-2 text-base">
                    Want to track your friends or rivals? Open the console (~ key) and type
                    <code className="mx-2 rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-bold">ab &lt;player_id&gt;</code>
                    (e.g., ab 4). That player's name and kills will now show up in <span className="text-green-600 font-bold">GREEN</span> in the kill feed.
                    You only need to do this once per player!
                </AlertDescription>
            </Alert>

            {/* Combat Tips Grid */}
            <div className="grid gap-4 md:grid-cols-2">

                {/* Infantry */}
                <Card className="border-border/60 bg-card/40 card-hover">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="rounded-lg bg-red-500/15 p-2 text-red-400">
                                <Users className="h-5 w-5" />
                            </div>
                            Infantry Tactics
                        </CardTitle>
                        <CardDescription>Survival on the ground.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2.5">
                            {infantryTips.map((tip, i) => (
                                <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                                    <span className="text-red-400 font-bold select-none mt-0.5">•</span>
                                    <span dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Vehicles */}
                <Card className="border-border/60 bg-card/40 card-hover">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="rounded-lg bg-green-500/15 p-2 text-green-400">
                                <Swords className="h-5 w-5" />
                            </div>
                            Tank & Armor
                        </CardTitle>
                        <CardDescription>Mastering heavy metal.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2.5">
                            {vehicleTips.map((tip, i) => (
                                <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                                    <span className="text-green-400 font-bold select-none mt-0.5">•</span>
                                    <span dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Planes */}
                <Card className="border-border/60 bg-card/40 card-hover">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="rounded-lg bg-blue-500/15 p-2 text-blue-400">
                                <Plane className="h-5 w-5" />
                            </div>
                            Air Combat
                        </CardTitle>
                        <CardDescription>Dogfighting and bombing runs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2.5">
                            {planeTips.map((tip, i) => (
                                <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                                    <span className="text-blue-400 font-bold select-none mt-0.5">•</span>
                                    <span dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Ships */}
                <Card className="border-border/60 bg-card/40 card-hover">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="rounded-lg bg-cyan-500/15 p-2 text-cyan-400">
                                <Ship className="h-5 w-5" />
                            </div>
                            Naval Warfare
                        </CardTitle>
                        <CardDescription>Ruling the high seas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2.5">
                            {shipTips.map((tip, i) => (
                                <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                                    <span className="text-cyan-400 font-bold select-none mt-0.5">•</span>
                                    <span dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

            </div>

            {/* Mechanics & Hidden Features */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Zap className="h-6 w-6 text-primary" />
                        Game Mechanics & Hidden Features
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Advanced techniques and lesser-known game mechanics.
                    </p>
                </div>

                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" className="border-border/40">
                                <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/30">
                                    <span className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-amber-400" />
                                        <span className="font-medium">Advanced Controls & Chat</span>
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4 text-sm space-y-2">
                                    <p className="leading-relaxed"><strong>Auto-Run:</strong> Hold <code className="bg-muted px-1 py-0.5 rounded text-xs">W</code> and press <code className="bg-muted px-1 py-0.5 rounded text-xs">K</code> or <code className="bg-muted px-1 py-0.5 rounded text-xs">L</code> to open chat. You will keep running while typing.</p>
                                    <p className="leading-relaxed"><strong>Console:</strong> Access the console with <code className="bg-muted px-1 py-0.5 rounded text-xs">~</code>. Use Page Up/Down to scroll through chat history.</p>
                                    <p className="leading-relaxed"><strong>Radio Silence:</strong> Enemy players can hear your <code className="bg-muted px-1 py-0.5 rounded text-xs">F5-F7</code> voice commands if they are close. They cannot hear radio requests (F1-F4).</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-border/40">
                                <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/30">
                                    <span className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-red-400" />
                                        <span className="font-medium">Hitboxes & Damage</span>
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4 text-sm space-y-2">
                                    <p className="leading-relaxed"><strong>Headshots:</strong> Bullets to the head do ~60% more damage than to the chest.</p>
                                    <p className="leading-relaxed"><strong>Legs:</strong> Hitting legs does 40% less damage than the chest. Always aim center-mass or high.</p>
                                    <p className="leading-relaxed"><strong>Distance:</strong> Shotgun and Medic SMG damage drops off significantly over distance.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-b-0">
                                <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/30">
                                    <span className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-blue-400" />
                                        <span className="font-medium">Protocol & Etiquette</span>
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4 text-sm space-y-2">
                                    <p className="leading-relaxed"><strong>Don't steal repairs:</strong> If you see a vehicle empty but near an engineer, don't jump in. They are likely repairing it.</p>
                                    <p className="leading-relaxed"><strong>No Solo Tanking:</strong> If someone is in the gunner seat, don't drive off to the middle of nowhere without checking targets.</p>
                                    <p className="leading-relaxed"><strong>Spotting:</strong> As a spotter, spot once. Don't spam. It blocks the artillery player's view.</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
