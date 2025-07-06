import Header from '@/components/ReceipePage/Headers'
import RecipesList from '@/components/ReceipePage/RecipesList'
import Search from '@/components/ReceipePage/Search'
import React from 'react'

const page = () => {
    return (
        <div>
            <Header />
            <Search />
            <RecipesList />
        </div>
    )
}
export default page