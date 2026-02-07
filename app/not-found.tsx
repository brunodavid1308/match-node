'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="glass-panel p-8 rounded-2xl max-w-md w-full space-y-6 border-red-500/20">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-white tracking-tight">404</h1>
                    <h2 className="text-xl font-medium text-slate-200">Página no encontrada</h2>
                    <p className="text-slate-400 text-sm">
                        Parece que te has salido de la pista. Esta página no existe o ha sido movida.
                    </p>
                </div>

                <div className="pt-4">
                    <Link href="/">
                        <Button
                            variant="primary"
                            className="w-full gap-2"
                            leftIcon={<Home className="w-4 h-4" />}
                        >
                            Volver al Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
