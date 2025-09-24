"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
    const linkClasses = 'nav-link cursor-pointer text-[#e0e0e0] no-underline font-medium transition-colors duration-300 ease-in-out relative hover:text-[#3b82f6]'
    const mobileLinkClasses = 'block px-4 py-3 text-[#e0e0e0] hover:text-[#3b82f6] hover:bg-gray-700/50 transition-all duration-300 no-underline'
    const { user, logout, loading } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    return (
        <nav className='bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4 py-4 sm:px-8 sm:py-4 shadow-lg sticky top-0 z-[100]'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex justify-between items-center'>
                    {/* Logo */}
                    <Link className='text-3xl font-bold text-[#3b82f6] no-underline' href={'/'}>
                        🍽️ PlanEat
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className='hidden md:flex list-none gap-8 items-center'>
                        <li>
                            <Link className={linkClasses} href={'/'}>Home</Link>
                        </li>
                        <li>
                            <Link className={linkClasses} href={'/recipe'}>Recipes</Link>
                        </li>
                        <li>
                            <Link className={linkClasses} href={'/planification'}>Meal Planning</Link>
                        </li>
                        <li>
                            <Link className={linkClasses} href={'/shopping-list'}>Shopping List</Link>
                        </li>
                        {loading ? (
                            <li className='flex items-center'>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#3b82f6]"></div>
                            </li>
                        ) : user ? (
                            <li className='flex items-center gap-4'>
                                <span className='text-gray-300 text-sm'>
                                    Hello, {user.name}
                                </span>
                                <button 
                                    onClick={logout}
                                    className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm'
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li>
                                <Link className={linkClasses} href={'/login'}>Login</Link>
                            </li>
                        )}
                    </ul>

                    {/* Mobile Menu Button */}
                    <button 
                        className='md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1'
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        <span className={`block w-6 h-0.5 bg-[#e0e0e0] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-[#e0e0e0] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-[#e0e0e0] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className='py-4 mt-4 border-t border-gray-600'>
                        <ul className='flex flex-col space-y-2'>
                            <li>
                                <Link className={mobileLinkClasses} href={'/'} onClick={closeMobileMenu}>
                                    🏠 Home
                                </Link>
                            </li>
                            <li>
                                <Link className={mobileLinkClasses} href={'/recipe'} onClick={closeMobileMenu}>
                                    📖 Recipes
                                </Link>
                            </li>
                            <li>
                                <Link className={mobileLinkClasses} href={'/planification'} onClick={closeMobileMenu}>
                                    📅 Meal Planning
                                </Link>
                            </li>
                            <li>
                                <Link className={mobileLinkClasses} href={'/shopping-list'} onClick={closeMobileMenu}>
                                    🛒 Shopping List
                                </Link>
                            </li>
                            {loading ? (
                                <li className='px-4 py-3 border-t border-gray-600 mt-2 pt-4 flex justify-center'>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#3b82f6]"></div>
                                </li>
                            ) : user ? (
                                <>
                                    <li className='px-4 py-2 text-gray-300 text-sm border-t border-gray-600 mt-2 pt-4'>
                                        Hello, {user.name}
                                    </li>
                                    <li>
                                        <button 
                                            onClick={() => {
                                                logout()
                                                closeMobileMenu()
                                            }}
                                            className='w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-300'
                                        >
                                            🚪 Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <Link className={mobileLinkClasses} href={'/login'} onClick={closeMobileMenu}>
                                        🔐 Login
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar