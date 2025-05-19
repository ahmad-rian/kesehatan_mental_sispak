
import { CircleDot, Heart } from 'lucide-react';

const MinimalistIcon = ({ className = "" }) => (
    <div className={`relative ${className}`}>
        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
            <div className="relative">
                <CircleDot className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-pink-400 rounded-full flex items-center justify-center">
                    <Heart className="w-1 h-1 text-white" fill="currentColor" />
                </div>
            </div>
        </div>
    </div>
);



export default function AppLogo() {
    return (
        <>
            <div className="bg-white dark:bg-gray-800 shadow-lg flex aspect-square size-8 items-center justify-center rounded-xl border border-gray-100 dark:border-gray-700">
                {/* Ganti dengan MinimalistIcon atau CalmIcon sesuai preferensi */}
                <MinimalistIcon className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold text-gray-800 dark:text-gray-200">
                    Kesehatan Mental
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Unsoed
                </span>
            </div>
        </>
    );
}