import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-bold">Kesehatan Mental Unsoed</span>
                        </div>
                        <p className="text-gray-300 mb-4 max-w-md">
                            Platform konsultasi dan monitoring kesehatan mental untuk mendukung 
                            kesejahteraan psikologis mahasiswa Universitas Jenderal Soedirman.
                        </p>
                        
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#layanan" className="text-gray-300 hover:text-white transition-colors">
                                    Layanan Konseling
                                </Link>
                            </li>
                            <li>
                                <Link href="#tentang" className="text-gray-300 hover:text-white transition-colors">
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="#kontak" className="text-gray-300 hover:text-white transition-colors">
                                    Kontak
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                            Kontak
                        </h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 mr-2 mt-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm">
                                    Jl. Prof. DR. HR Boenyamin No.708,<br />
                                    Grendeng, Purwokerto, Jawa Tengah
                                </span>
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-sm">(0281) 638791</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm">info@unsoed.ac.id</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-400">
                            © 2025 Universitas Jenderal Soedirman. All rights reserved.
                        </p>
                        <div className="mt-4 md:mt-0 flex space-x-6">
                            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}