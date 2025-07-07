import React from 'react'
import { styles } from './styles'

const nutritionData = [
    { value: '285', label: 'Calories' },
    { value: '12g', label: 'Proteines' },
    { value: '8g', label: 'Glucides' },
    { value: '24g', label: 'Lipides' },
    { value: '4g', label: 'Fibres' },
    { value: '580mg', label: 'Sodium' }
]

const Nutrition = () => {
    return (
        <div className='bg-[#2a2a2a] rounded-[15px] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.2)]'>
            <h3 className='text-[#3b82f6] text-[1.2rem] mb-4 flex items-center gap-2'>
                <span className='text-[1.3rem]'>📊</span> Nutrition par portion
            </h3>
            <div className='grid grid-cols-2 gap-[0.8rem] max-md:grid-cols-1'>
                {nutritionData.map((item, index) => (
                    <div key={index} className={styles.nutritionItem}>
                        <div className={styles.nutritionValue}>{item.value}</div>
                        <div className={styles.nutritionLabel}>{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Nutrition
