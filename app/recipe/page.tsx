import React from 'react'

const page = () => {

    const label = 'text-[0.8rem] text-[#b0b0b0] font-medium';
    const select = 'px-4 py-3 bg-[#3a3a3a] border border-[#404040] rounded-lg text-[#e0e0e0] cursor-pointer transition-colors duration-300 ease-in-out focus:outline-none focus:border-[#3b82f6]'
    const filterTag = 'bg-[#3b82f6] text-white py-2 px-4 rounded-[20px] text-sm cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#64748b]'
    // const activeCLass = 'bg-[#64748b] shadow-[0_2px_8px_rgba(124,179,66,0.3)]';
    const recipeTag = 'bg-gradient-to-br from-[#3a3a3a] to-[#2d2d2d] rounded-[15px] overflow-hidden transition-all duration-300 ease-in-out border border-[#404040] relative hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:border-[#3b82f6]';
    const recipeImage = 'w-full h-[220px] bg-gradient-to-br from-[#3b82f6] to-[#64748b] flex items-center justify-center text-6xl text-white relative'
    const recipeDifficulty = 'absolute top-4 right-4 bg-[rgba(0,0,0,0.7)] text-white py-[0.3rem] px-[0.8rem] rounded-[15px] text-[0.8rem] font-bold';
    const recipeTime = 'absolute bottom-4 left-4 bg-[rgba(0,0,0,0.7)] text-white py-[0.3rem] px-[0.8rem] rounded-[15px] text-[0.8rem] flex items-center gap-[0.3rem]';
    const recipeInfo = 'p-6';
    const recipeTitle = 'text-[#3b82f6] mb-[0.8rem] text-[1.4rem] font-bold';
    const recipeDescription = 'text-[#b0b0b0] mb-4 text-base leading-relaxed';
    const recipeTags = 'flex gap-2 mb-[1.5rem] wrap';
    const recipeTagss = 'bg-[#404040] text-[#e0e0e0] py-[0.3rem] px-[0.8rem] rounded-[12px] text-[0.8rem]'
    const recipeStats = 'flex justify-between items-center mb-6 p-4 bg-[rgba(30,41,59,0.4)] rounded-[8px]';
    const statItem = 'text-center';
    const statValue = 'font-bold text-[#3b82f6] text-[1.1rem]';
    const statLabel = 'text-[0.8rem] text-[#b0b0b0]';
    const recipeAction = 'flex gap-2 max-md:flex-col';

    return (
        <div>
            <header className='max-w-[1400px] mx-auto p-8 text-center max-sm:pl-4 max-sm:pr-4'>
                <h1 className='text-[2.5rem] text-[#3b82f6] mb-4 max-md:text-[2rem] font-bold'>
                    🍳 Decouvrez nos recettes
                </h1>

                <p className='text-lg text-[#b0b0b0] max-w-[600px] mx-auto'>
                    Plus de 1000 recettes créées par notre IA et validées par nos chefs. Trouvez l inspiration pour vos prochains repas.
                </p>
            </header>

            {/* Recherche et Filtrer */}
            <section className='max-w-[1400px] mx-auto px-8 pb-8 bg-[#2a2a2a] rounded-[15px] mb-8 shadow-[0_4px_15px_rgba(0,0,0,0.2)] max-sm:pl-4 max-sm:pr-4'>
                <div className='py-8 pt-8 pb-4 flex gap-4 items-center max-md:flex-col'>
                    <input className='flex-1 px-6 py-4 bg-[#3a3a3a] border-2 border-[#404040] rounded-[10px] text-[#e0e0e0] text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-[#3b82f6]' type="text" placeholder='Rechercher une recette, un ingredient...' />
                    <button className='bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white border-none px-8 py-4 rounded-[10px] font-bold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(124,179,66,0.3)]'>🔍 Rechercher</button>
                </div>

                <div className='flex gap-4 flex-wrap pb-4 max-md:flex-col max-md:gap-4'>
                    <div className='flex flex-col gap-2 max-md:w-full'>
                        <label className={label}>Categorie</label>
                        <select className={select}>
                            <option>Toutes</option>
                            <option>Entrees</option>
                            <option>Plats principaux</option>
                            <option>Desserts</option>
                            <option>Boissons</option>
                        </select>
                    </div>

                    <div className='flex flex-col gap-2 max-md:w-full'>
                        <label className={label}>Temps de preparation</label>
                        <select className={select}>
                            <option>Tous</option>
                            <option>Moins de 15 min</option>
                            <option>15-30 min</option>
                            <option>30-60 min</option>
                            <option>Plus de 1 heure</option>
                        </select>
                    </div>

                    <div className='flex flex-col gap-2 max-md:w-full'>
                        <label className={label}>Difficulte</label>
                        <select className={select}>
                            <option>Toutes</option>
                            <option>Facile</option>
                            <option>Moyen</option>
                            <option>Difficile</option>
                        </select>
                    </div>

                    <div className='flex flex-col gap-2 max-md:w-full'>
                        <label className={label}>Régime</label>
                        <select className={select}>
                            <option>Tous</option>
                            <option>Végétarien</option>
                            <option>Vegan</option>
                            <option>Sans gluten</option>
                            <option>Cétogène</option>
                        </select>
                    </div>
                </div>

                <div className='flex gap-2 flex-wrap mt-4 max-sm:justify-center'>
                    <span className={filterTag}>Populaire</span>
                    <span className={filterTag}>Rapide</span>
                    <span className={filterTag}>Healthy</span>
                    <span className={filterTag}>Economique</span>
                    <span className={filterTag}>Famililial</span>
                    <span className={filterTag}>Gourmet</span>
                </div>
            </section>

            {/* Grille de recettes */}
            <main className='max-w-[1400px] mx-auto pt-0 px-8 pb-8'>
                <div className='flex justify-between items-center mb-8 py-4 border-b border-[#404040] max-md:flex-col max-md:items-start max-md:gap-4'>
                    <span className='text-[#b0b0b0] text-base'>248 recettes trouvees</span>
                    <div className='flex gap-4 items-center'>
                        <span className='text-[#b0b0b0] text-base'>Trier par:</span>
                        <select className={select}>
                            <option>Popularite</option>
                            <option>Date d ajout</option>
                            <option>Temps de preparation</option>
                            <option>Difficulte</option>
                            <option>Note</option>
                        </select>
                    </div>
                </div>

                <div className='grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] max-md:grid-cols-1  max-sm:pl-4 max-sm:pr-4'>
                    {/* Recette 1 */}
                    <article className={recipeTag}>
                        <div className={recipeImage}>
                            🥗
                            <span className={recipeDifficulty}>Facile</span>
                            <span className={recipeTime}>⏱️ 15 min</span>
                        </div>
                        <div className={recipeInfo}>
                            <h3 className={recipeTitle}>Salade Mediteraneenne</h3>
                            <p className={recipeDescription}>Une salade fraîche et colorée aux saveurs méditerranéennes, parfaite pour l été.</p>
                            <div className={recipeTags}>
                                <span className={recipeTagss}>Vegetarien</span>
                                <span className={recipeTagss}>Healthy</span>
                                <span className={recipeTagss}>Rapide</span>
                            </div>
                            <div className={recipeStats}>
                                <div className={statItem}>
                                    <div className={statValue}>4.8</div>
                                    <div className={statLabel}>Note</div>
                                </div>
                                <div className={statItem}>
                                    <div className={statValue}>2</div>
                                    <div className={statLabel}>Portions</div>
                                </div>
                                <div className={statItem}>
                                    <div className={statValue}>285</div>
                                    <div className={statLabel}>Calories</div>
                                </div>
                            </div>

                            <div className={recipeAction}>
                                <button className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:to-blue-700 bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white'>Voir la recette</button>
                                <button className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#505050] bg-[#404040] text-[#e0e0e0]'>+ Liste</button>
                            </div>
                        </div>
                    </article>

                    {/* Recette 1 */}
                    <article className={recipeTag}>
                        <div className={recipeImage}>
                            🥗
                            <span className={recipeDifficulty}>Facile</span>
                            <span className={recipeTime}>⏱️ 15 min</span>
                        </div>
                        <div className={recipeInfo}>
                            <h3 className={recipeTitle}>Salade Mediteraneenne</h3>
                            <p className={recipeDescription}>Une salade fraîche et colorée aux saveurs méditerranéennes, parfaite pour l été.</p>
                            <div className={recipeTags}>
                                <span className={recipeTagss}>Vegetarien</span>
                                <span className={recipeTagss}>Healthy</span>
                                <span className={recipeTagss}>Rapide</span>
                            </div>
                            <div className={recipeStats}>
                                <div className={statItem}>
                                    <div className={statValue}>4.8</div>
                                    <div className={statLabel}>Note</div>
                                </div>
                                <div className={statItem}>
                                    <div className={statValue}>2</div>
                                    <div className={statLabel}>Portions</div>
                                </div>
                                <div className={statItem}>
                                    <div className={statValue}>285</div>
                                    <div className={statLabel}>Calories</div>
                                </div>
                            </div>

                            <div className={recipeAction}>
                                <button className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:to-blue-700 bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white'>Voir la recette</button>
                                <button className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#505050] bg-[#404040] text-[#e0e0e0]'>+ Liste</button>
                            </div>
                        </div>
                    </article>

                    {/* Recette 1 */}
                    <article className={recipeTag}>
                        <div className={recipeImage}>
                            🥗
                            <span className={recipeDifficulty}>Facile</span>
                            <span className={recipeTime}>⏱️ 15 min</span>
                        </div>
                        <div className={recipeInfo}>
                            <h3 className={recipeTitle}>Salade Mediteraneenne</h3>
                            <p className={recipeDescription}>Une salade fraîche et colorée aux saveurs méditerranéennes, parfaite pour l été.</p>
                            <div className={recipeTags}>
                                <span className={recipeTagss}>Vegetarien</span>
                                <span className={recipeTagss}>Healthy</span>
                                <span className={recipeTagss}>Rapide</span>
                            </div>
                            <div className={recipeStats}>
                                <div className={statItem}>
                                    <div className={statValue}>4.8</div>
                                    <div className={statLabel}>Note</div>
                                </div>
                                <div className={statItem}>
                                    <div className={statValue}>2</div>
                                    <div className={statLabel}>Portions</div>
                                </div>
                                <div className={statItem}>
                                    <div className={statValue}>285</div>
                                    <div className={statLabel}>Calories</div>
                                </div>
                            </div>

                            <div className={recipeAction}>
                                <button className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:to-blue-700 bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white'>Voir la recette</button>
                                <button className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#505050] bg-[#404040] text-[#e0e0e0]'>+ Liste</button>
                            </div>
                        </div>
                    </article>

                    {/* Recette 1 */}
                    <article className={recipeTag}>
                        <div className={recipeImage}>
                            🥗
                            <span className={recipeDifficulty}>Facile</span>
                            <span className={recipeTime}>⏱️ 15 min</span>
                        </div>
                        <div className={recipeInfo}>
                            <h3 className={recipeTitle}>Salade Mediteraneenne</h3>
                            <p className={recipeDescription}>Une salade fraîche et colorée aux saveurs méditerranéennes, parfaite pour l été.</p>
                            <div className={recipeTags}>
                                <span className={recipeTagss}>Vegetarien</span>
                                <span className={recipeTagss}>Healthy</span>
                                <span className={recipeTagss}>Rapide</span>
                            </div>
                            <div className={recipeStats}>
                                <div className={statItem}>
                                    <div className={statValue}>4.8</div>
                                    <div className={statLabel}>Note</div>
                                </div>
                                <div className={statItem}>
                                    <div className={statValue}>2</div>
                                    <div className={statLabel}>Portions</div>
                                </div>
                                <div className={statItem}>
                                    <div className={statValue}>285</div>
                                    <div className={statLabel}>Calories</div>
                                </div>
                            </div>

                            <div className={recipeAction}>
                                <button className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:to-blue-700 bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white'>Voir la recette</button>
                                <button className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#505050] bg-[#404040] text-[#e0e0e0]'>+ Liste</button>
                            </div>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    )
}

export default page