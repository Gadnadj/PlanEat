import React from 'react'

const page = () => {
    return (
        <div>
            <header>
                <h1>
                    Decouvrez nos recettes
                </h1>

                <p>
                    Plus de 1000 recettes créées par notre IA et validées par nos chefs. Trouvez l inspiration pour vos prochains repas.
                </p>
            </header>

            {/* Recherche et Filtrer */}
            <section>
                <div>
                    <input type="text" placeholder='Rechercher une recette, un ingredient...' />
                    <button>🔍 Rechercher</button>
                </div>

                <div>
                    <div>
                        <label>Categorie</label>
                        <select>
                            <option>Toutes</option>
                            <option>Entrees</option>
                            <option>Plats principaux</option>
                            <option>Desserts</option>
                            <option>Boissons</option>
                        </select>
                    </div>

                    <div>
                        <label>Temps de preparation</label>
                        <select>
                            <option>Tous</option>
                            <option>Moins de 15 min</option>
                            <option>15-30 min</option>
                            <option>30-60 min</option>
                            <option>Plus de 1 heure</option>
                        </select>
                    </div>

                    <div>
                        <label>Difficulte</label>
                        <select>
                            <option>Toutes</option>
                            <option>Facile</option>
                            <option>Moyen</option>
                            <option>Difficile</option>
                        </select>
                    </div>

                    <div>
                        <label>Régime</label>
                        <select>
                            <option>Tous</option>
                            <option>Végétarien</option>
                            <option>Vegan</option>
                            <option>Sans gluten</option>
                            <option>Cétogène</option>
                        </select>
                    </div>
                </div>

                <div>
                    <span>Populaire</span>
                    <span>Rapide</span>
                    <span>Healthy</span>
                    <span>Economique</span>
                    <span>Famililial</span>
                    <span>Gourmet</span>
                </div>
            </section>

            {/* Grille de recettes */}
            <main>
                <div>
                    <span>248 recettes trouvees</span>
                    <div>
                        <span>Trier par:</span>
                        <select>
                            <option>Popularite</option>
                            <option>Date d ajout</option>
                            <option>Temps de preparation</option>
                            <option>Difficulte</option>
                            <option>Note</option>
                        </select>
                    </div>
                </div>

                <div>
                    {/* Recette 1 */}
                    <article>
                        <div>
                            🥗
                            <span>Facile</span>
                            <span>⏱️ 15 min</span>
                        </div>
                        <div>
                            <h3>Salade Mediteraneenne</h3>
                            <p>Une salade fraîche et colorée aux saveurs méditerranéennes, parfaite pour l été.</p>
                            <div>
                                <span>Vegetarien</span>
                                <span>Healthy</span>
                                <span>Rapide</span>
                            </div>
                            <div>
                                <div>
                                    <div>4.8</div>
                                    <div>Note</div>
                                </div>
                                <div>
                                    <div>2</div>
                                    <div>Portions</div>
                                </div>
                                <div>
                                    <div>285</div>
                                    <div>Calories</div>
                                </div>
                            </div>

                            <div>
                                <button>Voir la recette</button>
                                <button>+ Liste</button>
                            </div>
                        </div>
                    </article>

                    {/* Recette 2 */}
                    <article>
                        <div>
                            🥗
                            <span>Facile</span>
                            <span>⏱️ 15 min</span>
                        </div>
                        <div>
                            <h3>Salade Mediteraneenne</h3>
                            <p>Une salade fraîche et colorée aux saveurs méditerranéennes, parfaite pour l été.</p>
                            <div>
                                <span>Vegetarien</span>
                                <span>Healthy</span>
                                <span>Rapide</span>
                            </div>
                            <div>
                                <div>
                                    <div>4.8</div>
                                    <div>Note</div>
                                </div>
                                <div>
                                    <div>2</div>
                                    <div>Portions</div>
                                </div>
                                <div>
                                    <div>285</div>
                                    <div>Calories</div>
                                </div>
                            </div>

                            <div>
                                <button>Voir la recette</button>
                                <button>+ Liste</button>
                            </div>
                        </div>
                    </article>

                    {/* Recette 3 */}
                    <article>
                        <div>
                            🥗
                            <span>Facile</span>
                            <span>⏱️ 15 min</span>
                        </div>
                        <div>
                            <h3>Salade Mediteraneenne</h3>
                            <p>Une salade fraîche et colorée aux saveurs méditerranéennes, parfaite pour l été.</p>
                            <div>
                                <span>Vegetarien</span>
                                <span>Healthy</span>
                                <span>Rapide</span>
                            </div>
                            <div>
                                <div>
                                    <div>4.8</div>
                                    <div>Note</div>
                                </div>
                                <div>
                                    <div>2</div>
                                    <div>Portions</div>
                                </div>
                                <div>
                                    <div>285</div>
                                    <div>Calories</div>
                                </div>
                            </div>

                            <div>
                                <button>Voir la recette</button>
                                <button>+ Liste</button>
                            </div>
                        </div>
                    </article>

                    {/* Recette 4 */}
                    <article>
                        <div>
                            🥗
                            <span>Facile</span>
                            <span>⏱️ 15 min</span>
                        </div>
                        <div>
                            <h3>Salade Mediteraneenne</h3>
                            <p>Une salade fraîche et colorée aux saveurs méditerranéennes, parfaite pour l été.</p>
                            <div>
                                <span>Vegetarien</span>
                                <span>Healthy</span>
                                <span>Rapide</span>
                            </div>
                            <div>
                                <div>
                                    <div>4.8</div>
                                    <div>Note</div>
                                </div>
                                <div>
                                    <div>2</div>
                                    <div>Portions</div>
                                </div>
                                <div>
                                    <div>285</div>
                                    <div>Calories</div>
                                </div>
                            </div>

                            <div>
                                <button>Voir la recette</button>
                                <button>+ Liste</button>
                            </div>
                        </div>
                    </article>

                </div>
            </main>
        </div>
    )
}

export default page