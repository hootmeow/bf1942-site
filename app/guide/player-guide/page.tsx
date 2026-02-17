
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
    Info,
    Lightbulb,
    Swords,
    Shield,
    Zap
} from "lucide-react"

export const metadata: Metadata = {
    title: "Ultimate Player's Guide",
    description: "A comprehensive collection of community tips, mechanics, and strategies for Battlefield 1942.",
};

// --- Tip Data Structure ---
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
        <div className="container mx-auto max-w-5xl py-12 space-y-12">

            {/* Header */}
            <div className="space-y-4 text-center">
                <Badge variant="outline" className="mb-2">Community Knowledge Base</Badge>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    The Ultimate Player's Guide
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                    A collection of veteran tactics, hidden mechanics, and advanced strategies to dominate the battlefield.
                </p>
            </div>

            {/* Hero Tip */}
            <Alert className="border-primary/50 bg-primary/5">
                <Lightbulb className="h-5 w-5 text-primary" />
                <AlertTitle className="text-lg font-semibold text-primary">Pro Tip: The Buddy List</AlertTitle>
                <AlertDescription className="mt-2 text-base text-foreground/80">
                    Want to track your friends or rivals? Open the console (~ key) and type
                    <code className="mx-2 rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-bold">ab &lt;player_id&gt;</code>
                    (e.g., ab 4). That player's name and kills will now show up in <span className="text-green-600 font-bold">GREEN</span> in the kill feed.
                    You only need to do this once per player!
                </AlertDescription>
            </Alert>

            {/* Content Grid */}
            <div className="grid gap-8 md:grid-cols-2">

                {/* Infantry */}
                <Card className="border-t-4 border-t-red-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Users className="h-6 w-6 text-red-500" /> Infantry Tactics
                        </CardTitle>
                        <CardDescription>Survival on the ground.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {infantryTips.map((tip, i) => (
                                <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                                    <span className="text-red-500 font-bold select-none">•</span>
                                    <span dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Vehicles */}
                <Card className="border-t-4 border-t-green-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Swords className="h-6 w-6 text-green-500" /> Tank & Armor
                        </CardTitle>
                        <CardDescription>Mastering heavy metal.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {vehicleTips.map((tip, i) => (
                                <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                                    <span className="text-green-500 font-bold select-none">•</span>
                                    <span dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Planes */}
                <Card className="border-t-4 border-t-blue-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Plane className="h-6 w-6 text-blue-500" /> Air Combat
                        </CardTitle>
                        <CardDescription>Dogfighting and bombing runs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {planeTips.map((tip, i) => (
                                <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                                    <span className="text-blue-500 font-bold select-none">•</span>
                                    <span dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Ships */}
                <Card className="border-t-4 border-t-cyan-600 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Ship className="h-6 w-6 text-cyan-600" /> Naval Warfare
                        </CardTitle>
                        <CardDescription>Ruling the high seas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {shipTips.map((tip, i) => (
                                <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                                    <span className="text-cyan-600 font-bold select-none">•</span>
                                    <span dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

            </div>

            {/* Mechanics Accordion */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Game Mechanics & Hidden Features</h2>
                <Accordion type="single" collapsible className="w-full bg-card rounded-lg border px-4">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg font-medium">
                            <span className="flex items-center gap-2"><Zap className="h-5 w-5 text-yellow-500" /> Advanced Controls & Chat</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <p>• <strong>Auto-Run:</strong> Hold <code>W</code> and press <code>K</code> or <code>L</code> to open chat. You will keep running while typing.</p>
                            <p>• <strong>Console:</strong> Access the console with <code>~</code>. Use Page Up/Down to scroll through chat history.</p>
                            <p>• <strong>Radio Silence:</strong> Enemy players can hear your <code>F5-F7</code> voice commands if they are close. They cannot hear radio requests (F1-F4).</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-lg font-medium">
                            <span className="flex items-center gap-2"><Target className="h-5 w-5 text-red-500" /> Hitboxes & Damage</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <p>• <strong>Headshots:</strong> Bullets to the head do ~60% more damage than to the chest.</p>
                            <p>• <strong>Legs:</strong> Hitting legs does 40% less damage than the chest. Always aim center-mass or high.</p>
                            <p>• <strong>Distance:</strong> Shotgun and Medic SMG damage drops off significantly over distance.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-lg font-medium">
                            <span className="flex items-center gap-2"><Shield className="h-5 w-5 text-blue-500" /> Protocol & Etiquette</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <p>• <strong>Don't steal repairs:</strong> If you see a vehicle empty but near an engineer, don't jump in. They are likely repairing it.</p>
                            <p>• <strong>No Solo Tanking:</strong> If someone is in the gunner seat, don't drive off to the middle of nowhere without checking targets.</p>
                            <p>• <strong>Spotting:</strong> As a spotter, spot once. Don't spam. It blocks the artillery player's view.</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

        </div>
    );
}
