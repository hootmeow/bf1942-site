"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
    value: number;
    duration?: number; // ms
    decimals?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function AnimatedCounter({
    value,
    duration = 1000,
    decimals = 0,
    prefix = "",
    suffix = "",
    className = "",
}: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    animateValue(0, value, duration);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [value, duration, hasAnimated]);

    // Re-animate if value changes significantly
    useEffect(() => {
        if (hasAnimated) {
            animateValue(displayValue, value, duration / 2);
        }
    }, [value]);

    const animateValue = (start: number, end: number, animDuration: number) => {
        const startTime = performance.now();
        const diff = end - start;

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animDuration, 1);

            // Ease out cubic for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setDisplayValue(start + diff * easeOut);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    const formattedValue = decimals > 0
        ? displayValue.toFixed(decimals)
        : Math.round(displayValue).toLocaleString();

    return (
        <span ref={ref} className={className}>
            {prefix}{formattedValue}{suffix}
        </span>
    );
}
