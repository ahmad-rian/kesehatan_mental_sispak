import { Head } from '@inertiajs/react';
import { LoaderCircle, Heart, Shield, Users, Star } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginProps {
    status?: string;
    error?: string;
}

export default function Login({ status, error }: LoginProps) {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = () => {
        setLoading(true);
        window.location.href = '/auth/google';
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const floatingVariants = {
        initial: { y: 0, rotate: 0 },
        animate: {
            y: [-15, 15, -15],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden flex items-center justify-center p-4">
            <Head title="Masuk - Kesehatan Mental Unsoed" />
            
            {/* Enhanced Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"
                    variants={floatingVariants}
                    initial="initial"
                    animate="animate"
                />
                <motion.div
                    className="absolute top-40 right-20 w-24 h-24 bg-purple-400/15 rounded-full blur-xl"
                    variants={floatingVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 1 }}
                />
                <motion.div
                    className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl"
                    variants={floatingVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 2 }}
                />
                <motion.div
                    className="absolute bottom-40 right-10 w-28 h-28 bg-blue-300/20 rounded-full blur-2xl"
                    variants={floatingVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.5 }}
                />
                
                {/* Decorative shapes */}
                <motion.div
                    className="absolute top-1/4 left-10 w-3 h-3 bg-blue-400/40 rounded-full"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400/50 rounded-full"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.9, 0.5]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
            </div>

            <motion.div
                className="w-full max-w-md space-y-8 relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Logo dan Header */}
                <motion.div 
                    className="text-center space-y-4"
                    variants={itemVariants}
                >
                    <motion.div 
                        className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden"
                        whileHover={{ scale: 1.1, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                                x: ['-100%', '100%']
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                        />
                        <Heart className="w-12 h-12 text-white relative z-10" fill="currentColor" />
                    </motion.div>
                    
                    <div>
                        <motion.h1 
                            className="text-4xl font-bold text-gray-900"
                            variants={itemVariants}
                        >
                            Kesehatan Mental
                        </motion.h1>
                        <motion.p 
                            className="text-base text-gray-600 mt-2"
                            variants={itemVariants}
                        >
                            Universitas Jenderal Soedirman
                        </motion.p>
                    </div>
                </motion.div>

                {/* Main Login Card */}
                <motion.div 
                    className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden relative"
                    variants={itemVariants}
                    whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {/* Card highlight effect */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                    />
                    
                    <div className="px-10 py-12">
                        <motion.div 
                            className="text-center mb-10"
                            variants={itemVariants}
                        >
                            <h2 className="text-2xl font-bold text-gray-900">Selamat Datang</h2>
                            <p className="mt-3 text-gray-600 leading-relaxed">
                                Masuk dengan akun Google Anda untuk mengakses sistem
                            </p>
                        </motion.div>
                        
                        <motion.div className="space-y-8" variants={itemVariants}>
                            {/* Status Messages with enhanced styling */}
                            <AnimatePresence>
                                {status && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                        className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl relative overflow-hidden"
                                    >
                                        <motion.div
                                            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.2 }}
                                        />
                                        <p className="text-sm text-green-800 font-medium">{status}</p>
                                    </motion.div>
                                )}
                                
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                        className="p-5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl relative overflow-hidden"
                                    >
                                        <motion.div
                                            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-pink-500"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.2 }}
                                        />
                                        <p className="text-sm text-red-800 font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Enhanced Google Sign In Button */}
                            <motion.button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="group relative w-full h-16 bg-white border-2 border-gray-200 hover:border-blue-300 rounded-2xl text-gray-900 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-4 overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                {/* Button shine effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                />
                                
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                        >
                                            <LoaderCircle className="w-7 h-7 animate-spin text-blue-600" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="content"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex items-center space-x-4 relative z-10"
                                        >
                                            <motion.svg
                                                className="w-7 h-7 group-hover:scale-110 transition-transform duration-200"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                                whileHover={{ rotate: 5 }}
                                            >
                                                <path
                                                    fill="#4285F4"
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                />
                                                <path
                                                    fill="#34A853"
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                />
                                                <path
                                                    fill="#FBBC05"
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                />
                                                <path
                                                    fill="#EA4335"
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                />
                                            </motion.svg>
                                            <span className="text-lg">Masuk dengan Google</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            {/* Divider with animation */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <motion.span 
                                        className="w-full border-t border-gray-200"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                    />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-4 text-gray-500 font-medium">Atau</span>
                                </div>
                            </div>

                            {/* Help Link with enhanced styling */}
                            <motion.div 
                                className="text-center"
                                variants={itemVariants}
                            >
                                <p className="text-sm text-gray-600">
                                    Butuh bantuan?{' '}
                                    <motion.a
                                        href="mailto:support@unsoed.ac.id"
                                        className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-blue-300 hover:decoration-blue-500 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        Hubungi Admin
                                    </motion.a>
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Feature highlights */}
                <motion.div 
                    className="grid grid-cols-3 gap-4 mt-8"
                    variants={itemVariants}
                >
                    {[
                        { icon: Shield, label: "Aman" },
                        { icon: Users, label: "Profesional" },
                        { icon: Star, label: "Terpercaya" }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="text-center space-y-2 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40"
                            whileHover={{ y: -2, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                <feature.icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-xs font-medium text-gray-700">{feature.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer */}
                <motion.div 
                    className="text-center text-xs text-gray-500 space-y-1 pt-4"
                    variants={itemVariants}
                >
                    <p>© 2025 Universitas Jenderal Soedirman</p>
                    <p>Sistem Kesehatan Mental Mahasiswa</p>
                </motion.div>
            </motion.div>
        </div>
    );
}