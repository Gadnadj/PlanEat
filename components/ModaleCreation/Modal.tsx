import React from 'react'

type Props = {
    onClose: () => void;
}

const Modal = ({ onClose }: Props) => {

    const formSection = 'mb-8';
    const formRow = 'flex gap-4 mb-4 max-md:flex-col';
    const formGroup = 'flex-1';
    const formLabel = 'block mb-2 text-[#b0b0b0] font-medium';
    const formInput = 'w-full px-4 py-[0.8rem] bg-[#3a3a3a] border-2 border-solid border-[#404040] rounded-[10px] text-[#e0e0e0] text-[1rem] transition-colors duration-300 ease-in-out focus:outline-none focus:border-[#3b82f6]';
    const formSelect = formInput;
    const formTextArea = formInput;

    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black/90 flex items-center justify-center z-[1001] p-8 max-md:p-4'>
            <div className='bg-linear-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-[20px] w-full max-w-[800px] max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-[#404040] relative'>
                
                {/* Header */}
                <div className='bg-linear-to-br from-[#3b82f6] to-[#64748b] px-8 py-6 rounded-t-[20px] text-white flex justify-between items-center'>
                    <h2 className='text-[1.5rem] font-bold m-0'>🍳 Créer une nouvelle recette</h2>
                    <button 
                        onClick={onClose} 
                        className='bg-none border-none text-white text-[1.5rem] cursor-pointer p-2 rounded-full transition-colors duration-300 ease-in-out hover:bg-[rgba(255,255,255,0.2)]'>
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className='p-8 text-[#e0e0e0] max-md:p-6'>
                    <form>
                        {/* Infos générales */}
                        <div className={formSection}>
                            <h3 className='text-[#3b82f6] mb-4 text-[1.2rem] flex items-center gap-2'>📝 Informations générales</h3>
                            <div className={formRow}>
                                <div className={formGroup}>
                                    <label className={formLabel}>Nom de la recette *</label>
                                    <input className={formInput} type="text" placeholder='Ex: Salade César' />
                                </div>
                                <div className={formGroup}>
                                    <label className={formLabel}>Catégorie</label>
                                    <select className={formSelect}>
                                        <option>Entrée</option>
                                        <option>Plat principal</option>
                                        <option>Dessert</option>
                                        <option>Boisson</option>
                                        <option>Accompagnement</option>
                                    </select>
                                </div>
                            </div>

                            <div className={formRow}>
                                <div className={formGroup}>
                                    <label className={formLabel}>Temps de préparation (min)</label>
                                    <input className={formInput} type="number" placeholder='15' min="1" />
                                </div>
                                <div className={formGroup}>
                                    <label className={formLabel}>Temps de cuisson (min)</label>
                                    <input className={formInput} type="number" placeholder='10' min="1" />
                                </div>
                                <div className={formGroup}>
                                    <label className={formLabel}>Nombre de portions</label>
                                    <input className={formInput} type="number" placeholder='4' min="1" />
                                </div>
                            </div>

                            <div className={formRow}>
                                <div className={formGroup}>
                                    <label className={formLabel}>Difficulté</label>
                                    <select className={formSelect}>
                                        <option>Facile</option>
                                        <option>Moyen</option>
                                        <option>Difficile</option>
                                    </select>
                                </div>
                                <div className={formGroup}>
                                    <label className={formLabel}>Calories par portion</label>
                                    <input className={formInput} type="number" placeholder='350' min='0' />
                                </div>
                            </div>

                            <div className={formGroup}>
                                <label className={formLabel}>Description</label>
                                <textarea className={formTextArea} placeholder='Décrivez votre recette en quelques mots...'></textarea>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className={formSection}>
                            <h3 className='text-[#3b82f6] mb-4 text-[1.2rem]'>🏷️ Tags</h3>
                            <div className={formGroup}>
                                <label className={formLabel}>Ajoutez des tags (appuyez sur Entrée pour valider)</label>
                                <div className='flex flex-wrap gap-2 px-4 py-2 bg-[#3a3a3a] border-2 border-[#404040] rounded-[10px] min-h-[40px] cursor-text focus-within:border-[#3b82f6]'>
                                    <input className='bg-transparent flex-1 outline-none text-[#e0e0e0]' type="text" placeholder='Tapez un tag...' />
                                </div>
                            </div>
                        </div>

                        {/* Ingrédients */}
                        <div className={formSection}>
                            <h3 className='text-[#3b82f6] mb-4 text-[1.2rem] flex items-center gap-2'>🥕 Ingrédients</h3>
                            <div className={formRow}>
                                <input className={formInput} type="text" placeholder='Nom de l’ingrédient' />
                                <input className={formInput} type="text" placeholder='Quantité' />
                            </div>
                            <button type="button" className='bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white px-6 py-[0.8rem] rounded-[10px] font-bold mt-4 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(124,179,66,0.3)]'>
                                + Ajouter l’ingrédient
                            </button>
                            <div className='bg-[#3a3a3a] border-2 border-[#404040] rounded-[10px] p-4 max-h-[200px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mt-4'></div>
                        </div>

                        {/* Étapes */}
                        <div className={formSection}>
                            <h3 className='text-[#3b82f6] mb-4 text-[1.2rem] flex items-center gap-2'>📋 Étapes de préparation</h3>
                            <textarea className={formTextArea} placeholder='Décrivez l’étape de préparation...'></textarea>
                            <button type="button" className='bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white px-6 py-[0.8rem] rounded-[10px] font-bold mt-4 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(124,179,66,0.3)] '>
                                + Ajouter l’étape
                            </button>
                            <div className='bg-[#3a3a3a] border-2 border-[#404040] rounded-[10px] p-4 max-h-[300px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mt-4'></div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className='px-8 py-6 border-t border-[#404040] flex gap-4 justify-end max-md:flex-col max-md:gap-2'>
                    <button 
                        onClick={onClose} 
                        className='bg-[#404040] text-[#e0e0e0] px-8 py-4 rounded-[10px] font-bold hover:bg-[#505050] transition-colors max-md:w-full'>
                        Annuler
                    </button>
                    <button className='bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white px-8 py-4 rounded-[10px] font-bold transition-all duration-300 hover:-translate-y-[2px] hover:bg-gradient-to-br hover:from-[#3b82f6] hover:to-[#1e293b] max-md:w-full'>
                        💾 Sauvegarder la recette
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal;
