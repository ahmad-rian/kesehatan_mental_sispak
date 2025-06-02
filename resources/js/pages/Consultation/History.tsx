import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/layouts/public-layout';
import { 
    Calendar,
    Clock,
    Brain,
    Heart,
    TrendingUp,
    MessageCircle,
    Star,
    Award,
    ChevronRight,
    Filter,
    Search,
    BarChart3,
    Target,
    Zap,
    CheckCircle,
    PlayCircle,
    Pause,
    RotateCcw,
    AlertCircle
} from 'lucide-react';
import { User } from '@/types/user';

interface HistoryProps {
    diagnosis_history: any[];
    consultations: {
        data: any[];
        links: any[];
        meta: any;
    };
    auth: {
        user?: User;
    };
}

const motivationalMessages = [
    "Lihat perjalanan healing-mu! 🌟",
    "Progress kamu luar biasa! 💪",
    "Setiap langkah adalah kemajuan! 🦋",
    "Proud of your consistency! ✨",
];

export default function ConsultationHistory({ diagnosis_history, consultations, auth }: HistoryProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'text-green-600 bg-green-100';
        if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-blue-600 bg-blue-100';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'in_progress':
                return 'text-blue-600 bg-blue-100';
            case 'abandoned':
                return 'text-gray-600 bg-gray-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Selesai';
            case 'in_progress':
                return 'Berlangsung';
            case 'abandoned':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
            case 'in_progress':
                return <PlayCircle className="h-4 w-4" />;
            case 'abandoned':
                return <Pause className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const completedConsultations = consultations.data?.filter(c => c.status === 'completed') || [];
    const inProgressConsultations = consultations.data?.filter(c => c.status === 'in_progress') || [];
    const totalDiagnoses = diagnosis_history?.length || 0;
    
    // Perbaikan untuk Average Confidence
    const calculateAverageConfidence = () => {
        if (!diagnosis_history || diagnosis_history.length === 0) {
            return 0;
        }
        
        const validDiagnoses = diagnosis_history.filter(d => 
            d && 
            d.confidence_level !== null && 
            d.confidence_level !== undefined && 
            !isNaN(d.confidence_level)
        );
        
        if (validDiagnoses.length === 0) {
            return 0;
        }
        
        const sum = validDiagnoses.reduce((total, d) => total + Number(d.confidence_level), 0);
        return Math.round(sum / validDiagnoses.length);
    };

    const averageConfidence = calculateAverageConfidence();

    // Debug logging
    console.log('Debug Consultation History:', {
        diagnosis_history,
        total_diagnoses: totalDiagnoses,
        average_confidence: averageConfidence,
        consultations_data: consultations.data
    });

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
        <PublicLayout user={auth?.user} title="Riwayat Konsultasi">
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div 
                            className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg mb-6"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Calendar className="h-8 w-8 text-purple-600" />
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Journey Kesehatan Mentalmu
                            </h1>
                            <span className="text-3xl">📚</span>
                        </motion.div>
                        <p className="text-lg text-gray-600">
                            {motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}
                        </p>
                    </motion.div>

                    {/* In Progress Alert */}
                    {inProgressConsultations.length > 0 && (
                        <motion.div 
                            className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <motion.div 
                                        className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <PlayCircle className="h-6 w-6 text-blue-600" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-800">
                                            Ada konsultasi yang belum selesai
                                        </h3>
                                        <p className="text-sm text-blue-600">
                                            Kamu punya {inProgressConsultations.length} konsultasi yang bisa dilanjutkan
                                        </p>
                                    </div>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={`/consultation/${inProgressConsultations[0].id}/question`}
                                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                                    >
                                        <PlayCircle className="h-5 w-5" />
                                        <span>Lanjutkan</span>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Quick Stats */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div 
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Konsultasi</p>
                                    <p className="text-3xl font-bold text-blue-600">{consultations.data?.length || 0}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <MessageCircle className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-green-600">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                Keep going! 🚀
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Selesai</p>
                                    <p className="text-3xl font-bold text-green-600">{completedConsultations.length}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-green-600">
                                <Star className="h-4 w-4 mr-1" />
                                Amazing! ✨
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg. Akurasi</p>
                                    <p className="text-3xl font-bold text-purple-600">
                                        {totalDiagnoses > 0 ? `${averageConfidence}%` : '0%'}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <Target className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-purple-600">
                                <BarChart3 className="h-4 w-4 mr-1" />
                                {totalDiagnoses > 0 ? 'Great accuracy! 🎯' : 'Start now! 🚀'}
                            </div>
                        </motion.div>

                        <motion.div 
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Diagnosa</p>
                                    <p className="text-3xl font-bold text-orange-600">{totalDiagnoses}</p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-xl">
                                    <Brain className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-orange-600">
                                <Zap className="h-4 w-4 mr-1" />
                                {totalDiagnoses > 0 ? 'Self-aware! 💪' : 'Let\'s start! 🌟'}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Tab Navigation */}
                    <motion.div 
                        className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                {[
                                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                                    { id: 'consultations', label: 'Konsultasi', icon: MessageCircle },
                                    { id: 'diagnoses', label: 'Diagnosa', icon: Brain },
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <motion.button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                                activeTab === tab.id
                                                    ? 'border-purple-500 text-purple-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                            whileHover={{ y: -2 }}
                                            whileTap={{ y: 0 }}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span>{tab.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                {/* Overview Tab */}
                                {activeTab === 'overview' && (
                                    <motion.div 
                                        className="space-y-6"
                                        key="overview"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                            Progress Overview 📊
                                        </h3>
                                        
                                        {diagnosis_history && diagnosis_history.length > 0 ? (
                                            <div className="space-y-4">
                                                <motion.div 
                                                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6"
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <h4 className="font-semibold text-gray-800 mb-3">Latest Achievement 🏆</h4>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-lg font-semibold text-purple-700">
                                                                {diagnosis_history[0]?.mental_disorder?.name || 'Diagnosis tidak tersedia'}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {diagnosis_history[0]?.created_at_human || 'Waktu tidak tersedia'}
                                                            </p>
                                                        </div>
                                                        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getConfidenceColor(diagnosis_history[0]?.confidence_level || 0)}`}>
                                                            {diagnosis_history[0]?.confidence_level || 0}% akurat
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <motion.div 
                                                        className="bg-blue-50 rounded-xl p-6"
                                                        whileHover={{ scale: 1.02 }}
                                                    >
                                                        <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                                                            <TrendingUp className="h-5 w-5 mr-2" />
                                                            Confidence Trend
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {diagnosis_history.slice(0, 3).map((diagnosis, index) => (
                                                                <motion.div 
                                                                    key={diagnosis.id || index} 
                                                                    className="flex items-center justify-between"
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: index * 0.1 }}
                                                                >
                                                                    <span className="text-sm text-gray-600">
                                                                        {diagnosis?.mental_disorder?.name || 'Tidak diketahui'}
                                                                    </span>
                                                                    <span className="text-sm font-semibold text-blue-600">
                                                                        {diagnosis?.confidence_level || 0}%
                                                                    </span>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </motion.div>

                                                    <motion.div 
                                                        className="bg-green-50 rounded-xl p-6"
                                                        whileHover={{ scale: 1.02 }}
                                                    >
                                                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                                                            <Award className="h-5 w-5 mr-2" />
                                                            Achievements
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {[
                                                                { icon: "🎯", text: "Konsisten Check-up" },
                                                                { icon: "💪", text: "Self-Care Champion" },
                                                                { icon: "🌟", text: "Mental Health Advocate" }
                                                            ].map((achievement, index) => (
                                                                <motion.div 
                                                                    key={index}
                                                                    className="flex items-center space-x-2"
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: index * 0.1 + 0.3 }}
                                                                >
                                                                    <span className="text-2xl">{achievement.icon}</span>
                                                                    <span className="text-sm text-gray-600">{achievement.text}</span>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        ) : (
                                            <motion.div 
                                                className="text-center py-12"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                                <h4 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Riwayat</h4>
                                                <p className="text-gray-500 mb-6">Yuk mulai konsultasi pertama!</p>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Link
                                                        href="/consultation"
                                                        className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                                                    >
                                                        <Brain className="h-5 w-5" />
                                                        <span>Mulai Konsultasi</span>
                                                    </Link>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Consultations Tab */}
                                {activeTab === 'consultations' && (
                                    <motion.div 
                                        className="space-y-6"
                                        key="consultations"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                Riwayat Konsultasi 💭
                                            </h3>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Link
                                                    href="/consultation"
                                                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                    <span>Konsultasi Baru</span>
                                                </Link>
                                            </motion.div>
                                        </div>

                                        <div className="space-y-4">
                                            {consultations.data && consultations.data.length > 0 ? (
                                                consultations.data.map((consultation, index) => (
                                                    <motion.div 
                                                        key={consultation.id} 
                                                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        whileHover={{ y: -2 }}
                                                    >
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                                                                    #{consultations.data.length - index}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-800">
                                                                        Konsultasi {new Date(consultation.created_at).toLocaleDateString('id-ID')}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-500">
                                                                        {new Date(consultation.created_at).toLocaleString('id-ID')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-3">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(consultation.status)}`}>
                                                                    {getStatusIcon(consultation.status)}
                                                                    <span>{getStatusText(consultation.status)}</span>
                                                                </span>
                                                                
                                                                {/* Action buttons based on status */}
                                                                {consultation.status === 'completed' && (
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        <Link
                                                                            href={`/consultation/${consultation.id}/result`}
                                                                            className="text-purple-600 hover:text-purple-700 flex items-center space-x-1"
                                                                            title="Lihat Hasil"
                                                                        >
                                                                            <span className="text-sm">Lihat Hasil</span>
                                                                            <ChevronRight className="h-4 w-4" />
                                                                        </Link>
                                                                    </motion.div>
                                                                )}
                                                                
                                                                {consultation.status === 'in_progress' && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <motion.div
                                                                            whileHover={{ scale: 1.05 }}
                                                                            whileTap={{ scale: 0.95 }}
                                                                        >
                                                                            <Link
                                                                                href={`/consultation/${consultation.id}/question`}
                                                                                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                                                            >
                                                                                <PlayCircle className="h-4 w-4" />
                                                                                <span>Lanjutkan</span>
                                                                            </Link>
                                                                        </motion.div>
                                                                        
                                                                        <motion.div
                                                                            whileHover={{ scale: 1.05 }}
                                                                            whileTap={{ scale: 0.95 }}
                                                                        >
                                                                            <Link
                                                                                href={`/consultation/${consultation.id}/abandon`}
                                                                                method="post"
                                                                                as="button"
                                                                                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                                                title="Batalkan Konsultasi"
                                                                                onClick={(e) => {
                                                                                    if (!confirm('Yakin ingin membatalkan konsultasi ini?')) {
                                                                                        e.preventDefault();
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <Pause className="h-4 w-4" />
                                                                            </Link>
                                                                        </motion.div>
                                                                    </div>
                                                                )}
                                                                
                                                                {consultation.status === 'abandoned' && (
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        <Link
                                                                            href="/consultation"
                                                                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                                                                        >
                                                                            <RotateCcw className="h-4 w-4" />
                                                                            <span>Mulai Ulang</span>
                                                                        </Link>
                                                                    </motion.div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Progress indicator for in_progress consultations */}
                                                        {consultation.status === 'in_progress' && (
                                                            <motion.div 
                                                                className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                transition={{ delay: 0.2 }}
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-sm font-medium text-blue-800">
                                                                        Progress Konsultasi
                                                                    </span>
                                                                    <span className="text-sm text-blue-600">
                                                                        {consultation.progress || 0}% selesai
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-blue-200 rounded-full h-2">
                                                                    <motion.div 
                                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${consultation.progress || 0}%` }}
                                                                        transition={{ duration: 1, delay: 0.3 }}
                                                                    />
                                                                </div>
                                                                <div className="mt-2 text-xs text-blue-600">
                                                                    {consultation.symptoms_found || 0} gejala teridentifikasi
                                                                </div>
                                                            </motion.div>
                                                        )}

                                                        {consultation.final_diagnosis && (
                                                            <motion.div 
                                                                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4"
                                                                whileHover={{ scale: 1.01 }}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="font-medium text-gray-800">
                                                                            {consultation.final_diagnosis.mental_disorder?.name || 'Diagnosis tidak tersedia'}
                                                                        </p>
                                                                        <p className="text-sm text-gray-600">
                                                                            Confidence: {consultation.final_diagnosis.confidence_level || 0}%
                                                                        </p>
                                                                    </div>
                                                                    <Brain className="h-6 w-6 text-purple-600" />
                                                                </div>
                                                                <div className={`px-4 py-2 rounded-full text-sm font-semibold mt-4 inline-block ${getConfidenceColor(consultation.final_diagnosis.confidence_level || 0)}`}>
                                                                    {consultation.final_diagnosis.confidence_level || 0}% akurat
                                                                </div>
                                                                
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                                    <div>
                                                                        <h5 className="font-medium text-gray-700 mb-2">Gejala yang Dilaporkan:</h5>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {consultation.final_diagnosis.symptoms_details?.slice(0, 4).map((symptom: any, idx: number) => (
                                                                                <span key={symptom.code || idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                                                    {symptom.code || `Gejala ${idx + 1}`}
                                                                                </span>
                                                                            ))}
                                                                            {consultation.final_diagnosis.symptoms_details && consultation.final_diagnosis.symptoms_details.length > 4 && (
                                                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                                                    +{consultation.final_diagnosis.symptoms_details.length - 4} lainnya
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="font-medium text-gray-700 mb-2">Rekomendasi:</h5>
                                                                        <p className="text-sm text-gray-600 line-clamp-3">
                                                                            {consultation.final_diagnosis.recommendation || 'Tidak ada rekomendasi khusus'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <motion.div 
                                                    className="text-center py-12"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                                    <h4 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Konsultasi</h4>
                                                    <p className="text-gray-500 mb-6">Yuk mulai konsultasi pertama!</p>
                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Link
                                                            href="/consultation"
                                                            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                                                        >
                                                            <Brain className="h-5 w-5" />
                                                            <span>Mulai Konsultasi</span>
                                                        </Link>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Diagnoses Tab */}
                                {activeTab === 'diagnoses' && (
                                    <motion.div 
                                        className="space-y-6"
                                        key="diagnoses"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            Riwayat Diagnosa 🧠
                                        </h3>
                                        
                                        {diagnosis_history && diagnosis_history.length > 0 ? (
                                            <div className="space-y-4">
                                                {diagnosis_history.map((diagnosis, index) => (
                                                    <motion.div 
                                                        key={diagnosis.id || index} 
                                                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        whileHover={{ y: -2 }}
                                                    >
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div>
                                                                <h4 className="font-semibold text-lg text-gray-800">
                                                                    {diagnosis?.mental_disorder?.name || 'Diagnosis tidak tersedia'}
                                                                </h4>
                                                                <p className="text-sm text-gray-500">
                                                                    {diagnosis?.created_at_human || 'Waktu tidak tersedia'}
                                                                </p>
                                                            </div>
                                                            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getConfidenceColor(diagnosis?.confidence_level || 0)}`}>
                                                                {diagnosis?.confidence_level || 0}% akurat
                                                            </div>
                                                        </div>
                                                        
                                                        {diagnosis?.mental_disorder?.description && (
                                                            <motion.div 
                                                                className="bg-gray-50 rounded-lg p-4 mb-4"
                                                                whileHover={{ scale: 1.01 }}
                                                            >
                                                                <h5 className="font-medium text-gray-700 mb-2">Deskripsi:</h5>
                                                                <p className="text-sm text-gray-600">
                                                                    {diagnosis.mental_disorder.description}
                                                                </p>
                                                            </motion.div>
                                                        )}
                                                        
                                                        {diagnosis?.recommendation && (
                                                            <motion.div 
                                                                className="bg-blue-50 rounded-lg p-4"
                                                                whileHover={{ scale: 1.01 }}
                                                            >
                                                                <h5 className="font-medium text-blue-700 mb-2">Rekomendasi:</h5>
                                                                <p className="text-sm text-blue-600">
                                                                    {diagnosis.recommendation}
                                                                </p>
                                                            </motion.div>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <motion.div 
                                                className="text-center py-12"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                                <h4 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Diagnosa</h4>
                                                <p className="text-gray-500 mb-6">Lakukan konsultasi untuk mendapatkan diagnosis!</p>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Link
                                                        href="/consultation"
                                                        className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                                                    >
                                                        <Brain className="h-5 w-5" />
                                                        <span>Mulai Konsultasi</span>
                                                    </Link>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Call to Action */}
                    <motion.div 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Keep Going! 🚀</h2>
                        <p className="text-xl text-purple-100 mb-8">
                            Perjalanan kesehatan mental adalah marathon, bukan sprint. 
                            Kamu udah di jalur yang tepat! 💪
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {inProgressConsultations.length > 0 ? (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={`/consultation/${inProgressConsultations[0].id}/question`}
                                        className="inline-flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        <PlayCircle className="h-5 w-5" />
                                        <span>Lanjutkan Konsultasi</span>
                                    </Link>
                                </motion.div>
                            ) : (
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
                                    </Link>
                                </motion.div>
                            )}
                            
                            <motion.button 
                                className="inline-flex items-center space-x-2 bg-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-400 transition-colors shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Heart className="h-5 w-5" />
                                <span>Share Progress</span>
                            </motion.button>
                        </div>

                        <div className="mt-8 flex justify-center space-x-4">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                            >
                                <Star className="h-8 w-8" />
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
                                <Award className="h-8 w-8" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Elements with Animation */}
                <motion.div 
                    className="fixed bottom-10 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-60"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                    className="fixed top-20 left-10 w-12 h-12 bg-pink-200 rounded-full opacity-60"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                    className="fixed top-1/2 right-20 w-8 h-8 bg-blue-200 rounded-full opacity-60"
                    animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 0.3, 0.6] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>
        </PublicLayout>
    );
}