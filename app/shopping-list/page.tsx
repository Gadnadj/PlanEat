import ActionButton from '@/components/ShoppingList/ActionButtons'
import Headers from '@/components/ShoppingList/Headers'
import CategoryFilters from '@/components/ShoppingList/ShoppingList/CategoryFilters'
import ShoppingItem from '@/components/ShoppingList/ShoppingList/ShoppingItem'
import StatSection from '@/components/ShoppingList/StatSection'
import Summary from '@/components/ShoppingList/Summary'
import React from 'react'

const page = () => {

    return (
        <>
            <Headers />

            <section className='max-w-[1400px] mx-auto pt-0 px-8 pb-8 flex gap-4 items-center justify-between flex-wrap max-md:flex-col max-md:gap-4  max-sm:pl-4 max-sm:pr-4'>
                <StatSection />
                <ActionButton />
            </section>

            <div className='max-w-[1400px] mx-auto pt-0 py-8 px-8 grid grid-cols-[1fr_300px] gap-8 max-lg:grid-cols-1 max-md:pt-0 max-md:px-4 max-md:pb-8  max-sm:pl-4 max-sm:pr-4'>
                <section className='bg-[#2a2a2a] rounded-[15px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.2)]'>
                    <div className='flex justify-between items-center mb-2'>
                        <h2 className='text-[#3b82f6] text-[1.5rem] font-bold'>Ma liste de courses</h2>
                    </div>

                    <div className='flex gap-2 mb-8 max-sm:flex-col'>
                        <input className='flex-1 bg-[#3a3a3a] border-2 border-[#505050] rounded-[10px] p-[0.8rem] text-[#e0e0e0] text-[1rem] transition-colors duration-300 ease-in-out focus:outline-none focus:border-[#3b82f6]' type="text" placeholder='Ajouter un article...' />
                        <button className='bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white border-none py-[0.8rem] px-6 rounded-[10px] cursor-pointer font-bold transition-all duration-300 ease-in-out hover:scale-105'>➕ Ajouter</button>
                    </div>

                    <CategoryFilters />

                    <div className='flex flex-col gap-2'>
                        <ShoppingItem />
                        <ShoppingItem />
                        <ShoppingItem />
                        <ShoppingItem />
                        <ShoppingItem />
                        <ShoppingItem />
                        <ShoppingItem />
                        <ShoppingItem />
                        <ShoppingItem />
                    </div>
                </section>

                <aside className='flex flex-col gap-6 max-lg:grid max-lg:grid-cols-[repaeat(auto-fit,_minmax(250px,_1fr))] max-md:grid-cols-1'>
                    <Summary />
                </aside>
            </div>
        </>
    )
}

export default page