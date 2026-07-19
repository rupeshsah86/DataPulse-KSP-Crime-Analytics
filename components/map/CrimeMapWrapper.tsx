'use client';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/Spinner';

// Dynamically import the map with SSR disabled
const CrimeMap = dynamic(
    () => import('./CrimeMap').then((mod) => mod.CrimeMap),
    {
        ssr: false,
        loading: () => (
            <div className="h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        ),
    }
);

export default CrimeMap;