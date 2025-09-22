"use client"
import Link from 'next/link'
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
    const linkClasses = 'nav-link cursor-pointer text-[#e0e0e0] no-underline font-medium transition-colors duration-300 ease-in-out relative hover:text-[#3b82f6]'
    const { user, logout } = useAuth()

    return (
        <nav className='bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4 py-4 sm:px-8 sm:py-4 shadow-lg sticky top-0 z-[100]'>
            <div className='max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:gap-0 justify-between items-center'>
                <Link className='text-3xl font-bold text-[#3b82f6] no-underline' href={'/'}>
                    🍽️ PlanEat
                </Link>
                <ul className='flex flex-row max-md:hidden list-none gap-8 items-center'>
                    <li>
                        <Link className={linkClasses} href={'/'}>Home</Link>
                    </li>
                    <li>
                        <Link className={linkClasses} href={'/recipe'}>Recipes</Link>
                    </li>
                    <li>
                        <Link className={linkClasses} href={'/planification'}>Planification</Link>
                    </li>
                    <li>
                        <Link className={linkClasses} href={'/shopping-list'}>Shopping List</Link>
                    </li>
                    {user ? (
                        <li className='flex items-center gap-4'>
                            <span className='text-gray-300 text-sm'>
                                Bonjour, {user.name}
                            </span>
                            <button 
                                onClick={logout}
                                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm'
                            >
                                Déconnexion
                            </button>
                        </li>
                    ) : (
                        <li>
                            <Link className={linkClasses} href={'/login'}>Login</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar