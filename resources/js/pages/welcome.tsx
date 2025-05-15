import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PageProps } from '@/types/user';
import PublicLayout from '@/layouts/public-layout';
import { 
    HeartIcon, 
    ShieldCheckIcon, 
    UserGroupIcon, 
    DocumentTextIcon,
    ChartBarIcon,
    AcademicCapIcon,
    ClockIcon,
    CheckCircleIcon,
    ChatBubbleLeftRightIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';
import { AnimatePresence } from 'framer-motion';

interface User {
    id: number;
    name: string;
    email: string;
    role?: {
        name: string;
        display_name: string;
    };
}

interface WelcomeProps extends PageProps {
    status?: string;
    error?: string;
    info?: string;
    auth: {
        user?: User;
    };
}

export default function Welcome({ auth, status, error, info }: WelcomeProps) {
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

    const features = [
        {
            icon: ChatBubbleLeftRightIcon,
            title: 'Konsultasi Online',
            description: 'Konsultasi langsung dengan psikolog berpengalaman melalui platform digital yang aman dan terpercaya',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: ShieldCheckIcon,
            title: 'Privasi Terjamin',
            description: 'Data dan riwayat konsultasi Anda dilindungi dengan sistem enkripsi tingkat militer',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: UserGroupIcon,
            title: 'Tim Profesional',
            description: 'Didukung oleh tim psikolog dan konselor berpengalaman dari Universitas Jenderal Soedirman',
            color: 'from-purple-500 to-violet-500'
        },
        {
            icon: ChartBarIcon,
            title: 'Monitoring Progress',
            description: 'Pantau perkembangan kesehatan mental Anda dengan dashboard analitik yang komprehensif',
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: ClockIcon,
            title: 'Akses 24/7',
            description: 'Layanan darurat dan dukungan tersedia kapan saja untuk membantu Anda',
            color: 'from-indigo-500 to-blue-500'
        },
        {
            icon: AcademicCapIcon,
            title: 'Program Edukasi',
            description: 'Akses materi edukatif, webinar, dan workshop tentang kesehatan mental',
            color: 'from-pink-500 to-rose-500'
        }
    ];

    const stats = [
        { label: 'Mahasiswa Terbantu', value: '1,250+', icon: UserGroupIcon },
        { label: 'Konselor Aktif', value: '25', icon: AcademicCapIcon },
        { label: 'Sesi Konseling', value: '3,800+', icon: ChatBubbleLeftRightIcon },
        { label: 'Tingkat Kepuasan', value: '98%', icon: CheckCircleIcon }
    ];

    return (
        <PublicLayout user={auth?.user} title="Kesehatan Mental - Universitas Jenderal Soedirman">
            {/* Status Messages */}
            <AnimatePresence>
                {(status || error || info) && (
                    <motion.div 
                        className="container mx-auto px-4 pt-8"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        {status && (
                            <motion.div 
                                className="p-4 mb-4 bg-green-50 border border-green-200 rounded-xl shadow-sm"
                                layoutId="status"
                            >
                                <p className="text-sm text-green-700 font-medium">{status}</p>
                            </motion.div>
                        )}
                        {error && (
                            <motion.div 
                                className="p-4 mb-4 bg-red-50 border border-red-200 rounded-xl shadow-sm"
                                layoutId="error"
                            >
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </motion.div>
                        )}
                        {info && (
                            <motion.div 
                                className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm"
                                layoutId="info"
                            >
                                <p className="text-sm text-blue-700 font-medium">{info}</p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-4 -right-4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
                        animate={{
                            y: [-20, 20, -20],
                            x: [-10, 10, -10],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-8 -left-8 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
                        animate={{
                            y: [20, -20, 20],
                            x: [10, -10, 10],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center max-w-5xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Logo */}
                        <motion.div 
                            className="mb-8"
                            variants={itemVariants}
                        >
                            <motion.div 
                                className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mb-8"
                                whileHover={{ 
                                    scale: 1.05,
                                    rotate: [0, -5, 5, 0],
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <HeartIcon className="w-16 h-16 text-white" fill="currentColor" />
                            </motion.div>
                        </motion.div>
                        
                        {/* Main Heading */}
                        <motion.h1 
                            className="text-5xl md:text-7xl font-bold mb-6"
                            variants={itemVariants}
                        >
                            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                                Sistem Cek Kesehatan Mental
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Backward Chaining
                            </span>
                        </motion.h1>
                        
                        {/* Subtitle */}
                        <motion.p 
                            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
                            variants={itemVariants}
                        >
                            Platform konsultasi dan monitoring kesehatan mental untuk mendukung 
                            kesejahteraan psikologis mahasiswa Universitas Jenderal Soedirman dengan 
                            pendekatan profesional, aman, dan terpercaya.
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div 
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                            variants={itemVariants}
                        >
                            {!auth?.user ? (
                                <>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href="/login"
                                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl"
                                        >
                                            <HeartIcon className="w-5 h-5 mr-2" />
                                            Mulai Konsultasi
                                        </Link>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href="#layanan"
                                            className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
                                        >
                                            <DocumentTextIcon className="w-5 h-5 mr-2" />
                                            Pelajari Layanan
                                        </Link>
                                    </motion.div>
                                </>
                            ) : (
                                <motion.div 
                                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 max-w-lg"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {auth.user.role?.name === 'admin' ? (
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ShieldCheckIcon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                Welcome Admin!
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                Kelola sistem kesehatan mental dengan panel admin yang komprehensif.
                                            </p>
                                            <Link
                                                href="/admin/dashboard"
                                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                                            >
                                                <ChartBarIcon className="w-5 h-5 mr-2" />
                                                Admin Dashboard
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <UserGroupIcon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                Selamat Datang, {auth.user?.name}!
                                            </h3>
                                            <p className="text-gray-600">
                                                Sistem sedang dalam tahap pengembangan. Fitur konsultasi akan segera tersedia untuk Anda.
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div 
                            className="grid grid-cols-2 md:grid-cols-4 gap-8"
                            variants={itemVariants}
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    className="text-center"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                        <stat.icon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="layanan" className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center max-w-3xl mx-auto mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
                            Layanan Komprehensif
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Kami menyediakan berbagai layanan kesehatan mental yang dirancang khusus 
                            untuk mendukung kesejahteraan mahasiswa
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="h-full bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-gray-200">
                                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Siap Memulai Perjalanan Kesehatan Mental Anda?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Bergabung dengan ribuan mahasiswa Unsoed yang telah merasakan manfaat layanan kami
                        </p>
                        {!auth?.user && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/login"
                                    className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-xl"
                                >
                                    <HeartIcon className="w-5 h-5 mr-2" />
                                    Mulai Sekarang
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="kontak" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center max-w-3xl mx-auto mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
                            Butuh Bantuan?
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Tim kami siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <motion.div
                            className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                <PhoneIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Hotline Darurat</h3>
                            <p className="text-gray-600 mb-4">Layanan konsultasi darurat 24/7</p>
                            <p className="text-2xl font-bold text-blue-600">(0281) 638791</p>
                        </motion.div>

                        <motion.div
                            className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                                <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Live Chat</h3>
                            <p className="text-gray-600 mb-4">Chat langsung dengan konselor online</p>
                            <motion.button
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Mulai Chat
                            </motion.button>
                        </motion.div>

                        <motion.div
                            className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                                <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Email Support</h3>
                            <p className="text-gray-600 mb-4">Kirim pertanyaan via email</p>
                            <p className="text-blue-600 font-semibold">mental.health@unsoed.ac.id</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="tentang" className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
                                Tentang Kami
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Sistem Kesehatan Mental Unsoed adalah platform terintegrasi yang dikembangkan 
                                untuk mendukung kesejahteraan psikologis mahasiswa Universitas Jenderal Soedirman.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Pendekatan Holistik</h3>
                                        <p className="text-gray-600">Menggabungkan terapi psikologi modern dengan pendekatan budaya lokal</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Berbasis Riset</h3>
                                        <p className="text-gray-600">Dikembangkan berdasarkan penelitian terkini dalam bidang kesehatan mental</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircleIcon className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Aksesibilitas Tinggi</h3>
                                        <p className="text-gray-600">Mudah diakses kapan saja dan di mana saja melalui platform digital</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative z-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                                        <div className="text-sm text-gray-600">Tingkat Keberhasilan</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                                        <div className="text-sm text-gray-600">Layanan Support</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                                        <div className="text-sm text-gray-600">Kerahasiaan Data</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-600 mb-2">5+</div>
                                        <div className="text-sm text-gray-600">Tahun Pengalaman</div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
                        </motion.div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}