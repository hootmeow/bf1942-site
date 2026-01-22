import { useMemo } from "react";

interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
    className?: string;
}

export function Sparkline({ data, width = 100, height = 30, color, className }: SparklineProps) {
    const points = useMemo(() => {
        if (!data || data.length < 2) return "";

        const max = Math.max(...data, 1); // Avoid div by zero
        const min = Math.min(...data);
        const range = max - min || 1;

        // Simple normalization to fit height
        // X axis: equal steps
        const stepX = width / (data.length - 1);

        return data.map((val, i) => {
            const x = i * stepX;
            // Invert Y because SVG 0 is top
            // Scale val to 0..height (with padding maybe?)
            // Let's use 80% of height to avoid clipping strokes
            const padding = 2;
            const usefulHeight = height - (padding * 2);

            // Let's just scale 0 to max, not min to max, so 0 is always bottom
            // Logic: val=0 -> y=height.  val=max -> y=0
            const normalized = val / Math.max(max, 10); // Scale relative to at least 10 players so 1 player doesn't look like a spike
            const y = height - (normalized * usefulHeight) - padding;
            return `${x},${y}`;
        }).join(" ");
    }, [data, width, height]);

    if (!data || data.length < 2) return null;

    // Determine trend color if not provided
    const start = data[0];
    const end = data[data.length - 1];
    const trendColor = color ? color : (end >= start ? "#22c55e" : "#ef4444"); // green-500 : red-500

    return (
        <svg width={width} height={height} className={className} overflow="visible">
            {/* Optional: Fill area? Maybe too noisy. Just line for now */}
            <polyline
                points={points}
                fill="none"
                stroke={trendColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Dot at the end */}
            <circle
                cx={width}
                cy={points.split(" ").pop()?.split(",")[1]}
                r="2"
                fill={trendColor}
            />
        </svg>
    );
}
