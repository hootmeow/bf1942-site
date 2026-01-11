import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon | React.ElementType;
    className?: string;
    description?: string;
}

export function StatCard({ title, value, icon: Icon, className, description }: StatCardProps) {
    return (
        <div className={cn("rounded-lg border border-border/60 bg-card/40 p-4", className)}>
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                </div>
                <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
                    <p className="text-xl font-bold text-foreground">{value}</p>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
