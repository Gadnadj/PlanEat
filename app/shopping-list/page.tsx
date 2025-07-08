import React from 'react'

const page = () => {
    return (
        <>
            <header>
                <h1>🛒 Liste de courses</h1>
                <p>Organisez vos achats efficacement et ne manquez plus jamais d ingrédients.</p>
            </header>

            <section>
                <div>
                    <div>
                        <div>12</div>
                        <div>Articles</div>
                    </div>

                    <div>
                        <div>7</div>
                        <div>Completes</div>
                    </div>

                    <div>
                        <div>5</div>
                        <div>Restants</div>
                    </div>

                    <div>
                        <div>-45$</div>
                        <div>Budget estime</div>
                    </div>
                </div>

                <div>
                    <button>📱 Partager</button>
                    <button>📄 Imprimer</button>
                    <button>🗑️ Vider</button>
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


                    </div>
                </section>
            </div>
        </>
    )
}

export default page