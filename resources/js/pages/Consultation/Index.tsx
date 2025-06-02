import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/layouts/public-layout';
import { 
    Heart, 
    Brain, 
    Sparkles, 
    Play,
    MessageCircle,
    Star,
    Clock,
    Smile,
    Coffee,
    Sun,
    Moon,
    Rainbow,
    Zap
} from 'lucide-react';
import { User } from '@/types/user';

interface ConsultationIndexProps {
    active_consultation?: any;
    latest_diagnosis?: any;
    has_history: boolean;
    auth: {
        user?: User;
    };
}

const funnyGreetings = [
    { icon: "👋", text: "Halo sayang! Gimana kabarnya hari ini?" },
    { icon: "🌟", text: "Hai beautiful soul! Siap ngobrol bareng?" },
    { icon: "☕", text: "Heyy! Udah ngopi belum? Yuk cerita-cerita~" },
    { icon: "🦋", text: "Hello butterfly! Mau sharing perasaan hari ini?" },
    { icon: "🌸", text: "Hai dear! Aku udah nungguin kamu loh!" },
];

const moodOptions = [
    { emoji: "😊", label: "Happy Banget!", color: "from-yellow-400 to-orange-400" },
    { emoji: "😌", label: "Santai Aja", color: "from-green-400 to-blue-400" },
    { emoji: "😐", label: "Biasa Aja", color: "from-gray-400 to-gray-500" },
    { emoji: "😔", label: "Agak Down", color: "from-blue-400 to-purple-400" },
    { emoji: "😢", label: "Lagi Sedih", color: "from-purple-400 to-pink-400" },
];

const benefits = [
    { icon: <Heart className="h-6 w-6" />, title: "Aman & Privat", desc: "Cerita apapun disini aman kok!" },
    { icon: <Brain className="h-6 w-6" />, title: "AI yang Care", desc: "Aku bakal dengerin dengan serius" },
    { icon: <Sparkles className="h-6 w-6" />, title: "Tips Personal", desc: "Dapet saran yang cocok buat kamu" },
    { icon: <Star className="h-6 w-6" />, title: "No Judgment", desc: "Zero judgment zone, dijamin!" },
];

export default function ConsultationIndex({ 
    active_consultation, 
    latest_diagnosis, 
    has_history, 
    auth 
}: ConsultationIndexProps) {
    const [selectedGreeting] = useState(funnyGreetings[Math.floor(Math.random() * funnyGreetings.length)]);
    const [selectedMood, setSelectedMood] = useState<string>('');
    const [showMoodSelector, setShowMoodSelector] = useState(false);

    const startConsultation = () => {
        router.post('/consultation/start', {}, {
            onSuccess: () => {
                // Will redirect to question page
            }
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <PublicLayout user={auth?.user} title="Konsultasi Kesehatan Mental">
            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute inset-0">
                        <motion.div 
                            className="absolute top-20 left-20 w-32 h-32 bg-pink-200 rounded-full opacity-60"
                            animate={{
                                y: [-10, 10, -10],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div 
                            className="absolute top-40 right-32 w-24 h-24 bg-blue-200 rounded-full opacity-60"
                            animate={{
                                y: [10, -10, 10],
                                x: [-5, 5, -5],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div 
                            className="absolute bottom-20 left-1/3 w-28 h-28 bg-yellow-200 rounded-full opacity-60"
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div 
                            className="absolute top-1/2 right-20 w-20 h-20 bg-purple-200 rounded-full opacity-60"
                            animate={{
                                y: [-15, 15, -15],
                                opacity: [0.6, 0.3, 0.6],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <motion.div
                            className="text-center"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Fun Greeting */}
                            <motion.div 
                                className="mb-8"
                                variants={itemVariants}
                            >
                                <motion.div 
                                    className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.span 
                                        className="text-4xl"
                                        animate={{
                                            rotate: [0, 20, -20, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {selectedGreeting.icon}
                                    </motion.span>
                                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        {selectedGreeting.text}
                                    </h1>
                                </motion.div>
                            </motion.div>

                            <motion.div 
                                className="max-w-3xl mx-auto mb-12"
                                variants={itemVariants}
                            >
                                <h2 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6">
                                    Yuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Ngobrol</span> 
                                    <br />Bareng Aku! 💭
                                </h2>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Gak perlu malu atau takut ya! Disini kita bisa cerita santai tentang 
                                    perasaan kamu. Aku siap dengerin dan kasih support! ✨
                                </p>
                            </motion.div>

                            {/* Mood Check */}
                            <motion.div variants={itemVariants}>
                                <AnimatePresence mode="wait">
                                    {!showMoodSelector ? (
                                        <motion.div 
                                            className="mb-12"
                                            key="mood-button"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            <motion.button
                                                onClick={() => setShowMoodSelector(true)}
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-3"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Smile className="h-6 w-6" />
                                                <span>Gimana mood kamu hari ini?</span>
                                                <Sparkles className="h-6 w-6" />
                                            </motion.button>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            className="mb-12"
                                            key="mood-selector"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            <p className="text-lg text-gray-700 mb-6">Pilih yang paling deket sama perasaan kamu:</p>
                                            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
                                                {moodOptions.map((mood, index) => (
                                                    <motion.button
                                                        key={index}
                                                        onClick={() => setSelectedMood(mood.label)}
                                                        className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                                                            selectedMood === mood.label 
                                                                ? 'ring-4 ring-purple-400 scale-105' 
                                                                : 'hover:shadow-lg'
                                                        }`}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                                                        <div className="relative">
                                                            <div className="text-4xl mb-2">{mood.emoji}</div>
                                                            <div className="text-sm font-medium text-gray-700">{mood.label}</div>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Start Button */}
                            <motion.div 
                                className="space-y-4"
                                variants={itemVariants}
                            >
                                <motion.button
                                    onClick={startConsultation}
                                    className="group bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 inline-flex items-center space-x-4"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <Play className="h-8 w-8" />
                                    </motion.div>
                                    <span>Mulai Ngobrol Yuk! 🚀</span>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <Zap className="h-8 w-8" />
                                    </motion.div>
                                </motion.button>
                                
                                <AnimatePresence>
                                    {selectedMood && (
                                        <motion.p 
                                            className="text-sm text-gray-600"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            Noted! Kamu lagi {selectedMood.toLowerCase()}. Let's talk about it! 💝
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="bg-white/50 backdrop-blur-sm py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-3xl font-bold text-gray-800 mb-4">
                                Kenapa Harus Ngobrol Sama Aku? 🤔
                            </h3>
                            <p className="text-gray-600 text-lg">
                                Ada beberapa alasan kenapa kamu bakal nyaman cerita disini:
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {benefits.map((benefit, index) => (
                                <motion.div 
                                    key={index}
                                    className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                >
                                    <motion.div 
                                        className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        {benefit.icon}
                                    </motion.div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h4>
                                    <p className="text-gray-600">{benefit.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Previous Results */}
                <AnimatePresence>
                    {has_history && (
                        <motion.section 
                            className="bg-gradient-to-r from-blue-50 to-purple-50 py-16"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <motion.div 
                                    className="bg-white rounded-3xl p-8 shadow-lg"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                        Eh, Kamu Udah Pernah Konsultasi! 🎉
                                    </h3>
                                    {latest_diagnosis && (
                                        <motion.div 
                                            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <p className="text-lg text-gray-700 mb-2">
                                                Hasil terakhir: <span className="font-semibold">{latest_diagnosis.mental_disorder.name}</span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Confidence: {latest_diagnosis.confidence_level}% 
                                                <span className="ml-2">✨</span>
                                            </p>
                                        </motion.div>
                                    )}
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href="/consultation/history"
                                            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                                        >
                                            <MessageCircle className="h-5 w-5" />
                                            <span>Lihat Riwayat Konsultasi</span>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Footer CTA */}
                <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-3xl font-bold mb-4">
                                Ready to Share? 💖
                            </h3>
                            <p className="text-xl text-purple-100 mb-8">
                                Ingat ya, gak ada yang salah dengan cerita tentang perasaan kamu. 
                                Malah itu tanda kamu care sama diri sendiri! 
                            </p>
                            <div className="flex justify-center space-x-4">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                                >
                                    <Coffee className="h-8 w-8" />
                                </motion.div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                >
                                    <Heart className="h-8 w-8" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                >
                                    <Rainbow className="h-8 w-8" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}