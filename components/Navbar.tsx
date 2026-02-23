import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { userName, isSignedIn, signIn, signOut } = useAuth();

    const displayName = userName || "User";

    const handleAuth = async () => {
        if (isSignedIn) {
            await signOut();
        } else {
            await signIn();
        }
    };

    return (
        <nav className="fixed w-full z-50 bg-black/10 backdrop-blur-lg border-b border-white/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Left Side: Logo + Nav Items */}
                    <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                                    <span className="text-white font-bold text-lg">A</span>
                                </div>
                                <span className="font-bold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all duration-300">
                                    Archify
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Menu - Moved here */}
                        <div className="hidden md:block">
                            <div className="flex items-baseline space-x-2 md:space-x-4 lg:space-x-6">
                                {['Product', 'Pricing', 'Community', 'Enterprise'].map((item) => (
                                    <Link
                                        key={item}
                                        to={`/${item.toLowerCase()}`}
                                        className="text-gray-300 hover:text-white px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/5 relative group"
                                    >
                                        {item}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Auth Buttons */}
                    <div className="hidden md:block">
                        <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                            {isSignedIn ? (
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-white font-medium truncate max-w-[100px]">{displayName}</span>
                                    <button
                                        onClick={handleAuth}
                                        className="text-gray-400 hover:text-white ml-2 text-sm font-medium transition-colors hover:bg-white/5 px-2 lg:px-3 py-2 rounded-md whitespace-nowrap"
                                    >
                                        Log out
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={handleAuth}
                                        className="text-gray-300 hover:text-white px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/5 whitespace-nowrap"
                                    >
                                        Log in
                                    </button>
                                    <button
                                        onClick={handleAuth}
                                        className="bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700 px-4 lg:px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-white/10 whitespace-nowrap"
                                    >
                                        Get Started
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="bg-white/5 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none ring-1 ring-white/10"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay & Drawer */}
            <div className={`md:hidden fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />

                {/* Drawer */}
                <div className={`relative w-[80%] max-w-sm bg-black/90 backdrop-blur-2xl h-screen shadow-2xl border-l border-white/10 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full overflow-y-auto no-scrollbar">

                        {/* Drawer Header with Close Button */}
                        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 shrink-0">
                            <span className="font-bold text-lg tracking-tighter text-white">
                                Menu
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 -mr-2 text-gray-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Drawer Links */}
                        <div className="px-6 py-4 space-y-2 flex-grow">
                            {['Product', 'Pricing', 'Community', 'Enterprise'].map((item) => (
                                <Link
                                    key={item}
                                    to={`/${item.toLowerCase()}`}
                                    className="text-gray-300 hover:text-white block px-4 py-2.5 rounded-xl text-base font-medium hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/5"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>

                        {/* Drawer Footer Actions */}
                        <div className="mt-auto px-6 py-6 border-t border-white/10 bg-black/20 shrink-0">
                            {isSignedIn ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-base shadow-lg">
                                            {displayName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm">{displayName}</span>
                                            <span className="text-gray-400 text-xs">Logged in</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleAuth();
                                            setIsOpen(false);
                                        }}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Log out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => {
                                            handleAuth();
                                            setIsOpen(false);
                                        }}
                                        className="text-white hover:bg-white/10 w-full py-3 rounded-xl text-sm font-semibold transition-all border border-white/10"
                                    >
                                        Log in
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleAuth();
                                            setIsOpen(false);
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-violet-600 text-white w-full py-3 rounded-xl text-sm font-bold text-center shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 transition-all transform hover:scale-[1.02]"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
