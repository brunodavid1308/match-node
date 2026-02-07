import { cn } from '@/lib/utils';

interface SkeletonCardProps {
    className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
    return (
        <div className={cn("relative overflow-hidden rounded-[2rem] glass-panel-pro p-6", className)}>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

            {/* Header skeleton */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-[14px] bg-white/[0.03] animate-pulse" />
                <div className="space-y-2.5">
                    <div className="w-24 h-3 rounded bg-white/[0.05] animate-pulse" />
                    <div className="w-16 h-2 rounded bg-white/[0.02] animate-pulse" />
                </div>
            </div>

            {/* Title skeleton */}
            <div className="space-y-3 mb-6">
                <div className="w-full h-6 rounded-lg bg-white/[0.03] animate-pulse" />
                <div className="w-2/3 h-6 rounded-lg bg-white/[0.03] animate-pulse" />
            </div>

            {/* Details skeleton */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-3 rounded bg-white/[0.02] animate-pulse" />
                    <div className="w-24 h-3 rounded bg-white/[0.02] animate-pulse" />
                </div>
                <div className="w-16 h-8 rounded-xl bg-white/[0.04] animate-pulse" />
            </div>
        </div>
    );
}

export function SkeletonSection() {
    return (
        <section className="space-y-6">
            {/* Section header skeleton */}
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 rounded-full bg-emerald-500 animate-pulse" />
                <div className="w-40 h-6 rounded-lg bg-white/[0.03] animate-pulse" />
            </div>

            {/* Cards grid - Bento layout style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <SkeletonCard className="md:col-span-2" />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </section>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-10">
            <SkeletonSection />
            <SkeletonSection />
        </div>
    );
}
