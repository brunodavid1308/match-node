'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface CardContainerProps {
    children: React.ReactNode;
    className?: string;
    isLive?: boolean;
    glowColor?: 'emerald' | 'blue' | 'purple' | 'lime' | 'red';
    as?: React.ElementType;
}

export function CardContainer({
    children,
    className,
    isLive = false,
    glowColor = 'emerald',
    as: Component = 'div',
}: CardContainerProps) {

    const glowClasses = {
        emerald: 'glow-emerald border-emerald-500/30',
        blue: 'glow-blue border-blue-500/30',
        purple: 'glow-purple border-purple-500/30',
        lime: 'glow-lime border-lime-500/30',
        red: 'glow-red border-red-500/30',
    };

    return (
        <Component
            className={cn(
                "relative group overflow-hidden rounded-3xl glass-panel-pro p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl",
                isLive && glowClasses[glowColor],
                isLive && "ring-1 ring-white/20",
                className
            )}
        >
            {/* Background ambient light for live events */}
            {isLive && (
                <div className={cn(
                    "absolute -inset-24 opacity-20 blur-[80px] transition-opacity duration-1000 group-hover:opacity-30 pointer-events-none",
                    glowColor === 'emerald' && "bg-emerald-500",
                    glowColor === 'blue' && "bg-blue-500",
                    glowColor === 'purple' && "bg-purple-500",
                    glowColor === 'lime' && "bg-lime-500",
                    glowColor === 'red' && "bg-red-500"
                )} />
            )}

            {/* Content wrapper */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Active status pulse indicator (optional overlay) */}
            {isLive && (
                <div className="absolute top-0 right-0 p-4">
                    <span className="relative flex h-2 w-2">
                        <span className={cn(
                            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                            glowColor === 'emerald' && "bg-emerald-400",
                            glowColor === 'blue' && "bg-blue-400",
                            glowColor === 'purple' && "bg-purple-400",
                            glowColor === 'lime' && "bg-lime-400",
                            glowColor === 'red' && "bg-red-400"
                        )}></span>
                        <span className={cn(
                            "relative inline-flex rounded-full h-2 w-2",
                            glowColor === 'emerald' && "bg-emerald-500",
                            glowColor === 'blue' && "bg-blue-500",
                            glowColor === 'purple' && "bg-purple-500",
                            glowColor === 'lime' && "bg-lime-500",
                            glowColor === 'red' && "bg-red-500"
                        )}></span>
                    </span>
                </div>
            )}
        </Component>
    );
}
