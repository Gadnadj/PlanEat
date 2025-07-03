import Link from 'next/link'
import React from 'react'

const navbar = () => {
    const linkClasses = 'nav-link cursor-pointer text-[#e0e0e0] no-underline font-medium transition-colors duration-300 ease-in-out relative hover:text-[#3b82f6]'

    return (
        <nav className='bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4 py-4 sm:px-8 sm:py-4 shadow-lg sticky top-0 z-[100]'>
            <div className='max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:gap-0 justify-between items-center'>
                <Link className='text-3xl font-bold text-[#3b82f6] no-underline' href={'/'}>
                    🍽️ PlanEat
                </Link>
                <ul className='flex flex-row max-md:hidden list-none gap-8'>
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
                    <li>
                        <Link className={linkClasses} href={'/login'}>Login</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default navbar