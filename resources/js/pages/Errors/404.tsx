import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
    Home, 
    ArrowLeft, 
    Search, 
    Brain,
    AlertTriangle,
    Compass,
    RefreshCw
} from 'lucide-react';

export default function Error404() {
    const handleGoBack = () => {
        window.history.back();
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <>
            <Head title="404 - Halaman Tidak Ditemukan" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    {/* Main Error Content */}
                    <div className="text-center space-y-8">
                        {/* Animated 404 Number */}
                        <div className="relative">
                            <div className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-pulse">
                                404
                            </div>
                            <div className="absolute inset-0 text-8xl md:text-9xl font-extrabold text-blue-100 -z-10 blur-sm">
                                404
                            </div>
                        </div>

                        {/* Error Icon */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <Compass className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '8s' }} />
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Oops! Halaman Tidak Ditemukan
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada. 
                                Jangan khawatir, mari kita bantu Anda kembali ke jalur yang benar.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                <Link href="/">
                                    <Home className="mr-2 h-5 w-5" />
                                    Kembali ke Beranda
                                </Link>
                            </Button>
                            
                            <Button 
                                onClick={handleGoBack}
                                variant="outline" 
                                size="lg"
                                className="border-gray-300 hover:bg-gray-50 transition-all duration-300"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Halaman Sebelumnya
                            </Button>

                            <Button 
                                onClick={handleRefresh}
                                variant="ghost" 
                                size="lg"
                                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
                            >
                                <RefreshCw className="mr-2 h-5 w-5" />
                                Muat Ulang
                            </Button>
                        </div>

                        {/* Quick Links */}
                        <Card className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                                    <Search className="w-5 h-5" />
                                    Mungkin Anda mencari:
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Link 
                                        href="/admin/dashboard" 
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                                    >
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                                            <Brain className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-gray-900">Admin Dashboard</div>
                                            <div className="text-sm text-gray-500">Panel administrasi sistem</div>
                                        </div>
                                    </Link>

                                    <Link 
                                        href="/consultation" 
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 group"
                                    >
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                                            <Search className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-gray-900">Konsultasi</div>
                                            <div className="text-sm text-gray-500">Mulai diagnosis mental health</div>
                                        </div>
                                    </Link>

                                    <Link 
                                        href="/admin/mental-disorders" 
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 group"
                                    >
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                                            <Brain className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-gray-900">Gangguan Mental</div>
                                            <div className="text-sm text-gray-500">Database gangguan mental</div>
                                        </div>
                                    </Link>

                                    <Link 
                                        href="/admin/symptoms" 
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200 group"
                                    >
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-gray-900">Gejala</div>
                                            <div className="text-sm text-gray-500">Database gejala sistem</div>
                                        </div>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Help Text */}
                        <div className="text-center text-sm text-gray-500 space-y-2">
                            <p>Jika masalah terus berlanjut, silakan hubungi administrator sistem.</p>
                            <p className="font-mono text-xs bg-gray-100 px-3 py-1 rounded-full inline-block">
                                Error Code: 404 - Page Not Found
                            </p>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 left-20 w-12 h-12 bg-indigo-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-40 right-10 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                </div>
            </div>
        </>
    );
}