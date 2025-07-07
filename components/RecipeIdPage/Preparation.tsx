import React from 'react'
import { styles } from './styles'

const steps = [
    'Lavez soigneusement les tomates cerises et coupez-les en deux...',
    'Émincez finement l\'oignon rouge...',
    'Coupez la feta en cubes de taille moyenne...',
    'Dans un grand saladier, mélangez l\'huile d\'olive...',
    'Ajoutez tous les légumes préparés...',
    'Laissez reposer la salade au réfrigérateur pendant 15 minutes...'
]

const Preparation = () => {
    return (
        <section className='bg-[#2a2a2a] rounded-[15px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.4)]'>
            <h2 className='text-[#3b82f6] text-[1.5rem] flex items-center gap-[0.7rem] mb-6'>
                <span className='text-[1.3rem]'>👨‍🍳</span> Preparation
            </h2>
            <div className='[counter-reset:step-counter]'>
                {steps.map((step, index) => (
                    <div key={index} className={styles.stepItem}>
                        <div className={styles.stepText}>{step}</div>
                        <div className={styles.stepTime}>3 minutes</div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Preparation
