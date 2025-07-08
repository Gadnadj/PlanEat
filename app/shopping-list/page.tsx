import React from 'react'

const page = () => {

    const statItem = 'text-center';
    const statValue = 'text-[1.5rem] font-bold text-[#3b82f6]';
    const statLabel = 'text-[0.9rem] text-[#b0b0b0]';
    const actionButton = 'bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white border-none py-[0.8rem] px-6 rounded-[10px] cursor-pointer font-bold transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(30,56,59,0.4)]';
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
                    <button className={actionButton}>📄 Imprimer</button>
                    <button className={actionButton}>🗑️ Vider</button>
                </div>
            </section>

            <div>
                <section>
                    <div>
                        <h2>Ma liste de courses</h2>
                    </div>

                    <div>
                        <input type="text" placeholder='Ajouter un article...' />
                        <button>➕ Ajouter</button>
                    </div>

                    <div>
                        <button>Tout</button>
                        <button>🥕 Fruits & Légumes</button>
                        <button>🥩 Viandes</button>
                        <button>🥛 Produits laitiers</button>
                        <button>🏪 Épiceri</button>
                        <button>📦 Autres</button>
                    </div>

                    <div>
                        <div>
                            <div></div>
                            <div>
                                <div>Tomates cerises</div>
                                <div>
                                    <span>Fruits & Legumes</span>
                                    <span>500g • ~3$</span>
                                </div>
                            </div>

                            <div>
                                <button>✏️</button>
                                <button>🗑️</button>
                            </div>
                        </div>

                        <div>
                            <div></div>
                            <div>
                                <div>Concombre</div>
                                <div>
                                    <span>Fruits & Legumes</span>
                                    <span>2 pièces • ~$</span>
                                </div>
                            </div>

                            <div>
                                <button>✏️</button>
                                <button>🗑️</button>
                            </div>
                        </div>

                        <div>
                            <div></div>
                            <div>
                                <div>Olives noire</div>
                                <div>
                                    <span>Épicerie</span>
                                    <span>1 pot • ~4€</span>
                                </div>
                            </div>

                            <div>
                                <button>✏️</button>
                                <button>🗑️</button>
                            </div>
                        </div>

                        <div>
                            <div></div>
                            <div>
                                <div>Feta</div>
                                <div>
                                    <span>Produits laitiers</span>
                                    <span>200g • ~5$</span>
                                </div>
                            </div>

                            <div>
                                <button>✏️</button>
                                <button>🗑️</button>
                            </div>
                        </div>

                        <div>
                            <div></div>
                            <div>
                                <div>Pâtes penne</div>
                                <div>
                                    <span>Épicerie</span>
                                    <span>500g • ~2€</span>
                                </div>
                            </div>

                            <div>
                                <button>✏️</button>
                                <button>🗑️</button>
                            </div>
                        </div>

                        <div>
                            <div></div>
                            <div>
                                <div>Basilic frais</div>
                                <div>
                                    <span>Fruits & Legumes</span>
                                    <span>1 bouquet • ~2€</span>
                                </div>
                            </div>

                            <div>
                                <button>✏️</button>
                                <button>🗑️</button>
                            </div>
                        </div>

                        <div>
                            <div></div>
                            <div>
                                <div>Pignons de pin</div>
                                <div>
                                    <span>Épicerie</span>
                                    <span>100g • ~8$</span>
                                </div>
                            </div>

                            <div>
                                <button>✏️</button>
                                <button>🗑️</button>
                            </div>
                        </div>

                        <div>
                            <div></div>
                            <div>
                                <div>Parmesan</div>
                                <div>
                                    <span>Produits laitiers</span>
                                    <span>200g • ~6</span>
                                </div>
                            </div>

                            <div>
                                <button>✏️</button>
                                <button>🗑️</button>
                            </div>
                        </div>

                        <div>
                            <div></div>
                            <div>
                                <div>Pignons de pin</div>
                                <div>
                                    <span>Épicerie</span>
                                    <span>100g • ~8$</span>
                                </div>
                            </div>

                            <div>
                                <button>✏️</button>
                                <button>🗑️</button>
                            </div>
                        </div>
                    </div>
                </section>

                <aside>
                    <div>
                        <h3>📊 Résumé</h3>
                        <div>
                            <div>
                                <span>Total d articles</span>
                                <span>12</span>
                            </div>

                            <div>
                                <span>Article coches</span>
                                <span>7</span>
                            </div>

                            <div>
                                <span>Budget estime</span>
                                <span>45$</span>
                            </div>

                            <div>
                                <span>Temps estime</span>
                                <span>25 minutes</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    )
}

export default page