'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'glass' | 'emerald' | 'blue' | 'purple' | 'lime';
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant = 'primary',
        size = 'md',
        isLoading = false,
        leftIcon,
        rightIcon,
        children,
        disabled,
        ...props
    }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-xl font-black uppercase tracking-tight transition-all duration-300 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 select-none";

        const variants = {
            primary: "bg-white text-slate-950 hover:bg-slate-200 border border-white/20 shadow-[0_8px_20px_rgba(255,255,255,0.1)]",
            secondary: "bg-white/[0.03] text-white hover:bg-white/[0.08] border border-white/10 backdrop-blur-md shadow-lg",
            glass: "glass-panel-pro text-white hover:bg-white/[0.05] border-white/10",
            outline: "border-2 border-white/10 bg-transparent hover:bg-white/[0.02] text-slate-400 hover:text-white",
            ghost: "hover:bg-white/[0.03] text-slate-500 hover:text-white border border-transparent",
            danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
            emerald: "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_8px_20px_rgba(16,185,129,0.2)]",
            blue: "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_8px_20px_rgba(37,99,235,0.2)]",
            purple: "bg-purple-600 text-white hover:bg-purple-500 shadow-[0_8px_20px_rgba(147,51,234,0.2)]",
            lime: "bg-lime-500 text-slate-950 hover:bg-lime-400 shadow-[0_8px_20px_rgba(132,204,22,0.2)]",
        };

        const sizes = {
            sm: "h-9 px-4 text-[10px] tracking-widest",
            md: "h-11 px-6 text-[11px] tracking-tight",
            lg: "h-14 px-8 text-xs tracking-tight",
            xl: "h-16 px-10 text-sm tracking-tighter",
            icon: "h-11 w-11 p-0 rounded-xl"
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        {leftIcon && (
                            <span className="mr-2.5 opacity-80 group-hover:opacity-100 transition-opacity">{leftIcon}</span>
                        )}
                        {children}
                        {rightIcon && (
                            <span className="ml-2.5 opacity-80 group-hover:opacity-100 transition-opacity">{rightIcon}</span>
                        )}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";
