import { Fragment } from 'react';
import { Menu, Transition, Dialog } from '@headlessui/react';
import { ChevronDownIcon, UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon, HeartIcon, ClockIcon, ExclamationTriangleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Brain } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { User, isAdmin, getUserRoleDisplay } from '@/types/user';

interface NavbarProps {
    user?: User;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar({ user }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string>('');

    // Semua navigasi items selalu ditampilkan
    const currentPath = window.location.pathname;
    const navigationItems = [
        { name: 'Beranda', href: '/', current: currentPath === '/', icon: '🏠', requiresAuth: false },
        { name: 'Konsultasi', href: '/consultation', current: currentPath === '/consultation' || (currentPath.startsWith('/consultation') && !currentPath.includes('/history')), icon: '💭', requiresAuth: true },
        { name: 'Riwayat', href: '/consultation/history', current: currentPath === '/consultation/history' || currentPath.includes('/consultation/history'), icon: '📋', requiresAuth: true },
    ];

    // Handle navigation dengan auth check
    const handleNavigation = (item: any, e: React.MouseEvent) => {
        if (item.requiresAuth && !user) {
            e.preventDefault();
            setPendingNavigation(item.href);
            setShowLoginAlert(true);
            return;
        }
    };

    const handleLoginConfirm = () => {
        setShowLoginAlert(false);
        router.visit('/login');
    };

    const handleLoginCancel = () => {
        setShowLoginAlert(false);
        setPendingNavigation('');
    };

    return (
        <>
            <motion.nav 
                className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/50"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <motion.div 
                            className="flex items-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Link href="/" className="flex items-center space-x-3 group">
                                <motion.div 
                                    className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-300/50"
                                    whileHover={{ rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <svg
                                        className="w-6 h-6 text-white"
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
                                </motion.div>
                                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Kesehatan Mental
                                </span>
                            </Link>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <motion.div 
                                className="ml-10 flex items-baseline space-x-1"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, staggerChildren: 0.1 }}
                            >
                                {navigationItems.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={(e) => handleNavigation(item, e)}
                                            className={classNames(
                                                item.current
                                                    ? 'text-blue-600 font-semibold bg-blue-50'
                                                    : item.requiresAuth && !user
                                                    ? 'text-gray-400 hover:text-gray-500 cursor-pointer relative'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
                                                'px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg relative group flex items-center space-x-2'
                                            )}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span>{item.name}</span>
                                            {item.requiresAuth && !user && (
                                                <LockClosedIcon className="w-3 h-3 text-gray-400 ml-1" />
                                            )}
                                            {item.current && (
                                                <motion.div
                                                    className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"
                                                    layoutId="activeIndicator"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    style={{ x: '-50%' }}
                                                />
                                            )}
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* User Menu or Sign In */}
                        <motion.div 
                            className="flex items-center space-x-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {user ? (
                                <Menu as="div" className="relative">
                                    <div>
                                        <Menu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            <span className="sr-only">Open user menu</span>
                                            <motion.div 
                                                className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                    <UserCircleIcon className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="text-left hidden sm:block">
                                                    <p className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                                                        <span>{user.name}</span>
                                                        <span className="text-lg">👋</span>
                                                    </p>
                                                    {/* <p className="text-xs text-gray-500 flex items-center space-x-1">
                                                        <span>{getUserRoleDisplay(user)}</span>
                                                        {!isAdmin(user) && <HeartIcon className="h-3 w-3 text-pink-400" />}
                                                    </p> */}
                                                </div>
                                                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                            </motion.div>
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-64 rounded-2xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                                                    <span>{user.name}</span>
                                                    <span className="text-lg">✨</span>
                                                </p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            
                                            
                                            
                                            {/* Admin menu */}
                                            {isAdmin(user) && (
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href="/admin/dashboard"
                                                            className={classNames(
                                                                active ? 'bg-blue-50' : '',
                                                                'block px-4 py-3 text-sm text-gray-700 hover:text-blue-600 transition-colors'
                                                            )}
                                                        >
                                                            <div className="flex items-center">
                                                                <svg className="w-4 h-4 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                                </svg>
                                                                <span>Admin Dashboard</span>
                                                                <span className="ml-2 text-lg">⚙️</span>
                                                            </div>
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            )}
                                            
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href="/logout"
                                                        method="post"
                                                        as="button"
                                                        className={classNames(
                                                            active ? 'bg-red-50' : '',
                                                            'w-full text-left block px-4 py-3 text-sm text-gray-700 hover:text-red-600 transition-colors'
                                                        )}
                                                    >
                                                        <div className="flex items-center">
                                                            <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4 text-red-500" />
                                                            <span>Logout</span>
                                                            <span className="ml-2 text-lg">👋</span>
                                                        </div>
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            ) : (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href="/login"
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-300/30 flex items-center justify-center space-x-2 text-sm min-w-[100px] h-10"
                                    >
                                        <svg
                                            className="w-4 h-4 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3v1"
                                            />
                                        </svg>
                                        <span className="whitespace-nowrap">Sign In</span>
                                    </Link>
                                </motion.div>
                            )}

                            {/* Mobile menu button */}
                            <motion.button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="sr-only">Open main menu</span>
                                {mobileMenuOpen ? (
                                    <XMarkIcon className="block h-6 w-6" />
                                ) : (
                                    <Bars3Icon className="block h-6 w-6" />
                                )}
                            </motion.button>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            className="md:hidden bg-white border-t border-gray-200"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => handleNavigation(item, e)}
                                        className={classNames(
                                            item.current
                                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                                : item.requiresAuth && !user
                                                ? 'text-gray-400 cursor-pointer'
                                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
                                            'flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors'
                                        )}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span>{item.name}</span>
                                        {item.requiresAuth && !user && (
                                            <LockClosedIcon className="w-4 h-4 text-gray-400 ml-auto" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                            
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Login Required Modal */}
            <Transition appear show={showLoginAlert} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={handleLoginCancel}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                                                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-semibold leading-6 text-gray-900 flex items-center space-x-2"
                                            >
                                                <span>Login Diperlukan</span>
                                                <span className="text-xl">🔐</span>
                                            </Dialog.Title>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Untuk mengakses fitur <span className="font-semibold text-blue-600">konsultasi kesehatan mental</span>, 
                                            Anda perlu login terlebih dahulu. Mari mulai perjalanan kesehatan mental Anda! 
                                            <span className="text-lg ml-1">💙</span>
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row-reverse gap-3 mt-6">
                                        <motion.button
                                            type="button"
                                            className="inline-flex justify-center items-center space-x-2 rounded-xl border border-transparent bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                            onClick={handleLoginConfirm}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3v1"
                                                />
                                            </svg>
                                            <span>Login Sekarang</span>
                                            <span className="text-lg">✨</span>
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                            onClick={handleLoginCancel}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Nanti Saja
                                        </motion.button>
                                    </div>

                                    
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}