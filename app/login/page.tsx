"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const Page = () => {
    const { login, signup } = useAuth();
    
    const tabButtonBase = 'flex-1 px-4 py-[0.8rem] bg-transparent border-none font-semibold cursor-pointer rounded-lg transition-all duration-300 ease-in-out text-[0.95rem] max-sm:py-2 max-sm:px-3 max-sm:text-sm';
    const formGroup = 'mb-6';
    const formLabel = 'block mb-2 text-[#e0e0e0] font-medium text-[0.9rem]';
    const formInput = 'w-full px-5 py-4 bg-[rgba(30,41,59,0.8)] border-2 border-[rgba(30,41,59,0.4)] rounded-xl text-[#e5e7eb] text-base transition-all duration-300 ease-in-out backdrop-blur-lg placeholder-[#9ca3af] focus:outline-none focus:border-[#3b82f6] focus:bg-gray-600 focus:ring-4 focus:ring-[#60a5fa]/10 max-sm:py-2';
    const passwordContainer = 'relative';
    const passwordToogle = 'absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#9ca3af] cursor-pointer transition-colors duration-300 ease-in-out hover:text-[#3b82f6]';
    const formOptions = 'flex justify-between items-center mb-8 text-sm';
    const checkboxContainer = 'flex items-center gap-2';
    const confirmButton = 'w-full p-4 bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white border-none rounded-lg text-[1.1rem] font-bold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(30,41,59,0.4)] hover:bg-gradient-to-br hover:from-[#3b82f6] hover:to-[#1e293b] active:translate-y-0 max-sm:py-2';
    
    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // States for login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // States for signup form
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const result = await login(loginEmail, loginPassword);
        setMessage(result.message);
        setLoading(false);

        if (result.success) {
            window.location.href = "/";
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (signupPassword !== signupConfirmPassword) {
            setMessage('Passwords do not match');
            setLoading(false);
            return;
        }

        const result = await signup(signupEmail, signupPassword, signupName);
        setMessage(result.message);
        setLoading(false);

        if (result.success) {
            window.location.href = "/";
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <nav className="w-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4 py-4 sm:px-8 sm:py-4 shadow-lg sticky top-0 z-[100]">
                <div className="max-w-7xl mx-auto flex justify-center">
                    <Link className='text-3xl font-bold text-[#3b82f6] no-underline' href={'/'}>🍽️ PlanEat</Link>
                </div>
            </nav>
            <div className='flex'>
                <div className="bg-[rgb(42,42,42)]/95 backdrop-blur-xl p-12 shadow-2xl w-full max-w-md m-8 relative overflow-hidden rounded-lg max-md:py-8 max-md:px-6 max-md:m-4 max-sm:py-6 max-sm:px-4">
                    {/* Shimmer bar */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent animate-shimmer"></div>

                    {activeTab === 'login' ? (
                        <div className='text-center mb-10'>
                            <h1 className='text-[2.2rem] text-[#3b82f6] mb-2 font-bold max-md:text-[2rem]'>
                                Welcome Back
                            </h1>
                            <p className='text-[#b0b0b0] text-base leading-6'>Join PlanEat to revolutionize your way of cooking with AI</p>
                        </div>
                    ) : (
                        <div className='text-center mb-10'>
                            <h1 className='text-[2.2rem] text-[#3b82f6] mb-2 font-bold max-md:text-[2rem]'>
                                Welcome
                            </h1>
                            <p className='text-[#b0b0b0] text-base leading-6'>Join PlanEat to revolutionize your way of cooking with AI</p>
                        </div>
                    )}

                    {/* TABS */}
                    <div className='flex mb-8 bg-[rgba(64,64,64,0.5)] rounded-[12px] p-[0.3rem]'>
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`
                        ${tabButtonBase}
                        ${activeTab === 'login'
                                    ? 'bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white shadow-[0_4px_15px_rgba(30,41,59,0.4)]'
                                    : 'text-[#b0b0b0] hover:text-[#3b82f6] hover:bg-[rgba(115,127,230,0.1)]'
                                }
                    `}
                        >
                            Login
                        </button>

                        <button
                            onClick={() => setActiveTab('register')}
                            className={`
                        ${tabButtonBase}
                        ${activeTab === 'register'
                                    ? 'bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white shadow-[0_4px_15px_rgba(30,41,59,0.4)]'
                                    : 'text-[#b0b0b0] hover:text-[#3b82f6] hover:bg-[rgba(115,127,230,0.1)]'
                                }
                    `}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* MESSAGE */}
                    {message && (
                        <div className={`mb-6 p-3 rounded-lg text-sm ${
                            message.includes('success') || message.includes('successful') 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                            {message}
                        </div>
                    )}

                    {/* LOGIN FORM */}
                    {activeTab === 'login' && (
                        <form onSubmit={handleLogin} className='animate-fadeInUp space-y-6'>
                            <div className={formGroup}>
                                <label className={formLabel}>Email</label>
                                <input 
                                    className={formInput} 
                                    type="email" 
                                    placeholder='Your Email'
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={formGroup}>
                                <label className={formLabel}>Password</label>
                                <div className={passwordContainer}>
                                    <input 
                                        className={formInput} 
                                        type={showLoginPassword ? "text" : "password"} 
                                        placeholder='********'
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                    <button 
                                        className={passwordToogle} 
                                        type='button'
                                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    >
                                        {showLoginPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div className={formOptions}>
                                <div className={checkboxContainer}>
                                    <input className=' w-[18px] h-[18px] accent-[#3b82f6]' type="checkbox" />
                                    <label>Remember me</label>
                                </div>
                                <Link href={'/forget-password'} className='text-[#3b82f6] no-underline transition-all duration0300 ease-out hover:text-[#64748b]'>Forgot Password?</Link>
                            </div>
                            <button type='submit' className={confirmButton} disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    )}

                    {/* SIGNUP FORM */}
                    {activeTab === 'register' && (
                        <form onSubmit={handleSignup} className='animate-fadeInUp space-y-6'>
                            <div className={formGroup}>
                                <label className={formLabel}>Full Name</label>
                                <input 
                                    className={formInput} 
                                    type="text" 
                                    placeholder='Your Name'
                                    value={signupName}
                                    onChange={(e) => setSignupName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={formGroup}>
                                <label className={formLabel}>Email</label>
                                <input 
                                    className={formInput} 
                                    type="email" 
                                    placeholder='Your email'
                                    value={signupEmail}
                                    onChange={(e) => setSignupEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={formGroup}>
                                <label className={formLabel}>Password</label>
                                <div className={passwordContainer}>
                                    <input 
                                        className={formInput} 
                                        type={showSignupPassword ? "text" : "password"} 
                                        placeholder='********'
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        required
                                    />
                                    <button 
                                        className={passwordToogle}
                                        type='button'
                                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                                    >
                                        {showSignupPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div className={formGroup}>
                                <label className={formLabel}>Confirm Password</label>
                                <div className={passwordContainer}>
                                    <input 
                                        className={formInput} 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        placeholder='********'
                                        value={signupConfirmPassword}
                                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button 
                                        className={passwordToogle}
                                        type='button'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>
                            <div className={formOptions}>
                                <div className={checkboxContainer}>
                                    <input className=' w-[18px] h-[18px] accent-[#3b82f6]' type="checkbox" />
                                    <label>I accept the <Link href={'/terms'}>terms of service</Link></label>
                                </div>
                            </div>
                            <button type='submit' className={confirmButton} disabled={loading}>
                                {loading ? 'Creating account...' : 'Create my account'}
                            </button>
                        </form>
                    )}

                    {/* SEPARATOR */}
                    <div className='flex items-center my-8 text-[#888] text-sm'>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#404040] to-transparent"></div>
                        {/* <span className='px-4'>or continue with</span> */}
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#404040] to-transparent"></div>
                    </div>
                    {/* <div className='flex gap-4 mb-8'>
                        <button className='flex-1 p-3 bg-[rgba(64,64,64,0.8)] border border-[rgba(30,41,59,0.2)] rounded-[8px] text-[#e0e0e0] cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center gap-2 text-sm hover:bg-[rgba(30,41,59,0.6)] hover:border-[#3b82f6] max-sm:py-2'>Google</button>
                    </div> */}
                </div >
            </div>
        </div>
    )
}

export default Page