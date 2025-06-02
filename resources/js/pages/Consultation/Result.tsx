import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/layouts/public-layout';
import { 
    CheckCircle, 
    Heart, 
    Star,
    TrendingUp,
    Brain,
    Sparkles,
    Coffee,
    Sun,
    MessageCircle,
    Award,
    ArrowRight,
    Share2,
    Download,
    Calendar,
    Target
} from 'lucide-react';
import { User } from '@/types/user';

interface ResultProps {
    consultation: any;
    summary: {
        consultation: any;
        reported_symptoms: string[];
        symptoms_details: any[];
        total_questions: number;
        progress: number;
        final_diagnosis?: any;
        recommendations?: any;
        general_recommendations?: any;
    };
    auth: {
        user?: User;
    };
}

const celebrationMessages = [
    { text: "Yeay! Kamu berhasil menyelesaikan konsultasi! 🎉", emoji: "🎊" },
    { text: "Amazing! Kamu udah satu langkah lebih dekat dengan kesehatan mental yang baik! ✨", emoji: "⭐" },
    { text: "Proud of you! Butuh keberanian untuk ngobrol tentang perasaan! 💪", emoji: "🌟" },
    { text: "Well done bestie! Ini adalah self-care yang sesungguhnya! 💖", emoji: "🦋" },
];

const actionItems = [
    { icon: <Coffee className="h-6 w-6" />, title: "Istirahat sejenak", desc: "Minum air atau teh hangat", color: "from-amber-400 to-orange-500" },
    { icon: <Sun className="h-6 w-6" />, title: "Keluar sebentar", desc: "Hirup udara segar di luar", color: "from-yellow-400 to-orange-400" },
    { icon: <Heart className="h-6 w-6" />, title: "Self-care time", desc: "Lakukan hal yang kamu suka", color: "from-pink-400 to-rose-500" },
    { icon: <Brain className="h-6 w-6" />, title: "Refleksi", desc: "Tulis perasaan di jurnal", color: "from-purple-400 to-indigo-500" },
];

export default function ConsultationResult({ consultation, summary, auth }: ResultProps) {
    const [celebration] = useState(celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'from-green-400 to-emerald-500';
        if (confidence >= 60) return 'from-yellow-400 to-orange-500';
        return 'from-blue-400 to-purple-500';
    };

    const getConfidenceMessage = (confidence: number) => {
        if (confidence >= 80) return "Hasil ini cukup akurat! 🎯";
        if (confidence >= 60) return "Hasil ini lumayan akurat 👍";
        return "Hasil ini sebagai gambaran awal ya 💡";
    };

    const diagnosis = summary.final_diagnosis;
    
    const getRecommendations = () => {
        if (summary.recommendations && typeof summary.recommendations === 'string') {
            return {
                type: 'string',
                content: summary.recommendations
            };
        }
        
        if (summary.general_recommendations && typeof summary.general_recommendations === 'object') {
            return {
                type: 'structured',
                content: summary.general_recommendations
            };
        }
        
        if (summary.general_recommendations && Array.isArray(summary.general_recommendations)) {
            return {
                type: 'array',
                content: summary.general_recommendations
            };
        }
        
        if (summary.recommendations && typeof summary.recommendations === 'object') {
            return {
                type: 'structured',
                content: summary.recommendations
            };
        }
        
        return null;
    };

    const recommendationData = getRecommendations();

    console.log('Debug Recommendations:', {
        summary_recommendations: summary.recommendations,
        summary_general_recommendations: summary.general_recommendations,
        recommendationData: recommendationData
    });

    console.log('Debug Symptoms Details:', {
        symptoms_details: summary.symptoms_details,
        symptoms_details_length: summary.symptoms_details?.length,
        first_symptom: summary.symptoms_details?.[0],
        reported_symptoms: summary.reported_symptoms,
        reported_symptoms_length: summary.reported_symptoms?.length
    });

    // Debug: Log semua properti dari gejala pertama
    if (summary.symptoms_details && summary.symptoms_details.length > 0) {
        console.log('First symptom properties:', Object.keys(summary.symptoms_details[0]));
        console.log('First symptom full object:', summary.symptoms_details[0]);
    }

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
        <PublicLayout user={auth?.user} title="Hasil Konsultasi">
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 relative overflow-hidden">
                <AnimatePresence>
                    {showConfetti && (
                        <motion.div 
                            className="fixed inset-0 pointer-events-none z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {[...Array(50)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    initial={{ 
                                        y: -100,
                                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                                        rotate: 0,
                                        scale: 1
                                    }}
                                    animate={{ 
                                        y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
                                        rotate: 360,
                                        scale: [1, 1.5, 1]
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 2,
                                        delay: Math.random() * 2,
                                        ease: "easeOut"
                                    }}
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                    }}
                                >
                                    <span className="text-2xl">
                                        {['🎉', '🎊', '✨', '🌟', '💫', '🎈'][Math.floor(Math.random() * 6)]}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="max-w-6xl mx-auto px-4 py-8">
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div 
                            className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg mb-6"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </motion.div>
                            <div className="text-left">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    Konsultasi Selesai!
                                </h1>
                                <p className="text-gray-600">{celebration.text}</p>
                            </div>
                            <motion.span 
                                className="text-4xl"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {celebration.emoji}
                            </motion.span>
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div 
                            className="lg:col-span-2"
                            variants={itemVariants}
                        >
                            <motion.div 
                                className="bg-white rounded-3xl shadow-xl overflow-hidden"
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white"
                                    initial={{ x: -100 }}
                                    animate={{ x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Brain className="h-8 w-8" />
                                        <h2 className="text-2xl font-bold">Hasil Analisis</h2>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Sparkles className="h-6 w-6" />
                                        </motion.div>
                                    </div>
                                </motion.div>

                                <div className="p-8">
                                    {diagnosis ? (
                                        <motion.div 
                                            className="space-y-6"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <motion.div 
                                                className={`bg-gradient-to-r ${getConfidenceColor(diagnosis.confidence_level)} rounded-2xl p-6 text-white`}
                                                whileHover={{ scale: 1.02 }}
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-xl font-bold">Kondisi yang Terdeteksi:</h3>
                                                    <motion.div 
                                                        className="bg-white/20 rounded-full px-4 py-2"
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        <span className="text-sm font-semibold">
                                                            {diagnosis.confidence_level}% akurat
                                                        </span>
                                                    </motion.div>
                                                </div>
                                                <h4 className="text-2xl font-bold mb-2">
                                                    {diagnosis.mental_disorder.name}
                                                </h4>
                                                <p className="text-sm opacity-90">
                                                    {getConfidenceMessage(diagnosis.confidence_level)}
                                                </p>
                                            </motion.div>

                                            <motion.div 
                                                className="bg-gray-50 rounded-2xl p-6"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.7 }}
                                            >
                                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                                                    <Target className="h-5 w-5 mr-2 text-blue-600" />
                                                    Gejala yang Kamu Alami ({summary.symptoms_details?.length || summary.reported_symptoms?.length || 0}):
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {/* Coba symptoms_details dulu */}
                                                    {summary.symptoms_details && summary.symptoms_details.length > 0 ? (
                                                        summary.symptoms_details.slice(0, 6).map((symptom, index) => (
                                                            <motion.div 
                                                                key={symptom.code || index} 
                                                                className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm"
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.8 + index * 0.1 }}
                                                                whileHover={{ x: 5 }}
                                                            >
                                                                {/* Cek apakah ada properti code dan description (format lengkap) */}
                                                                {symptom.code && symptom.description ? (
                                                                    <>
                                                                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                                        <div>
                                                                            <span className="text-xs font-mono text-gray-500">{symptom.code}</span>
                                                                            <p className="text-sm text-gray-700">{symptom.description}</p>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    /* Format sederhana dengan bullet point */
                                                                    <>
                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                                                        <p className="text-gray-700 text-sm">
                                                                            {symptom.symptom || symptom.name || symptom.description || symptom}
                                                                        </p>
                                                                    </>
                                                                )}
                                                            </motion.div>
                                                        ))
                                                    ) : summary.reported_symptoms && summary.reported_symptoms.length > 0 ? (
                                                        /* Fallback ke reported_symptoms */
                                                        summary.reported_symptoms.slice(0, 6).map((symptom, index) => (
                                                            <motion.div 
                                                                key={index} 
                                                                className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm"
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.8 + index * 0.1 }}
                                                                whileHover={{ x: 5 }}
                                                            >
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                                                <p className="text-gray-700 text-sm">{symptom}</p>
                                                            </motion.div>
                                                        ))
                                                    ) : (
                                                        <motion.div 
                                                            className="col-span-2 text-center py-6"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                        >
                                                            <p className="text-gray-500 text-sm">Tidak ada detail gejala yang tersedia</p>
                                                        </motion.div>
                                                    )}
                                                </div>
                                                {/* Tampilkan info jika ada lebih banyak gejala */}
                                                {((summary.symptoms_details && summary.symptoms_details.length > 6) || 
                                                  (summary.reported_symptoms && summary.reported_symptoms.length > 6)) && (
                                                    <motion.p 
                                                        className="text-sm text-gray-500 mt-3 text-center"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 1.5 }}
                                                    >
                                                        +{(summary.symptoms_details?.length || summary.reported_symptoms?.length || 0) - 6} gejala lainnya
                                                    </motion.p>
                                                )}
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            className="text-center py-12"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600">Tidak ada diagnosis yang tersedia saat ini.</p>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            className="lg:col-span-1"
                            variants={itemVariants}
                        >
                            <motion.div 
                                className="bg-white rounded-3xl shadow-xl overflow-hidden h-full"
                                whileHover={{ y: -5 }}
                            >
                                <motion.div 
                                    className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white"
                                    initial={{ x: 100 }}
                                    animate={{ x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <TrendingUp className="h-8 w-8" />
                                        <h2 className="text-xl font-bold">Progress Kamu</h2>
                                    </div>
                                </motion.div>

                                <div className="p-6">
                                    <motion.div 
                                        className="space-y-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        <div className="text-center">
                                            <motion.div 
                                                className="w-24 h-24 mx-auto mb-4 relative"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 1, type: "spring" }}
                                            >
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                    <path
                                                        className="text-gray-200"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        fill="none"
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    />
                                                    <motion.path
                                                        className="text-green-500"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        fill="none"
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        initial={{ strokeDasharray: "0 100" }}
                                                        animate={{ strokeDasharray: `${summary.progress} 100` }}
                                                        transition={{ delay: 1.2, duration: 1.5 }}
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <motion.span 
                                                        className="text-2xl font-bold text-green-600"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 1.5 }}
                                                    >
                                                        {Math.round(summary.progress)}%
                                                    </motion.span>
                                                </div>
                                            </motion.div>
                                            <p className="text-gray-600 text-sm">Konsultasi Selesai</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                                <span className="text-blue-700 text-sm">Total Pertanyaan</span>
                                                <span className="font-semibold text-blue-800">{summary.total_questions}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                                <span className="text-purple-700 text-sm">Gejala Terdeteksi</span>
                                                <span className="font-semibold text-purple-800">
                                                    {summary.symptoms_details?.length || summary.reported_symptoms?.length || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Recommendations Section */}
                    {recommendationData && (
                        <motion.div 
                            className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{ y: -5 }}
                        >
                            <motion.div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white"
                                initial={{ x: -100 }}
                                animate={{ x: 0 }}
                                transition={{ delay: 0.9 }}
                            >
                                <div className="flex items-center space-x-3">
                                    <Heart className="h-8 w-8" />
                                    <h2 className="text-2xl font-bold">Rekomendasi Khusus</h2>
                                    <span className="text-2xl">💝</span>
                                </div>
                            </motion.div>

                            <div className="p-8">
                                {recommendationData.type === 'string' && (
                                    <motion.div 
                                        className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-r-lg"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1 }}
                                    >
                                        <p className="text-indigo-800">{recommendationData.content}</p>
                                    </motion.div>
                                )}

                                {recommendationData.type === 'array' && (
                                    <div className="space-y-4">
                                        {recommendationData.content.map((rec: string, index: number) => (
                                            <motion.div 
                                                key={index} 
                                                className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 1 + index * 0.1 }}
                                                whileHover={{ x: 5 }}
                                            >
                                                <p className="text-indigo-800 text-sm">{rec}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {recommendationData.type === 'structured' && (
                                    <div className="space-y-6">
                                        {Object.entries(recommendationData.content).map(([key, value]: [string, any], index: number) => (
                                            <motion.div 
                                                key={key}
                                                className="space-y-3"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 1 + index * 0.2 }}
                                            >
                                                <h3 className="text-lg font-semibold text-indigo-600 capitalize">
                                                    {key.replace(/_/g, ' ')}
                                                </h3>
                                                {Array.isArray(value) ? (
                                                    <div className="space-y-2">
                                                        {value.map((item: string, itemIndex: number) => (
                                                            <motion.div 
                                                                key={itemIndex} 
                                                                className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg"
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 1.2 + itemIndex * 0.1 }}
                                                                whileHover={{ x: 5 }}
                                                            >
                                                                <p className="text-indigo-800 text-sm">{item}</p>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <motion.div 
                                                        className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg"
                                                        whileHover={{ x: 5 }}
                                                    >
                                                        <p className="text-indigo-800 text-sm">{value}</p>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {!recommendationData && (
                        <motion.div 
                            className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{ y: -5 }}
                        >
                            <motion.div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white"
                                initial={{ x: -100 }}
                                animate={{ x: 0 }}
                                transition={{ delay: 0.9 }}
                            >
                                <div className="flex items-center space-x-3">
                                    <Heart className="h-8 w-8" />
                                    <h2 className="text-2xl font-bold">Saran Umum Buatmu</h2>
                                    <span className="text-2xl">💝</span>
                                </div>
                            </motion.div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <motion.div 
                                        className="space-y-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1 }}
                                    >
                                        <h3 className="text-lg font-semibold text-blue-600 flex items-center">
                                            <span className="text-2xl mr-2">💙</span>
                                            Self-Care Basics
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                'Prioritaskan istirahat yang cukup dan self-care',
                                                'Bicarakan perasaan dengan orang yang dipercaya',
                                                'Jaga pola tidur yang teratur (7-8 jam per malam)'
                                            ].map((rec, index) => (
                                                <motion.div 
                                                    key={index} 
                                                    className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 1.2 + index * 0.1 }}
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <p className="text-blue-800 text-sm">{rec}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div 
                                        className="space-y-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.2 }}
                                    >
                                        <h3 className="text-lg font-semibold text-green-600 flex items-center">
                                            <span className="text-2xl mr-2">🌱</span>
                                            Healthy Habits
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                'Lakukan aktivitas fisik ringan secara teratur',
                                                'Praktikkan teknik relaksasi seperti meditasi',
                                                'Pertimbangkan konsultasi dengan profesional kesehatan mental'
                                            ].map((rec, index) => (
                                                <motion.div 
                                                    key={index} 
                                                    className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 1.4 + index * 0.1 }}
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <p className="text-green-800 text-sm">{rec}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <motion.div 
                        className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white"
                            initial={{ x: -100 }}
                            animate={{ x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center space-x-3">
                                <Star className="h-8 w-8" />
                                <h2 className="text-2xl font-bold">Hal Kecil yang Bisa Kamu Lakukan Hari Ini</h2>
                                <span className="text-2xl">🌟</span>
                            </div>
                        </motion.div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {actionItems.map((item, index) => (
                                    <motion.div 
                                        key={index} 
                                        className="group cursor-pointer"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                        whileHover={{ y: -10 }}
                                    >
                                        <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-white transition-all duration-300`}>
                                            <div className="text-center">
                                                <motion.div 
                                                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
                                                    whileHover={{ 
                                                        y: [0, -10, 0],
                                                        transition: { duration: 0.6, repeat: Infinity }
                                                    }}
                                                >
                                                    {item.icon}
                                                </motion.div>
                                                <h4 className="font-semibold mb-2">{item.title}</h4>
                                                <p className="text-sm opacity-90">{item.desc}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">What's Next? 🚀</h2>
                        <p className="text-xl text-purple-100 mb-8">
                            Ingat ya, perjalanan kesehatan mental itu ongoing process. 
                            Kamu udah ambil langkah pertama yang amazing! 💪
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/consultation"
                                    className="inline-flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    <span>Konsultasi Lagi</span>
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </motion.div>
                            
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/consultation/history"
                                    className="inline-flex items-center space-x-2 bg-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-400 transition-colors shadow-lg hover:shadow-xl"
                                >
                                    <Calendar className="h-5 w-5" />
                                    <span>Lihat Progress</span>
                                </Link>
                            </motion.div>
                        </div>

                        <div className="mt-8 flex justify-center space-x-4">
                            {[Coffee, Heart, Star, Sparkles].map((Icon, index) => (
                                <motion.div
                                    key={index}
                                    animate={{ 
                                        y: [0, -10, 0],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity, 
                                        delay: index * 0.5 
                                    }}
                                >
                                    <Icon className="h-8 w-8" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Floating decorative elements */}
                <motion.div 
                    className="fixed bottom-10 right-10 w-16 h-16 bg-yellow-200 rounded-full opacity-60"
                    animate={{ 
                        y: [0, -20, 0],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                    className="fixed top-20 left-10 w-12 h-12 bg-pink-200 rounded-full opacity-60"
                    animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 0.3, 0.6]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                    className="fixed top-1/2 left-20 w-8 h-8 bg-blue-200 rounded-full opacity-60"
                    animate={{ 
                        scale: [1, 2, 1],
                        x: [0, 10, 0],
                        opacity: [0.6, 0.2, 0.6]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>
        </PublicLayout>
    );
}