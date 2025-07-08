import React from 'react'

const page = () => {

    const statItem = 'text-center';
    const statValue = 'text-[1.5rem] font-bold text-[#3b82f6]';
    const statLabel = 'text-[0.9rem] text-[#b0b0b0]';
    const actionButton = 'bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white border-none py-[0.8rem] px-6 rounded-[10px] cursor-pointer font-bold transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(30,56,59,0.4)]';
    const actionButtonSecondary = 'bg-linear-to-br from-[#404040] to-[#2a2a2a] hover:bg-linear-to-br hover:from-[#505050] hover:to-[#3a3a3a]';
    const actionButtonDanger = 'bg-linear-to-br from-[#d32d2d] to-[#b71c1c] hover:bg-linear-to-br hover:from-[#f44336] hover:to-[#d32d2d]';
    const categoryButton = 'bg-[#3a3a3a] text-[#b0b0b0] border-none py-2 px-4 border-[20px] cursor-pointer text-[0.8rem] transition-all duration-300 ease-in-out hover:bg-linear-to-br hover:from-[#3b82f6] hover:to-[#64748b]';
    const shoppingItem = 'bg-[#3a3a3a] rounded-[10px] p-4 flex items-center gap-4 transition-all duration-300 ease-in-out border-l-4 border-l-transparent hover:bg-[$404040] hover:-translate-x-[5px]';
    const itemCompleted = 'opacity-60 bg-[#2d2d2d] border-l-4 border-l-[#7cb342]';
    const itemCompleteLine = 'line-through'
    const itemCheckbox = 'w-[20px] h-[20px] border-2 border-[#3b82f6] rounded-[50%] cursor-pointer flex items-center justify-center transition-all duration-300 ease-in-out';
    const checkboxChecked = 'bg-[#3b82f6]'
    const checkmark = 'text-white font-bold text-[0.8rem]';
    const itemContent = 'flex-1 flex flex-col';
    const itemName = 'font-bold text-[#e0e0e0] mb-[0.2rem]';
    const itemDetails = 'text-[0.8rem] text-[#b0b0b0] flex gap-4';
    const itemCategory = 'bg-[rgba(124, 179, 66, 0.2)] text-[#3b82f6] py-[0.1rem] px-2 rounded-[10px] text-[0.7rem]';
    const itemActions = 'flex gap-2';
    const itemActionButton = 'bg-[#505050] text-white border-none py-[0.4rem] px-[0.6rem] rounded-[5px] cursor-pointer text-[0.7rem] transition-all duration-300 ease-in-out hover:bg-[#3b82f6]';
    const itemDeleteButton = 'hover:bg-[#d32f2f]';
    const summaryStat = 'flex justify-between items-center py-2 px-0 border-b-1 border-b-[#404040]';





    return (
        <>
            <header className='max-w-[1400px] mx-auto p-8 text-center'>
                <h1 className='text-[2.5rem] text-[#3b82f6] mb-4'>🛒 Liste de courses</h1>
                <p className='text-[1.2rem] text-[#b0b0b0] max-w-[600px] mx-auto'>Organisez vos achats efficacement et ne manquez plus jamais d ingrédients.</p>
            </header>

            <section className='max-w-[1400px] mx-auto pt-0 px-8 pb-8 flex gap-4 items-center justify-between flex-wrap'>
                <div className='flex gap-8 items-center bg-[#2a2a2a] py-4 px-8 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.2)]'>
                    <div className={statItem}>
                        <div className={statValue}>12</div>
                        <div className={statLabel}>Articles</div>
                    </div>

                    <div className={statItem}>
                        <div className={statValue}>7</div>
                        <div className={statLabel}>Completes</div>
                    </div>

                    <div className={statItem}>
                        <div className={statValue}>5</div>
                        <div className={statLabel}>Restants</div>
                    </div>

                    <div className={statItem}>
                        <div className={statValue}>-45$</div>
                        <div className={statLabel}>Budget estime</div>
                    </div>
                </div>

                <div className='flex gap-4'>
                    <button className={actionButton}>📱 Partager</button>
                    <button className={`${actionButton} ${actionButtonSecondary}`}>📄 Imprimer</button>
                    <button className={`${actionButton} ${actionButtonDanger}`}>🗑️ Vider</button>
                </div>
            </section>

            <div className='max-w-[1400px] mx-auto pt-0 py-8 px-8 grid grid-cols-[1fr_300px] gap-8'>
                <section className='bg-[#2a2a2a] rounded-[15px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.2)]'>
                    <div className='flex justify-between items-center mb-2'>
                        <h2 className='text-[#3b82f6] text-[1.5rem] font-bold'>Ma liste de courses</h2>
                    </div>

                    <div className='flex gap-2 mb-8'>
                        <input className='flex-1 bg-[#3a3a3a] border-2 border-[#505050] rounded-[10px] p-[0.8rem] text-[#e0e0e0] text-[1rem] transition-colors duration-300 ease-in-out focus:outline-none focus:border-[#3b82f6]' type="text" placeholder='Ajouter un article...' />
                        <button className='bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white border-none py-[0.8rem] px-6 rounded-[10px] cursor-pointer font-bold transition-all duration-300 ease-in-out hover:scale-105'>➕ Ajouter</button>
                    </div>

                    <div className='flex gap-2 mb-8 flex-wrap'>
                        <button className={categoryButton}>Tout</button>
                        <button className={categoryButton}>🥕 Fruits & Légumes</button>
                        <button className={categoryButton}>🥩 Viandes</button>
                        <button className={categoryButton}>🥛 Produits laitiers</button>
                        <button className={categoryButton}>🏪 Épiceri</button>
                        <button className={categoryButton}>📦 Autres</button>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <div className={shoppingItem}>
                            <div className={itemCheckbox}>
                            </div>
                            <div className={itemContent}>
                                <div className={itemName}>Tomates cerises</div>
                                <div className={itemDetails}>
                                    <span className={itemCategory}>Fruits & Legumes</span>
                                    <span>500g • ~3$</span>
                                </div>
                            </div>

                            <div className={itemActions}>
                                <button className={itemActionButton}>✏️</button>
                                <button className={`${itemActionButton} ${itemDeleteButton}`}>🗑️</button>
                            </div>
                        </div>

                        <div className={shoppingItem}>
                            <div className={itemCheckbox}></div>
                            <div className={itemContent}>
                                <div className={itemName}>Concombre</div>
                                <div className={itemDetails}>
                                    <span className={itemCategory}>Fruits & Legumes</span>
                                    <span>2 pièces • ~$</span>
                                </div>
                            </div>

                            <div className={itemActions}>
                                <button className={itemActionButton}>✏️</button>
                                <button className={`${itemActionButton} ${itemDeleteButton}`}>🗑️</button>
                            </div>
                        </div>

                        <div className={`${shoppingItem} ${itemCompleted} ${itemCompleteLine}`}>
                            <div className={`${itemCheckbox} ${checkboxChecked}`}>
                                <span className={checkmark}>✓</span>
                            </div>
                            <div className={itemContent}>
                                <div className={itemName}>Olives noire</div>
                                <div className={itemDetails}>
                                    <span className={itemCategory}>Épicerie</span>
                                    <span>1 pot • ~4€</span>
                                </div>
                            </div>

                            <div className={itemActions}>
                                <button className={itemActionButton}>✏️</button>
                                <button className={`${itemActionButton} ${itemDeleteButton}`}>🗑️</button>
                            </div>
                        </div>

                        <div className={`${shoppingItem} ${itemCompleted} ${itemCompleteLine}`}>
                            <div className={`${itemCheckbox} ${checkboxChecked}`}>
                                <span className={checkmark}>✓</span>
                            </div>
                            <div className={itemContent}>
                                <div className={itemName}>Feta</div>
                                <div className={itemDetails}>
                                    <span className={itemCategory}>Produits laitiers</span>
                                    <span>200g • ~5$</span>
                                </div>
                            </div>

                            <div className={itemActions}>
                                <button className={itemActionButton}>✏️</button>
                                <button className={`${itemActionButton} ${itemDeleteButton}`}>🗑️</button>
                            </div>
                        </div>

                        <div className={shoppingItem}>
                            <div className={itemCheckbox}></div>
                            <div className={itemContent}>
                                <div className={itemName}>Pâtes penne</div>
                                <div className={itemDetails}>
                                    <span className={itemCategory}>Épicerie</span>
                                    <span>500g • ~2€</span>
                                </div>
                            </div>

                            <div className={itemActions}>
                                <button className={itemActionButton}>✏️</button>
                                <button className={`${itemActionButton} ${itemDeleteButton}`}>🗑️</button>
                            </div>
                        </div>

                        <div className={`${shoppingItem} ${itemCompleted} ${itemCompleteLine}`}>
                            <div className={`${itemCheckbox} ${checkboxChecked}`}>
                                <span className={checkmark}>✓</span>
                            </div>
                            <div className={itemContent}>
                                <div className={itemName}>Basilic frais</div>
                                <div className={itemDetails}>
                                    <span className={itemCategory}>Fruits & Legumes</span>
                                    <span>1 bouquet • ~2€</span>
                                </div>
                            </div>

                            <div className={itemActions}>
                                <button className={itemActionButton}>✏️</button>
                                <button className={`${itemActionButton} ${itemDeleteButton}`}>🗑️</button>
                            </div>
                        </div>

                        <div className={shoppingItem}>
                            <div className={itemCheckbox}></div>
                            <div className={itemContent}>
                                <div className={itemName}>Pignons de pin</div>
                                <div className={itemDetails}>
                                    <span className={itemCategory}>Épicerie</span>
                                    <span>100g • ~8$</span>
                                </div>
                            </div>

                            <div className={itemActions}>
                                <button className={itemActionButton}>✏️</button>
                                <button className={`${itemActionButton} ${itemDeleteButton}`}>🗑️</button>
                            </div>
                        </div>

                        <div className={shoppingItem}>
                            <div className={itemCheckbox}></div>
                            <div className={itemContent}>
                                <div className={itemName}>Parmesan</div>
                                <div className={itemDetails}>
                                    <span className={itemCategory}>Produits laitiers</span>
                                    <span>200g • ~6</span>
                                </div>
                            </div>

                            <div className={itemActions}>
                                <button className={itemActionButton}>✏️</button>
                                <button className={`${itemActionButton} ${itemDeleteButton}`}>🗑️</button>
                            </div>
                        </div>

                        <div className={shoppingItem}>
                            <div className={itemCheckbox}></div>
                            <div className={itemContent}>
                                <div className={itemName}>Pignons de pin</div>
                                <div className={itemDetails}>
                                    <span className={itemCategory}>Épicerie</span>
                                    <span>100g • ~8$</span>
                                </div>
                            </div>

                            <div className={itemActions}>
                                <button className={itemActionButton}>✏️</button>
                                <button className={`${itemActionButton} ${itemDeleteButton}`}>🗑️</button>
                            </div>
                        </div>
                    </div>
                </section>

                <aside className='flex flex-col gap-6'>
                    <div className='bg-[#2a2a2a] rounded-[15px] p-6 shadow-[0_4px_15px_rgba(0.0.0.0.2)]'>
                        <h3 className='text-[#3b82f6] text-[1.2rem] font-bold mb-4'>📊 Résumé</h3>
                        <div className='flex flex-col gap-4'>
                            <div className={summaryStat}>
                                <span className={summaryLabel}>Total d articles</span>
                                <span className={summaryValue}>12</span>
                            </div>

                            <div className={summaryStat}>
                                <span className={summaryLabel}>Article coches</span>
                                <span className={summaryValue}>7</span>
                            </div>

                            <div className={summaryStat}>
                                <span className={summaryLabel}>Budget estime</span>
                                <span className={summaryValue}>45$</span>
                            </div>

                            <div className={`${summaryStat} border-none`}>
                                <span className={summaryLabel}>Temps estime</span>
                                <span className={summaryValue}>25 minutes</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    )
}

export default page