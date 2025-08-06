"use client"
import Modal from '@/components/ModaleCreation/Modal'
import Header from '@/components/ReceipePage/Headers'
import RecipesList from '@/components/ReceipePage/RecipesList'
import Search from '@/components/ReceipePage/Search'
import { useEffect, useState } from 'react'

const Page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    return (
        <div className='relative'>
            <div className='fixed bottom-2 right-0 block z-[99] max-md:bottom-1 max-md:right-1'>
                <button
                    className='w-[60px] h-[60px] bg-linear-to-br from-[#3b82f6] to-[#64748b] border-none rounded-[50%] text-white text-[1.8rem] cursor-pointer shadow-[0_4px_15px_rgba(30,41,59,0.4)] transition-all duration-300 ease-in-out flex items-center justify-center hover:scale-110 hover:shadow-[0_6px_25px_rgba(66,165,245,0.6)] active:scale-95 max-md:w-[50px] max-md:h-[50px] max-md:text-[1.5rem]'
                    onClick={openModal}
                >
                    +
                </button>
            </div>

            {isModalOpen && <Modal onClose={closeModal} />}
            <Header />
            <Search />
            <RecipesList />
        </div>
    )
}

export default Page
