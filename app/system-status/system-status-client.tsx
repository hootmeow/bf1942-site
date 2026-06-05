"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2, AlertTriangle, RefreshCw, Wifi, WifiOff, Activity } from "lucide-react";

interface ComponentStatus {
  name: string;
  status: "Operational" | "Degraded" | "Maintenance" | "Unknown";
  description: string;
}

interface SystemHealth {
  status: "Operational" | "Degraded" | "Maintenance";
  components: ComponentStatus[];
  services?: ComponentStatus[];
}

const STATUS_CONFIG = {
  Operational: {
    dot: "bg-emerald-500",
    ping: "bg-emerald-500/40",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/8",
    label: "Operational",
    icon: CheckCircle2,
  },
  Degraded: {
    dot: "bg-yellow-500",
    ping: "bg-yellow-500/40",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/8",
    label: "Degraded",
    icon: AlertTriangle,
  },
  Maintenance: {
    dot: "bg-blue-500",
    ping: "bg-blue-500/40",
    text: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/8",
    label: "Maintenance",
    icon: AlertCircle,
  },
  Unknown: {
    dot: "bg-slate-500",
    ping: "bg-slate-500/40",
    text: "text-slate-400",
    border: "border-slate-500/30",
    bg: "bg-slate-500/8",
    label: "Unknown",
    icon: AlertCircle,
  },
};

function StatusDot({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.Unknown;
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      {status === "Operational" && (
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${cfg.ping}`} />
      )}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
    </span>
  );
}

function StatusRow({ item }: { item: ComponentStatus }) {
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.Unknown;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/40 last:border-0">
      <StatusDot status={item.status} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{item.name}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">{item.description}</p>
        )}
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.text} ${cfg.border} ${cfg.bg} shrink-0`}>
        {item.status}
      </span>
    </div>
  );
}

function SectionCard({ title, items, icon: Icon }: { title: string; items: ComponentStatus[]; icon: React.ElementType }) {
  const anyDown = items.some(i => i.status !== "Operational");
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/50 bg-muted/20">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {anyDown ? (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 rounded">
            Issues
          </span>
        ) : (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            All Clear
          </span>
        )}
      </div>
      <div className="px-4 divide-y-0">
        {items.map(item => <StatusRow key={item.name} item={item} />)}
      </div>
    </div>
  );
}

export default function SystemStatusClient() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchHealth(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/health`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setHealth(data);
      setLastChecked(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchHealth(); }, []);

  const globalCfg = health
    ? STATUS_CONFIG[health.status] ?? STATUS_CONFIG.Unknown
    : null;

  const components = (health?.components ?? []).filter(c => c.name !== "Telemetry Ingestion");
  const services   = health?.services ?? [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-[#0d1208] via-[#0a0f06] to-[#060a04] p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-10 right-0 h-48 w-48 rounded-full bg-primary/8 blur-[70px]" />
        <div className="pointer-events-none absolute -bottom-10 left-0 h-40 w-40 rounded-full bg-cyan-500/6 blur-[60px]" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="rounded-xl bg-primary/20 p-3 shrink-0 w-fit">
            <Activity className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">System Status</h1>
            <p className="text-sm text-slate-400 mt-0.5">Real-time health of bf1942.online services</p>
          </div>
          {lastChecked && (
            <button
              onClick={() => fetchHealth(true)}
              disabled={refreshing}
              className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 bg-muted/20 hover:bg-muted/40 px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Checking status...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/8 p-6 flex items-start gap-4">
          <div className="rounded-lg bg-red-500/15 p-2 shrink-0">
            <WifiOff className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-red-400">Status Unavailable</p>
            <p className="text-sm text-red-400/70 mt-1">Could not reach the status service. The API gateway may be down.</p>
            <button
              onClick={() => fetchHealth(true)}
              className="mt-3 text-xs text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Global banner */}
      {!loading && health && globalCfg && (
        <>
          <div className={`rounded-xl border p-4 flex items-center gap-4 ${globalCfg.border} ${globalCfg.bg}`}>
            <StatusDot status={health.status} />
            <div className="flex-1">
              <p className={`font-semibold text-base ${globalCfg.text}`}>
                {health.status === "Operational" ? "All Systems Operational" : `System ${health.status}`}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {health.status === "Operational"
                  ? "All services are online and responding normally."
                  : "Some services are experiencing issues or undergoing maintenance."}
              </p>
            </div>
            {lastChecked && (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground shrink-0">
                <Wifi className="h-3 w-3" />
                <span>Live</span>
              </div>
            )}
          </div>

          {/* Component sections */}
          {components.length > 0 && (
            <SectionCard title="Infrastructure" items={components} icon={Activity} />
          )}
          {services.length > 0 && (
            <SectionCard title="Background Services" items={services} icon={RefreshCw} />
          )}

          {/* Last checked */}
          {lastChecked && (
            <p className="text-center text-[11px] text-muted-foreground/50">
              Last checked at {lastChecked.toLocaleTimeString()} — refreshes on demand
            </p>
          )}
        </>
      )}
    </div>
  );
}
