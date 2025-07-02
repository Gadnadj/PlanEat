"use client"
import Link from 'next/link'
import React, { useState } from 'react'

const Page = () => {

    const tabButtonBase = 'flex-1 px-4 py-[0.8rem] bg-transparent border-none font-semibold cursor-pointer rounded-lg transition-all duration-300 ease-in-out text-[0.95rem] max-sm:py-2 max-sm:px-3 max-sm:text-sm';
    const formGroup = 'mb-6';
    const formLabel = 'block mb-2 text-[#e0e0e0] font-medium text-[0.9rem]';
    const formInput = 'w-full px-5 py-4 bg-[rgba(64,64,64,0.8)] border-2 border-[rgba(64,64,64,0.5)] rounded-xl text-[#e5e7eb] text-base transition-all duration-300 ease-in-out backdrop-blur-lg placeholder-[#9ca3af] focus:outline-none focus:border-[#84cc16] focus:bg-gray-600 focus:ring-4 focus:ring-lime-500/10 max-sm:py-2';
    const passwordContainer = 'relative';
    const passwordToogle = 'absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#9ca3af] cursor-pointer transition-colors duration-300 ease-in-out hover:text-[#7cb342]';
    const formOptions = 'flex justify-between items-center mb-8 text-sm';
    const checkboxContainer = 'flex items-center gap-2';
    const confirmButton = 'w-full p-4 bg-gradient-to-br from-[#7cb342] to-[#558b2f] text-white border-none rounded-lg text-[1.1rem] font-bold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(124,179,66,0.4)] hover:bg-gradient-to-br hover:from-[#558b2f] hover:to-[#33691e] active:translate-y-0 max-sm:py-2';
    const [activeTab, setActiveTab] = useState('login');


    return (
        <div className='flex flex-col items-center justify-center'>
            <nav className="w-full bg-gradient-to-br from-[#2d5016] to-[#1a3009] px-4 py-4 sm:px-8 sm:py-4 shadow-lg sticky top-0 z-[100]">
                <div className="max-w-7xl mx-auto flex justify-center">
                    <Link className='text-3xl font-bold text-[#7cb342] no-underline' href={'/'}>🍽️ PlanEat</Link>
                </div>
            </nav>
            <div className="bg-[rgb(42,42,42)]/95 backdrop-blur-xl p-12 shadow-2xl w-full max-w-md m-8 relative overflow-hidden rounded-lg max-md:py-8 max-md:px-6 max-md:m-4 max-sm:py-6 max-sm:px-4">
                {/* Barre shimmer */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#7cb342] to-transparent animate-shimmer"></div>

                {activeTab === 'login' ? (
                    <div className='text-center mb-10'>
                        <h1 className='text-[2.2rem] text-[#7cb342] mb-2 font-bold max-md:text-[2rem]'>
                            Bon Retour
                        </h1>
                        <p className='text-[#b0b0b0] text-base leading-6'>Rejoignez PlanEat pour revolutionner votre facon de cuisiner avec l IA</p>
                    </div>
                ) : (
                    <div className='text-center mb-10'>
                        <h1 className='text-[2.2rem] text-[#7cb342] mb-2 font-bold max-md:text-[2rem]'>
                            Bienvenue
                        </h1>
                        <p className='text-[#b0b0b0] text-base leading-6'>Rejoignez PlanEat pour revolutionner votre facon de cuisiner avec l IA</p>
                    </div>
                )}

                {/* ONGLETS */}
                <div className='flex mb-8 bg-[rgba(64,64,64,0.5)] rounded-[12px] p-[0.3rem]'>
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`
                        ${tabButtonBase}
                        ${activeTab === 'login'
                                ? 'bg-gradient-to-br from-[#7cb342] to-[#558b2f] text-white shadow-[0_4px_15px_rgba(124,179,66,0.3)]'
                                : 'text-[#b0b0b0] hover:text-[#7cb342] hover:bg-[rgba(124,179,66,0.1)]'
                            }
                    `}
                    >
                        Connexion
                    </button>

                    <button
                        onClick={() => setActiveTab('register')}
                        className={`
                        ${tabButtonBase}
                        ${activeTab === 'register'
                                ? 'bg-gradient-to-br from-[#7cb342] to-[#558b2f] text-white shadow-[0_4px_15px_rgba(124,179,66,0.3)]'
                                : 'text-[#b0b0b0] hover:text-[#7cb342] hover:bg-[rgba(124,179,66,0.1)]'
                            }
                    `}
                    >
                        Inscription
                    </button>

                </div>
                {/* MESSAGE */}
                <div className="message error">Erreur lors de l envoi du formulaire.</div>
                <div className="message success">Formulaire envoyé avec succès.</div>


                {/* FORMULAIRE DE CONNEXION */}
                {
                    activeTab === 'login' && (
                        <form className='animate-fadeInUp space-y-6'>
                            <div className={formGroup}>
                                <label className={formLabel}>Email</label>
                                <input className={formInput} type="email" placeholder='Your Email' />
                            </div>

                            <div className={formGroup}>
                                <label className={formLabel}>Password</label>
                                <div className={passwordContainer}>
                                    <input className={formInput} type="password" placeholder='********' />
                                    <button className={passwordToogle} type='button'>👁️</button>
                                </div>
                            </div>

                            <div className={formOptions}>
                                <div className={checkboxContainer}>
                                    <input className=' w-[18px] h-[18px] accent-[#7cb342]' type="checkbox" />
                                    <label>Se souvenir de moi</label>
                                </div>
                                <Link href={'/forget-password'} className='text-[#7cb342] no-underline transition-all duration0300 ease-out hover:text-[#558b2f]'>Forget Password</Link>
                            </div>
                            <button type='submit' className={confirmButton}>Login</button>
                        </form>
                    )
                }

                {/* FORMULAIRE D'INSCRIPTION */}
                {
                    activeTab === 'register' && (
                        <form className='animate-fadeInUp space-y-6'>
                            <div className={formGroup}>
                                <label className={formLabel}>Full Name</label>
                                <input className={formInput} type="text" placeholder='Your Name' />
                            </div>

                            <div className={formGroup}>
                                <label className={formLabel}>Email</label>
                                <input className={formInput} type="email" placeholder='Your email' />
                            </div>

                            <div className={formGroup}>
                                <label className={formLabel}>Password</label>
                                <div className={passwordContainer}>
                                    <input className={formInput} type="password" placeholder='********' />
                                    <button className={passwordToogle}>👁️</button>
                                </div>
                            </div>

                            <div className={formGroup}>
                                <label className={formLabel}>Confirm Password</label>
                                <div className={passwordContainer}>
                                    <input className={formInput} type="password" placeholder='********' />
                                    <button className={passwordToogle}>👁️</button>
                                </div>
                            </div>
                            <div className={formOptions}>
                                <div className={checkboxContainer}>
                                    <input className=' w-[18px] h-[18px] accent-[#7cb342]' type="checkbox" />
                                    <label>J accepte les <Link href={'/terms'}>conditions d utilisation</Link></label>
                                </div>
                            </div>
                            <button type='submit' className={confirmButton}>Create my account</button>
                        </form>
                    )
                }

                {/* SEPARATOR */}
                <div className='flex items-center my-8 text-[#888] text-sm'>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#404040] to-transparent"></div>
                    <span className='px-4'>ou continuer avec</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#404040] to-transparent"></div>
                </div>
                <div className='flex gap-4 mb-8'>
                    <button className='flex-1 p-3 bg-[rgba(64,64,64,0.8)] border border-[rgba(124,179,66,0.2)] rounded-[8px] text-[#e0e0e0] cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center gap-2 text-sm hover:bg-[rgba(124,179,66,0.1)] hover:border-[#7cb342] max-sm:py-2'>Google</button>
                </div>
            </div >
        </div>
    )
}

export default Page