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
        if (!data || data.length === 0) return "";

        // Handle 1 point by duplicating it to make a flat line
        const safeData = data.length === 1 ? [data[0], data[0]] : data;

        const max = Math.max(...safeData, 1); // Avoid div by zero
        // Normalize max slightly higher so graph isn't pegged at top
        // If max is 16, use 20. If max is 64, use 70.
        // Actually simple max is fine, we scale 0 to max.

        const usefulHeight = height - 4; // 2px padding top/bottom

        // X axis: equal steps
        const stepX = width / (safeData.length - 1);

        return safeData.map((val, i) => {
            const x = i * stepX;
            // Scale logic: 
            // 0 -> height (bottom)
            // max -> 0 (top)
            // We use Math.max(max, 10) to keep scale reasonable for low player servers
            const normalized = val / Math.max(max, 12);
            const y = height - 2 - (normalized * usefulHeight);
            return `${x},${y}`;
        }).join(" ");
    }, [data, width, height]);

    // Build polygon points for the gradient fill area (points + bottom-right + bottom-left)
    const fillPoints = useMemo(() => {
        if (!points) return "";
        return `${points} ${width},${height} 0,${height}`;
    }, [points, width, height]);

    if (!points) return null; // Only bail if no points generated

    // Determine trend color if not provided
    const start = data[0];
    const end = data[data.length - 1];
    const trendColor = color ? color : (end >= start ? "#22c55e" : "#ef4444"); // green-500 : red-500

    const gradientId = `sparkline-gradient-${trendColor.replace('#', '')}`;

    return (
        <svg width={width} height={height} className={className} overflow="visible">
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Gradient fill under the curve */}
            <polygon
                points={fillPoints}
                fill={`url(#${gradientId})`}
            />
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
