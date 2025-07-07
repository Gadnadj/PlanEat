import React from 'react'
import { styles } from './styles'

const ingredients = [
    'Tomates cerises',
    'Concombre',
    'Olives noires',
    'Feta',
    'Oignon rouge',
    'Huile d\'olive',
    'Vinaigre balsamique',
    'Tomates ceries',
    'Origan séché',
    'Basilic frais',
    'Sel et poivre'
]

const Ingredients = () => {
    return (
        <section className='bg-[#2a2a2a] rounded-[15px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.4)]'>
            <h2 className='text-[#3b82f6] text-[1.5rem] flex items-center gap-[0.7rem] mb-6'>
                <span className='text-[1.3rem]'>🛒</span> Ingredients
            </h2>
            <div className='grid [grid-template-columns:repeat(auto-fit,_minmax(250px,_1fr))] gap-4 max-md:grid-cols-1'>
                {ingredients.map((item, index) => (
                    <div key={index} className={styles.ingredientItem}>
                        <span className={styles.ingredientName}>{item}</span>
                        <span className={styles.ingredientQuantity}>200g</span>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Ingredients
