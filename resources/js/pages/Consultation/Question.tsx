import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/layouts/public-layout';
import { 
    MessageCircle, 
    Heart, 
    ThumbsUp,
    ThumbsDown,
    Sparkles,
    Brain,
    Star,
    Zap,
    ArrowRight,
    CheckCircle,
    Target,
    Clock,
    TrendingUp,
    Activity,
    AlertTriangle,
    RefreshCw,
    X,
    Minus,
    Plus
} from 'lucide-react';
import { User } from '@/types/user';

interface QuestionProps {
    consultation: any;
    current_symptoms: string[];
    current_symptoms_details: any[];
    next_question: {
        code: string;
        description: string;
        priority: number;
        potential_disorder: string;
        category: string;
        rule_code?: string;
        type?: string;
        current_confidence?: number;
        rule_rank?: number;
    };
    progress: number;
    strategic_questions_remaining?: number;
    total_questions?: number;
    consultation_stats?: {
        total_questions: number;
        strategic_questions: number;
        symptoms_found: number;
        progress: number;
        status: string;
    };
    auth: {
        user?: User;
    };
    errors?: Record<string, string>;
}

type SeverityLevel = 'none' | 'mild' | 'moderate' | 'severe';

const funQuestionStarters = [
    "Oke bestie, aku mau tanya nih...",
    "Hmm, coba cerita dong...", 
    "Eh, gimana sih kalau...",
    "Aku penasaran nih, kamu...",
    "Boleh sharing gak...",
    "Cerita dong, seberapa sering kamu...",
];

const encouragements = [
    { text: "Kamu amazing! 🌟", emoji: "✨" },
    { text: "So far so good! 💪", emoji: "🎯" },
    { text: "Keep going babe! 💖", emoji: "🚀" },
    { text: "You're doing great! 🌈", emoji: "⭐" },
    { text: "Proud of you! 🦋", emoji: "💝" },
];

const severityOptions = [
    {
        level: 'none' as SeverityLevel,
        label: 'Tidak Pernah',
        description: 'Aku gak pernah mengalami ini',
        color: 'from-gray-400 to-slate-500',
        icon: <X className="h-8 w-8" />,
        weight: 0
    },
    {
        level: 'mild' as SeverityLevel,
        label: 'Ringan',
        description: 'Kadang-kadang aja, gak terlalu mengganggu',
        color: 'from-yellow-400 to-amber-500',
        icon: <Minus className="h-8 w-8" />,
        weight: 1
    },
    {
        level: 'moderate' as SeverityLevel,
        label: 'Sedang',
        description: 'Lumayan sering, agak mengganggu aktivitas',
        color: 'from-orange-400 to-red-500',
        icon: <Activity className="h-8 w-8" />,
        weight: 2
    },
    {
        level: 'severe' as SeverityLevel,
        label: 'Berat',
        description: 'Sering banget, sangat mengganggu kehidupan',
        color: 'from-red-500 to-pink-600',
        icon: <Plus className="h-8 w-8" />,
        weight: 3
    }
];

const responseReactions = {
    none: [
        { text: "Oke, noted! 📝", color: "from-gray-400 to-blue-400" },
        { text: "Alright, clear! 👌", color: "from-slate-400 to-gray-500" },
    ],
    mild: [
        { text: "I see, ringan ya 🤔", color: "from-yellow-400 to-orange-400" },
        { text: "Oke, kadang-kadang gitu ya 💛", color: "from-amber-400 to-yellow-500" },
    ],
    moderate: [
        { text: "Hmm, lumayan ya 🧡", color: "from-orange-400 to-red-400" },
        { text: "Oke, agak mengganggu ya 📊", color: "from-orange-500 to-red-500" },
    ],
    severe: [
        { text: "Oh no, berat banget nih 😟", color: "from-red-400 to-pink-500" },
        { text: "That sounds tough babe 💔", color: "from-red-500 to-pink-600" },
    ]
};

export default function ConsultationQuestion({ 
    consultation, 
    current_symptoms, 
    current_symptoms_details, 
    next_question, 
    progress,
    strategic_questions_remaining = 0,
    total_questions = 0,
    consultation_stats,
    auth,
    errors = {}
}: QuestionProps) {
    const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | null>(null);
    const [showReaction, setShowReaction] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const page = usePage();

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            console.error('Page Errors:', errors);
            setErrorMessage(Object.values(errors)[0] || 'Terjadi kesalahan yang tidak diketahui');
        }
    }, [errors]);

    useEffect(() => {
        if (page.props.errors && Object.keys(page.props.errors).length > 0) {
            console.error('Inertia Errors:', page.props.errors);
            setErrorMessage(Object.values(page.props.errors)[0] as string);
        }
    }, [page.props.errors]);

    const questionStarter = funQuestionStarters[Math.floor(Math.random() * funQuestionStarters.length)];
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

    const handleSeveritySelect = (severity: SeverityLevel) => {
        if (isSubmitting) return;
        
        setErrorMessage(null);
        setSelectedSeverity(severity);
        setShowReaction(true);
        setIsSubmitting(true);
        
        setTimeout(() => {
            submitAnswer(severity);
        }, 1200);
    };

    const submitAnswer = (severity: SeverityLevel) => {
        const selectedOption = severityOptions.find(opt => opt.level === severity);
        
        console.log('Submitting severity answer:', {
            severity,
            weight: selectedOption?.weight,
            consultation_id: consultation.id,
            symptom_code: next_question.code,
            question: next_question.description
        });

        router.post(`/consultation/${consultation.id}/answer`, {
            symptom_severity: severity,
            symptom_weight: selectedOption?.weight || 0,
            symptom_code: next_question.code,
            question: next_question.description,
            rule_code: next_question.rule_code || null,
            priority: next_question.priority || 0,
            category: next_question.category || 'unknown'
        }, {
            preserveState: false,
            preserveScroll: false,
            onStart: () => {
                console.log('Request started');
                setIsSubmitting(true);
            },
            onSuccess: (response) => {
                console.log('Request successful:', response);
                setIsSubmitting(false);
                setErrorMessage(null);
            },
            onError: (errors) => {
                console.error('Request errors:', errors);
                setIsSubmitting(false);
                setShowReaction(false);
                setSelectedSeverity(null);
                
                if (typeof errors === 'object' && errors !== null) {
                    const errorMessages = Object.values(errors);
                    setErrorMessage(errorMessages[0] as string || 'Terjadi kesalahan saat memproses jawaban');
                } else {
                    setErrorMessage('Terjadi kesalahan yang tidak diketahui');
                }
            },
            onFinish: () => {
                console.log('Request finished');
            }
        });
    };

    const retrySubmission = () => {
        setErrorMessage(null);
        setShowReaction(false);
        setSelectedSeverity(null);
        setIsSubmitting(false);
    };

    const getCategoryEmoji = (category: string) => {
        const emojiMap: { [key: string]: string } = {
            'mood_emotional': '💭',
            'cognitive': '🧠',
            'physical': '💪',
            'behavioral': '🎭',
            'trauma_related': '🫂',
            'other': '✨'
        };
        return emojiMap[category] || '✨';
    };

    const getCategoryColor = (category: string) => {
        const colorMap: { [key: string]: string } = {
            'mood_emotional': 'from-pink-500 to-rose-500',
            'cognitive': 'from-purple-500 to-indigo-500',
            'physical': 'from-blue-500 to-cyan-500',
            'behavioral': 'from-green-500 to-emerald-500',
            'trauma_related': 'from-orange-500 to-red-500',
            'other': 'from-gray-500 to-slate-500'
        };
        return colorMap[category] || 'from-gray-500 to-slate-500';
    };

    const getQuestionType = () => {
        if (next_question.type === 'rule_based') return 'Rule-Based';
        if (next_question.type === 'strategic_screening') return 'Strategic';
        if (next_question.type === 'discriminating') return 'Discriminating';
        if (next_question.rule_code === 'STRATEGIC') return 'Strategic';
        if (next_question.rule_code === 'SCREEN') return 'Screening';
        if (next_question.rule_code && next_question.rule_code !== 'SCREEN') return 'Rule-Based';
        return 'General';
    };

    const isStrategicQuestion = getQuestionType() !== 'General' && getQuestionType() !== 'Screening';
    
    const calculateDetailedProgress = () => {
        const baseProgress = Math.min(95, Math.max(5, progress));
        
        let adjustedProgress = baseProgress;
        
        if (current_symptoms.length >= 4) {
            adjustedProgress = Math.min(95, adjustedProgress + 10);
        }
        
        if (isStrategicQuestion) {
            adjustedProgress = Math.min(95, adjustedProgress + 5);
        }
        
        return Math.round(adjustedProgress);
    };

    const displayProgress = calculateDetailedProgress();
    
    const getProgressDescription = () => {
        const questionCount = (consultation_stats?.total_questions || total_questions) + 1;
        const symptomCount = current_symptoms.length;
        
        if (displayProgress < 20) return `Mulai eksplorasi (Q${questionCount}) 🔍`;
        if (displayProgress < 40) return `Menggali lebih dalam (${symptomCount} gejala) 🎯`;
        if (displayProgress < 70) return `Menganalisis pola (Q${questionCount}) 📊`;
        if (displayProgress < 90) return `Hampir selesai! (${symptomCount} gejala) 🏁`;
        return `Finalisasi diagnosis 🎉`;
    };

    const getPriorityColor = () => {
        if (!next_question.priority) return 'bg-gray-100 text-gray-600';
        if (next_question.priority >= 80) return 'bg-red-100 text-red-700';
        if (next_question.priority >= 60) return 'bg-orange-100 text-orange-700';
        if (next_question.priority >= 40) return 'bg-yellow-100 text-yellow-700';
        return 'bg-blue-100 text-blue-700';
    };

    return (
        <PublicLayout user={auth?.user} title="Konsultasi - Pertanyaan">
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
                {errorMessage && (
                    <motion.div 
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-start space-x-3">
                            <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-semibold">Error!</h4>
                                <p className="text-sm">{errorMessage}</p>
                                <button
                                    onClick={retrySubmission}
                                    className="mt-2 inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    <span>Coba Lagi</span>
                                </button>
                            </div>
                            <button
                                onClick={() => setErrorMessage(null)}
                                className="text-red-200 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                <motion.div 
                    className="bg-white shadow-sm border-b border-gray-100"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-700">
                                    {getProgressDescription()}
                                </span>
                                <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                                    isStrategicQuestion 
                                        ? 'bg-purple-100 text-purple-700' 
                                        : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {getQuestionType()}
                                </div>
                                {next_question.current_confidence && next_question.current_confidence > 0 && (
                                    <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                        {next_question.current_confidence}% confidence
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-purple-600">
                                    {displayProgress}%
                                </span>
                                <div className="text-xs text-gray-500 flex items-center space-x-2">
                                    <span>Q{(consultation_stats?.total_questions || total_questions) + 1}</span>
                                    <span>•</span>
                                    <span>{current_symptoms.length} gejala</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                            <motion.div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700 ease-out relative"
                                initial={{ width: 0 }}
                                animate={{ width: `${displayProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: [-100, 300] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                            
                            <div className="absolute inset-0 flex justify-between items-center px-1">
                                {[25, 50, 75].map((milestone) => (
                                    <div
                                        key={milestone}
                                        className={`w-1 h-1 rounded-full ${
                                            displayProgress >= milestone ? 'bg-white' : 'bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                {encouragement.text}
                            </span>
                            {next_question.potential_disorder && 
                             next_question.potential_disorder !== 'Strategic Screening' && 
                             next_question.potential_disorder !== 'General Screening' && (
                                <span className="text-xs text-indigo-600 font-medium">
                                    Focus: {next_question.potential_disorder}
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>

                <div className="max-w-5xl mx-auto px-4 py-8">
                    <motion.div 
                        className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div 
                            className={`bg-gradient-to-r ${getCategoryColor(next_question.category)} p-6 text-white`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <motion.div 
                                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        {getCategoryEmoji(next_question.category)}
                                    </motion.div>
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            Question #{(consultation_stats?.total_questions || total_questions) + 1}
                                        </h3>
                                        <p className="text-sm opacity-90 capitalize">
                                            {next_question.category.replace('_', ' ')} • {getQuestionType()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor()}`}>
                                        {next_question.rule_code || 'GENERAL'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="p-8">
                            <motion.div 
                                className="text-center mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <motion.div 
                                    className="mb-4"
                                    animate={{ 
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1] 
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <span className="text-2xl">🤖</span>
                                </motion.div>
                                <p className="text-gray-600 text-lg mb-4 italic">
                                    "{questionStarter}"
                                </p>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
                                    Seberapa sering kamu mengalami: <br />
                                    <span className="text-purple-600">{next_question.description.toLowerCase()}</span>?
                                </h2>
                                
                                {next_question.potential_disorder && 
                                 next_question.potential_disorder !== 'Strategic Screening' && 
                                 next_question.potential_disorder !== 'General Screening' && (
                                    <motion.div 
                                        className="mt-4 p-3 bg-indigo-50 rounded-lg"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <p className="text-sm text-indigo-700">
                                            💡 Berkaitan dengan: <span className="font-medium">{next_question.potential_disorder}</span>
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>

                            <AnimatePresence mode="wait">
                                {!showReaction ? (
                                    <motion.div 
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
                                        key="severity-buttons"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -30 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {severityOptions.map((option, index) => (
                                            <motion.button
                                                key={option.level}
                                                onClick={() => handleSeveritySelect(option.level)}
                                                disabled={isSubmitting}
                                                className={`group bg-gradient-to-br ${option.color} hover:scale-105 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                whileHover={{ scale: 1.05, y: -5 }}
                                                whileTap={{ scale: 0.95 }}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 + index * 0.1 }}
                                            >
                                                <div className="flex flex-col items-center space-y-3">
                                                    <motion.div 
                                                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                                                        whileHover={{ rotate: 360 }}
                                                        transition={{ duration: 0.6 }}
                                                    >
                                                        {option.icon}
                                                    </motion.div>
                                                    <div className="text-center">
                                                        <h3 className="text-lg font-bold mb-1">{option.label}</h3>
                                                        <p className="text-xs opacity-90 leading-tight">
                                                            {option.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        className="text-center"
                                        key="reaction"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    >
                                        <motion.div 
                                            className={`inline-flex items-center space-x-3 bg-gradient-to-r ${responseReactions[selectedSeverity!][0].color} text-white px-8 py-4 rounded-full shadow-lg`}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                        >
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <Sparkles className="h-6 w-6" />
                                            </motion.div>
                                            <span className="text-lg font-semibold">
                                                {responseReactions[selectedSeverity!][Math.floor(Math.random() * responseReactions[selectedSeverity!].length)].text}
                                            </span>
                                            <motion.div
                                                animate={{ scale: [1, 1.3, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <Zap className="h-6 w-6" />
                                            </motion.div>
                                        </motion.div>
                                        <motion.p 
                                            className="text-gray-600 mt-4 flex items-center justify-center space-x-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <span>
                                                {isSubmitting ? 'Menganalisis tingkat keparahan...' : 'Lanjut ke pertanyaan berikutnya'}
                                            </span>
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                            </motion.div>
                                        </motion.p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {current_symptoms_details.length > 0 && (
                            <motion.div 
                                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <motion.h4 
                                        className="font-semibold text-gray-800 flex items-center"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Brain className="h-5 w-5 mr-2 text-purple-600" />
                                        Gejala Terkonfirmasi
                                    </motion.h4>
                                    <div className="flex items-center space-x-3">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </motion.div>
                                        <span className="text-sm font-semibold text-green-600">
                                            {current_symptoms_details.length} gejala
                                        </span>
                                    </div>
                                </div>
                                
                                <motion.div 
                                    className="grid gap-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    {current_symptoms_details.slice(-3).map((symptom, index) => (
                                        <motion.div
                                            key={symptom.code || index}
                                            className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.2 + index * 0.1 }}
                                            whileHover={{ x: 5, scale: 1.02 }}
                                        >
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <span className="text-xs font-mono text-green-600 bg-green-100 px-2 py-1 rounded">
                                                    {symptom.code || `G${index + 1}`}
                                                </span>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    {symptom.description || symptom.name || 'Gejala terkonfirmasi'}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    
                                    {current_symptoms_details.length > 3 && (
                                        <motion.div 
                                            className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1.6 }}
                                        >
                                            <p className="text-sm text-purple-700">
                                                <span className="font-semibold">
                                                    +{current_symptoms_details.length - 3} gejala lainnya
                                                </span>
                                                <span className="text-purple-600 ml-2">telah terkonfirmasi</span>
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>

                                <div className="flex justify-center mt-4 space-x-2">
                                    {Array.from({ length: Math.min(8, current_symptoms_details.length) }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 bg-purple-400 rounded-full"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 1.8 + i * 0.05 }}
                                        />
                                    ))}
                                    {current_symptoms_details.length > 8 && (
                                        <span className="text-xs text-gray-500 self-center font-semibold">
                                            +{current_symptoms_details.length - 8}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {current_symptoms.length >= 2 && (
                        <motion.div 
                            className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-indigo-800 flex items-center">
                                    <TrendingUp className="h-5 w-5 mr-2" />
                                    Progress Diagnosis
                                </h4>
                                <div className="text-sm text-indigo-600 font-medium">
                                    {displayProgress >= 70 ? 'Hampir selesai!' : 
                                     displayProgress >= 40 ? 'Progress baik' : 'Mulai terbentuk pola'}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-white/60 rounded-lg">
                                    <div className="text-lg font-bold text-indigo-700">
                                        {(consultation_stats?.total_questions || total_questions) + 1}
                                    </div>
                                    <div className="text-xs text-indigo-600">Pertanyaan</div>
                                </div>
                                <div className="text-center p-3 bg-white/60 rounded-lg">
                                    <div className="text-lg font-bold text-green-700">
                                        {current_symptoms.length}
                                    </div>
                                    <div className="text-xs text-green-600">Gejala Positif</div>
                                </div>
                                <div className="text-center p-3 bg-white/60 rounded-lg">
                                    <div className="text-lg font-bold text-purple-700">
                                        {displayProgress}%
                                    </div>
                                    <div className="text-xs text-purple-600">Kelengkapan</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <motion.div 
                    className="fixed top-20 left-10 w-12 h-12 bg-yellow-200/60 rounded-full"
                    animate={{ 
                        y: [0, -20, 0],
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div 
                    className="fixed bottom-20 right-10 w-10 h-10 bg-pink-200/60 rounded-full"
                    animate={{ 
                        x: [0, 15, 0],
                        opacity: [0.6, 1, 0.6],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                    className="fixed top-1/2 right-20 w-8 h-8 bg-blue-200/60 rounded-full"
                    animate={{ 
                        y: [0, -30, 0],
                        x: [0, -10, 0],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                />

                {/* {process.env.NODE_ENV === 'development' && (
                    <motion.div 
                        className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2 }}
                    >
                        <h5 className="font-semibold mb-2">Debug Info:</h5>
                        <div className="space-y-1">
                            <div>Consultation ID: {consultation.id}</div>
                            <div>Question Code: {next_question.code}</div>
                            <div>Rule Code: {next_question.rule_code || 'N/A'}</div>
                            <div>Priority: {next_question.priority || 0}</div>
                            <div>Category: {next_question.category}</div>
                            <div>Current Symptoms: {current_symptoms.length}</div>
                            <div>Total Questions: {(consultation_stats?.total_questions || total_questions) + 1}</div>
                            <div>Progress: {displayProgress}%</div>
                            {errorMessage && (
                                <div className="text-red-400">Error: {errorMessage}</div>
                            )}
                        </div>
                    </motion.div>
                )} */}
            </div>
        </PublicLayout>
    );
}