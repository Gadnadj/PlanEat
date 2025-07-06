import React from 'react'

const statItem = 'text-center bg-[rgba(124,179,66,0.1)] p-4 rounded-[12px] border border-[rgba(124,179,66,0.2)]';
const statValue = 'font-bold text-[#3b82f6] text-[1.3rem] block';
const statLabel = 'text-[0.85rem] text-[#b0b0b0] mt-[0.3rem]';
const buttonAction = 'flex-1 py-4 px-6 border-none font-bold cursor-pointer transition-all duration-300 ease-in-out text-[1rem] hover:-translate-y-(2px) hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]';
const buttonPrimary = 'bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white hover:bg-linear-to-br hover:from-[#558b2f] hover:to-[#33691e]'
const buttonSecondary = 'bg-[#404040] text-[#e0e0e0] border-2 border-[#505050] hover:bg-[#505050] hover:border-[#606060]'

const page = () => {
    return (
        <div className='max-w-[1400px] mx-auto px-8 py-12 grid [grid-template-columns:1fr_350px] gap-12'>
            <main>
                <header className='bg-linear-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] mb-8'>
                    <div className='relative h-[400px] bg-linear-to-br from-[#3b82f6] to-[#64748b] flex justify-center items-center text-[8rem] text-white'>
                        🥗
                        <span className='absolute top-6 right-6 bg-[rgba(76,89,175,0.9)] text-white px-4 py-2 rounded-[20px] text-[0.9rem] font-bold '>Facile</span>
                        <span className='absolute bottom-6 left-6 bg-black/80 text-white px-4 py-2 rounded-[20px] text-[0.9rem] flex items-center gap-2'>15 min</span>
                    </div>

                    <div className='p-8'>
                        <h1 className='text-[2.5rem] text-[#3b82f6] mb-4 font-bold'>Salade Mediterraneenne</h1>
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

                        <div className='grid [grid-template-columns:1fr_1fr_1fr_1fr] gap-4 mb-8'>
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

                        <div className='flex gap-4'>
                            <button className={`${buttonAction} ${buttonPrimary}`}>Ajouter au planing</button>
                            <button className={`${buttonAction} ${buttonSecondary}`}>❤️ Favoris</button>
                            <button className={`${buttonAction} ${buttonSecondary}`}>📤 Partager</button>
                        </div>
                    </div>
                </header>

                <div>
                    <section>
                        <h2>
                            <span>
                                🛒
                            </span>
                            Ingredients
                        </h2>
                        <div>
                            <div>
                                <span>Tomates cerises</span>
                                <span>200g</span>
                            </div>

                            <div>
                                <span>Concombre</span>
                                <span>200g</span>
                            </div>

                            <div>
                                <span>Olives noires</span>
                                <span>200g</span>
                            </div>

                            <div>
                                <span>Feta</span>
                                <span>200g</span>
                            </div>

                            <div>
                                <span>Oignon rouge</span>
                                <span>200g</span>
                            </div>

                            <div>
                                <span>Huile dolive</span>
                                <span>200g</span>
                            </div>

                            <div>
                                <span>Vinaigre balsamique</span>
                                <span>200g</span>
                            </div>

                            <div>
                                <span>Tomates ceries</span>
                                <span>200g</span>
                            </div>

                            <div>
                                <span>Origan séché</span>
                                <span>200g</span>
                            </div>

                            <div>
                                <span>Basilic frai</span>
                                <span>200g</span>
                            </div>

                            <div>
                                <span>Sel et poivre</span>
                                <span>200g</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>
                            <span>
                                👨‍🍳
                            </span>
                            Preparation
                        </h2>
                        <div>
                            <div>
                                <div>
                                    Lavez soigneusement les tomates cerises et coupez-les en deux.
                                    Épluchez le concombre et coupez-le en dés de taille moyenne.
                                </div>
                                <div>3 minutes</div>
                            </div>

                            <div>
                                <div>
                                    Émincez finement loignon rouge. Si vous préférez un goût moins
                                    prononcé, faites-le tremper dans leau froide pendant 10 minutes
                                    puis égouttez-le.
                                </div>
                                <div>3 minutes</div>
                            </div>

                            <div>
                                <div>
                                    Coupez la feta en cubes de taille moyenne. Égouttez les olives
                                    noires si nécessaire.
                                </div>
                                <div>3 minutes</div>
                            </div>

                            <div>
                                <div>
                                    Dans un grand saladier, mélangez lhuile dolive, le vinaigre
                                    balsamique, lorigan, le sel et le poivre pour préparer la vinaigrette.

                                </div>
                                <div>3 minutes</div>
                            </div>

                            <div>
                                <div>
                                    Ajoutez tous les légumes préparés, les olives et la feta dans le
                                    saladier. Mélangez délicatement pour bien enrober tous les ingrédients
                                    de vinaigrette.
                                </div>
                                <div>3 minutes</div>
                            </div>

                            <div>
                                <div>
                                    Laissez reposer la salade au réfrigérateur pendant 15 minutes pour
                                    que les saveurs se mélangent. Garnissez de feuilles de basilic frais
                                    avant de servir.
                                </div>
                                <div>3 minutes</div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <aside>
                <div>
                    <h3>
                        <span>
                            📊
                        </span>
                        Nutrition par portion
                    </h3>
                    <div>
                        <div>
                            <div>285</div>
                            <div>Calories</div>
                        </div>

                        <div>
                            <div>12g</div>
                            <div>Proteines</div>
                        </div>

                        <div>
                            <div>8g</div>
                            <div>Glucides</div>
                        </div>

                        <div>
                            <div>24g</div>
                            <div>Lipides</div>
                        </div>

                        <div>
                            <div>4g</div>
                            <div>Fibres</div>
                        </div>

                        <div>
                            <div>580mg</div>
                            <div>Sodium</div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}

export default page