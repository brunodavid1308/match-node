import { DashboardSkeleton } from '@/components/shared';

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="animate-fade-in">
                <DashboardSkeleton />
            </div>
        </div>
    );
}
