import { div } from 'framer-motion/client';
import React from 'react'

type Props = {
    onClose: () => void;
}

const Modal = ({ onClose }: Props) => {

    const formSection = 'mb-8';
    const formRow = '';
    const formGroup = '';
    const formLabel = '';
    const formInput = '';
    const formSelect = '';
    const formTextArea = '';


    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black/90 items-center justify-center z-[1001] p-8'>
            <div className='bg-linear-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-[20px] w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-1 border-solid border-[#404040] relative '>
                <div className='bg-linear-to-br from-[#3b82f6] to-[#64748b] px-8 py-6 rounded-t-[20px] text-white flex justify-between items-center'>
                    <h2 className='text-[1.5rem] font-bold m-0'>
                        🍳 Créer une nouvelle recette
                    </h2>
                    <button className='bg-none border-none text-white text-[1.5rem] cursor-pointer p-2 rounded-[50%] transition-colors duration-300 ease-in-out hover:bg-[rgba(255,255,255,0.2)]'>
                        &times;
                    </button>
                </div>

                <div className='p-8 text-[#e0e0e0]'>
                    <form>
                        <div className={formSection}>
                            <h3 className='text-[#7cb342]'>
                                📝 Informations générales
                            </h3>

                            <div className={formRow}>
                                <div className={formGroup}>
                                    <label className={formLabel}>
                                        Nom de la recette *
                                    </label>
                                    <input className={formInput} type="text" placeholder='Ex: Salade Cesare' />
                                </div>

                                <div className={formGroup}>
                                    <label className={formLabel}>
                                        Categorie
                                    </label>
                                    <select className={formSelect}>
                                        <option value="">Entree</option>
                                        <option value="">Plat principal</option>
                                        <option value="">Dessert</option>
                                        <option value="">Boisson</option>
                                        <option value="">Accompagnement</option>
                                    </select>
                                </div>
                            </div>

                            <div className={formRow}>
                                <div className={formGroup}>
                                    <label className={formLabel}>
                                        Temps de preparation (min)
                                    </label>
                                    <input className={formInput} type="number" placeholder='15' min="1" />
                                </div>

                                <div className={formGroup}>
                                    <label className={formLabel}>
                                        Temps de cuisson (min)
                                    </label>
                                    <input className={formInput} type="number" placeholder='10' min="1" />
                                </div>

                                <div className={formGroup}>
                                    <label className={formLabel}>
                                        Nombre de portions
                                    </label>
                                    <input className={formInput} type="number" placeholder='4' min="1" />
                                </div>
                            </div>

                            <div className={formRow}>
                                <div className={formGroup}>
                                    <label className={formLabel}>
                                        Difficulte
                                    </label>
                                    <select className={formSelect}>
                                        <option value="">Facile</option>
                                        <option value="">Moyen</option>
                                        <option value="">Difficile</option>
                                    </select>
                                </div>

                                <div className={formGroup}>
                                    <label className={formLabel}>
                                        Calories par portion
                                    </label>
                                    <input className={formInput} type="number" placeholder='350' min='0' />
                                </div>
                            </div>

                            <div className={formGroup}>
                                <label className={formLabel}>
                                    Description
                                </label>
                                <textarea className={formTextArea} placeholder='Decrivez votre recette en quelques mots...'></textarea>
                            </div>
                        </div>

                        <div className={formSection}>
                            <h3>Tags</h3>
                            <div className={formGroup}>
                                <label className={formLabel}>
                                    Ajoutez des tags (appuyez sur Entree pour valider)
                                </label>
                                <div>
                                    <input type="text" placeholder='Tapez un tag...' />
                                </div>
                            </div>
                        </div>

                        <div className={formSection}>
                            <h3>
                                🥕 Ingrédients
                            </h3>

                            <div className={formRow}>
                                <div className={formGroup}>
                                    <input type="text" placeholder='Nom de l ingredient' />
                                </div>


                                <div className={formGroup}>
                                    <input type="text" placeholder='Quantite' />
                                </div>
                            </div>

                            <button>
                                + Ajouter l ingredient
                            </button>

                            <div>

                            </div>
                        </div>

                        <div className={formSection}>
                            <h3>
                                📋 Étapes de préparation
                            </h3>
                            <div className={formGroup}>
                                <textarea placeholder='Décrivez l étape de préparation...'></textarea>
                            </div>

                            <button>+ Ajouter l etape</button>

                            <div>

                            </div>

                        </div>
                    </form>
                </div>


                <div>
                    <button>Annuler</button>
                    <button>💾 Sauvegarder la recette</button>
                </div>
            </div>
        </div>
    )
}

export default Modal