import Link from 'next/link'
import React from 'react'

const navbar = () => {
    const linkClasses = 'cursor-pointer text-[#e0e0e0] no-underline font-medium transition-colors duration-300 ease-in-out relative hover:text-[#7cb342]'

    return (
        <nav className='bg-gradient-to-br from-[#2d5016] to-[#1a3009] px-8 py-4 shadow-lg sticky top-0 z-[100]'>
            <div className='max-w-6xl mx-auto flex justify-between items-center'>
                <Link className='text-3xl font-bold text-[#7cb342] no-underline' href={'/'}>🍽️ PlanEat</Link>
                <ul className='flex list-none gap-8'>
                    <li>
                        <Link className={linkClasses} href={'/'}>Home</Link>
                    </li>
                    <li>
                        <Link className={linkClasses} href={'/home'}>Receipes</Link>
                    </li>

                    <li>
                        <Link className={linkClasses} href={'/home'}>Planification</Link>
                    </li>
                    <li>
                        <Link className={linkClasses} href={'/home'}>Shopping List</Link>
                    </li>
                    <li>
                        <Link className={linkClasses} href={'/home'}>Account</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default navbar