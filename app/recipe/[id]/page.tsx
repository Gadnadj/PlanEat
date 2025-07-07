import Header from '@/components/RecipeIdPage/Headers';
import Ingredients from '@/components/RecipeIdPage/Ingredients';
import Preparation from '@/components/RecipeIdPage/Preparation';
import React from 'react'

const page = () => {
    return (
        <div className='max-w-[1400px] mx-auto px-8 py-12 grid [grid-template-columns:1fr_350px] gap-12 max-lg:grid max-lg:grid-cols-1 max-md:pt-0 max-md:px-4 max-md:pb-8'>
            <main>
                <Header />

                <div className='flex flex-col gap-8 max-sm:p-6'>
                    <Ingredients />

                    <Preparation />
                </div>
            </main>

            <aside className='flex flex-col gap-6 max-sm:p-4'>
                
            </aside>
        </div>
    )
}

export default page