import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
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

    const navigationItems = [
        { name: 'Beranda', href: '/', current: true },
       
    ];

    return (
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
                                Kesehatan Mental Unsoed
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
                                        className={classNames(
                                            item.current
                                                ? 'text-blue-600 font-semibold'
                                                : 'text-gray-600 hover:text-blue-600',
                                            'px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-blue-50/80 relative group'
                                        )}
                                    >
                                        {item.name}
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
                                            {/* {user.avatar ? (
                                                <img
                                                    className="h-9 w-9 rounded-full ring-2 ring-blue-100"
                                                    src={user.avatar}
                                                    alt={user.name}
                                                />
                                            ) : (
                                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                    <UserCircleIcon className="h-6 w-6 text-white" />
                                                </div>
                                            )} */}
                                            <div className="text-left hidden sm:block">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {getUserRoleDisplay(user)}
                                                </p>
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
                                            <p className="text-sm font-semibold text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        
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
                                                            Admin Dashboard
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
                                                        Logout
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
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-300/30 flex items-center space-x-2"
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
                                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    <span>Sign In</span>
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
                                    className={classNames(
                                        item.current
                                            ? 'bg-blue-50 text-blue-600 font-semibold'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
                                        'block px-3 py-3 rounded-lg text-base font-medium transition-colors'
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        {!user && (
                            <div className="px-2 pb-3">
                                <Link
                                    href="/login"
                                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-3 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}