import React from 'react'

const statItem = 'text-center bg-[rgba(30,41,59,0.4)] p-4 rounded-[12px] border border-[rgba(124,179,66,0.2)]';
const statValue = 'font-bold text-[#3b82f6] text-[1.3rem] block';
const statLabel = 'text-[0.85rem] text-[#b0b0b0] mt-[0.3rem]';
const buttonAction = 'flex-1 py-4 px-6 border-none font-bold cursor-pointer transition-all duration-300 ease-in-out text-[1rem] hover:-translate-y-(2px) hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]';
const buttonPrimary = 'bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white hover:bg-linear-to-br hover:from-blue-500 hover:to-blue-600';
const buttonSecondary = 'bg-[#404040] text-[#e0e0e0] border-2 border-[#505050] hover:bg-[#505050] hover:border-[#606060]';
const ingredientItem = 'bg-[#3a3a3a] p-4 rounded-[10px] border-l-4 border-[#3b82f6] transition-all duration-300 ease-in-out flex justify-between items-center hover:bg-[#424242] hover:-translate-x-[5px]';
const ingredientName = 'font-medium text-[#e0e0e0]';
const ingredientQuantity = 'text-[#3b82f6] font-bold text-[0.9rem]';
const stepItem = 'className="step-item group [counter-increment:step-counter] relative mb-4 pl-16 p-6 rounded-xl bg-[#3a3a3a] hover:bg-[#424242] transition-all duration-300 ease-in-out before:content-[counter(step-counter)] before:absolute before:left-4 before:top-1/2 before:transform before:-translate-y-1/2 before:bg-gradient-to-br before:from-[#7cb342] before:to-[#558b2f] before:text-white before:w-8 before:h-8 before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-[0.9rem]';
const stepText = 'text-[#e0e0e0] leading-[1.6]';
const stepTime = 'text-[#3b82f6] text-[0.85rem] font-medium mt-2';
const nutritionItem = 'bg-[#3a3a3a] p-[0.8rem] rounded-[8px] text-center';
const nutritionValue = 'font-bold text-[#3b82f6] text-[1.1rem]';
const nutritionLabel = 'text-[0.8rem] text-[#b0b0b0] text-[1.1rem]';

const page = () => {
    return (
        <div className='max-w-[1400px] mx-auto px-8 py-12 grid [grid-template-columns:1fr_350px] gap-12 max-lg:grid max-lg:grid-cols-1 max-md:pt-0 max-md:px-4 max-md:pb-8'>
            <main>
                <header className='bg-linear-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] mb-8'>
                    <div className='relative h-[400px] bg-linear-to-br from-[#3b82f6] to-[#64748b] flex justify-center items-center text-[8rem] text-white max-md:h-[250px] max-md:text-[4rem]'>
                        🥗
                        <span className='absolute top-6 right-6 bg-[rgba(76,89,175,0.9)] text-white px-4 py-2 rounded-[20px] text-[0.9rem] font-bold '>Facile</span>
                        <span className='absolute bottom-6 left-6 bg-black/80 text-white px-4 py-2 rounded-[20px] text-[0.9rem] flex items-center gap-2'>15 min</span>
                    </div>

                    <div className='p-8 max-sm:p-6'>
                        <h1 className='text-[2.5rem] text-[#3b82f6] mb-4 font-bold max-md:text-[2rem]'>Salade Mediterraneenne</h1>
                        <p className='text-[1.1rem] text-[#b0b0b0] mb-8 leading-[1.7]'>Une salade fraîche et colorée aux saveurs méditerranéennes, parfaite pour l été.
                            Cette recette combine les meilleurs ingrédients de la cuisine méditerranéenne pour
                            un plat sain, savoureux et rafraîchissant qui vous transportera directement sur les
                            côtes ensoleillées de la Méditerranée.
                        </p>

                        <div className='flex gap-[0.7rem] mb-8 flex-wrap'>
                            <span className='bg-[#404040] text-[#b0b0b0] px-4 py-2 rounded-[15px] text-[0.9rem] font-medium'>Vegetarien</span>
                            <span className='bg-[#404040] text-[#b0b0b0] px-4 py-2 rounded-[15px] text-[0.9rem] font-medium'>Healthy</span>
                            <span className='bg-[#404040] text-[#b0b0b0] px-4 py-2 rounded-[15px] text-[0.9rem] font-medium'>Rapide</span>
                            <span className='bg-[#404040] text-[#b0b0b0] px-4 py-2 rounded-[15px] text-[0.9rem] font-medium'>Sans cussion</span>
                        </div>

                        <div className='grid [grid-template-columns:1fr_1fr_1fr_1fr] gap-4 mb-8 max-lg:grid-cols-2 max-sm:grid-cols-1'>
                            <div className={statItem}>
                                <span className={statValue}>4.8</span>
                                <span className={statLabel}>Note</span>
                            </div>

                            <div className={statItem}>
                                <span className={statValue}>2</span>
                                <span className={statLabel}>Portions</span>
                            </div>

                            <div className={statItem}>
                                <span className={statValue}>285</span>
                                <span className={statLabel}>Calories</span>
                            </div>

                            <div className={statItem}>
                                <span className={statValue}>15 min</span>
                                <span className={statLabel}>Preparation</span>
                            </div>
                        </div>

                        <div className='flex gap-4 max-md:flex-col '>
                            <button className={`${buttonAction} ${buttonPrimary}`}>Ajouter au planing</button>
                            <button className={`${buttonAction} ${buttonSecondary}`}>❤️ Favoris</button>
                            <button className={`${buttonAction} ${buttonSecondary}`}>📤 Partager</button>
                        </div>
                    </div>
                </header>

                <div className='flex flex-col gap-8 max-sm:p-6'>
                    <section className='bg-[#2a2a2a] rounded-[15px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.4)]'>
                        <h2 className='text-[#3b82f6] text-[1.5rem] flex items-center gap-[0.7rem] mb-6'>
                            <span className='text-[1.3rem]'>
                                🛒
                            </span>
                            Ingredients
                        </h2>
                        <div className='grid [grid-template-columns:repeat(auto-fit,_minmax(250px,_1fr))] gap-4 max-md:grid-cols-1'>
                            <div className={ingredientItem}>
                                <span className={ingredientName}>Tomates cerises</span>
                                <span className={ingredientQuantity}>200g</span>
                            </div>

                            <div className={ingredientItem}>
                                <span className={ingredientName}>Concombre</span>
                                <span className={ingredientQuantity}>200g</span>
                            </div>

                            <div className={ingredientItem}>
                                <span className={ingredientName}>Olives noires</span>
                                <span className={ingredientQuantity}>200g</span>
                            </div>

                            <div className={ingredientItem}>
                                <span className={ingredientName}>Feta</span>
                                <span className={ingredientQuantity}>200g</span>
                            </div>

                            <div className={ingredientItem}>
                                <span className={ingredientName}>Oignon rouge</span>
                                <span className={ingredientQuantity}>200g</span>
                            </div>

                            <div className={ingredientItem}>
                                <span className={ingredientName}>Huile dolive</span>
                                <span className={ingredientQuantity}>200g</span>
                            </div>

                            <div className={ingredientItem}>
                                <span className={ingredientName}>Vinaigre balsamique</span>
                                <span className={ingredientQuantity}>200g</span>
                            </div>

                            <div className={ingredientItem}>
                                <span className={ingredientName}>Tomates ceries</span>
                                <span className={ingredientQuantity}>200g</span>
                            </div>

                            <div className={ingredientItem}>
                                <span className={ingredientName}>Origan séché</span>
                                <span className={ingredientQuantity}>200g</span>
                            </div>

                            <div className={ingredientItem}>
                                <span className={ingredientName}>Basilic frai</span>
                                <span className={ingredientQuantity}>200g</span>
                            </div>

                            <div className={ingredientItem}>
                                <span className={ingredientName}>Sel et poivre</span>
                                <span className={ingredientQuantity}>200g</span>
                            </div>
                        </div>
                    </section>

                    <section className='bg-[#2a2a2a] rounded-[15px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.4)]'>
                        <h2 className='text-[#3b82f6] text-[1.5rem] flex items-center gap-[0.7rem] mb-6'>
                            <span className='text-[1.3rem]'>
                                👨‍🍳
                            </span>
                            Preparation
                        </h2>
                        <div className='[counter-reset:step-counter]'>
                            <div className={stepItem}>
                                <div className={stepText}>
                                    Lavez soigneusement les tomates cerises et coupez-les en deux.
                                    Épluchez le concombre et coupez-le en dés de taille moyenne.
                                </div>
                                <div className={stepTime}>3 minutes</div>
                            </div>

                            <div className={stepItem}>
                                <div className={stepText}>
                                    Émincez finement loignon rouge. Si vous préférez un goût moins
                                    prononcé, faites-le tremper dans leau froide pendant 10 minutes
                                    puis égouttez-le.
                                </div>
                                <div className={stepTime}>3 minutes</div>
                            </div>

                            <div className={stepItem}>
                                <div className={stepText}>
                                    Coupez la feta en cubes de taille moyenne. Égouttez les olives
                                    noires si nécessaire.
                                </div>
                                <div className={stepTime}>3 minutes</div>
                            </div>

                            <div className={stepItem}>
                                <div className={stepText}>
                                    Dans un grand saladier, mélangez lhuile dolive, le vinaigre
                                    balsamique, lorigan, le sel et le poivre pour préparer la vinaigrette.

                                </div>
                                <div className={stepTime}>3 minutes</div>
                            </div>

                            <div className={stepItem}>
                                <div className={stepText}>
                                    Ajoutez tous les légumes préparés, les olives et la feta dans le
                                    saladier. Mélangez délicatement pour bien enrober tous les ingrédients
                                    de vinaigrette.
                                </div>
                                <div className={stepTime}>3 minutes</div>
                            </div>

                            <div className={stepItem}>
                                <div className={stepText}>
                                    Laissez reposer la salade au réfrigérateur pendant 15 minutes pour
                                    que les saveurs se mélangent. Garnissez de feuilles de basilic frais
                                    avant de servir.
                                </div>
                                <div className={stepTime}>3 minutes</div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <aside className='flex flex-col gap-6 max-sm:p-4'>
                <div className='bg-[#2a2a2a] rounded-[15px] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.2)]'>
                    <h3 className='text-[#3b82f6] text-[1.2rem] mb-4 flex items-center gap-2'>
                        <span className='text-[1.3rem]'>
                            📊
                        </span>
                        Nutrition par portion
                    </h3>
                    <div className='grid grid-cols-2 gap-[0.8rem] max-md:grid-cols-1'>
                        <div className={nutritionItem}>
                            <div className={nutritionValue}>285</div>
                            <div className={nutritionLabel}>Calories</div>
                        </div>

                        <div className={nutritionItem}>
                            <div className={nutritionValue}>12g</div>
                            <div className={nutritionLabel}>Proteines</div>
                        </div>

                        <div className={nutritionItem}>
                            <div className={nutritionValue}>8g</div>
                            <div className={nutritionLabel}>Glucides</div>
                        </div>

                        <div className={nutritionItem}>
                            <div className={nutritionValue}>24g</div>
                            <div className={nutritionLabel}>Lipides</div>
                        </div>

                        <div className={nutritionItem}>
                            <div className={nutritionValue}>4g</div>
                            <div className={nutritionLabel}>Fibres</div>
                        </div>

                        <div className={nutritionItem}>
                            <div className={nutritionValue}>580mg</div>
                            <div className={nutritionLabel}>Sodium</div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}

export default page