'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="glass-panel p-8 rounded-2xl max-w-md w-full space-y-6 border-red-500/20">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">¡Vaya! Algo salió mal</h2>
                    <p className="text-slate-400 text-sm">
                        Hemos tenido un problema técnico. El equipo de mecánicos (nuestros devs) ya está en ello.
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 p-4 bg-red-950/30 rounded-lg text-left overflow-auto max-h-40">
                            <p className="text-xs text-red-400 font-mono break-all">{error.message}</p>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <Button
                        onClick={reset}
                        variant="primary"
                        className="w-full gap-2"
                        leftIcon={<RefreshCw className="w-4 h-4" />}
                    >
                        Intentar de nuevo
                    </Button>
                </div>
            </div>
        </div>
    );
}
