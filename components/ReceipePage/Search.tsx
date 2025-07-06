import { styles } from "./styles";

{/* Recherche et Filtrer */ }
const Search = () => {
    return (
        <section className='max-w-[1400px] mx-auto px-8 pb-8 bg-[#2a2a2a] rounded-[15px] mb-8 shadow-[0_4px_15px_rgba(0,0,0,0.2)] max-sm:pl-4 max-sm:pr-4'>
            <div className='py-8 pt-8 pb-4 flex gap-4 items-center max-md:flex-col'>
                <input className='flex-1 px-6 py-4 bg-[#3a3a3a] border-2 border-[#404040] rounded-[10px] text-[#e0e0e0] text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-[#3b82f6]' type="text" placeholder='Rechercher une recette, un ingredient...' />
                <button className='bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white border-none px-8 py-4 rounded-[10px] font-bold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(30,56,59,0.4)]'>🔍 Rechercher</button>
            </div>

            <div className='flex gap-4 flex-wrap pb-4 max-md:flex-col max-md:gap-4'>
                <div className='flex flex-col gap-2 max-md:w-full'>
                    <label className={styles.label}>Categorie</label>
                    <select className={styles.select}>
                        <option>Toutes</option>
                        <option>Entrees</option>
                        <option>Plats principaux</option>
                        <option>Desserts</option>
                        <option>Boissons</option>
                    </select>
                </div>

                <div className='flex flex-col gap-2 max-md:w-full'>
                    <label className={styles.label}>Temps de preparation</label>
                    <select className={styles.select}>
                        <option>Tous</option>
                        <option>Moins de 15 min</option>
                        <option>15-30 min</option>
                        <option>30-60 min</option>
                        <option>Plus de 1 heure</option>
                    </select>
                </div>

                <div className='flex flex-col gap-2 max-md:w-full'>
                    <label className={styles.label}>Difficulte</label>
                    <select className={styles.select}>
                        <option>Toutes</option>
                        <option>Facile</option>
                        <option>Moyen</option>
                        <option>Difficile</option>
                    </select>
                </div>

                <div className='flex flex-col gap-2 max-md:w-full'>
                    <label className={styles.label}>Régime</label>
                    <select className={styles.select}>
                        <option>Tous</option>
                        <option>Végétarien</option>
                        <option>Vegan</option>
                        <option>Sans gluten</option>
                        <option>Cétogène</option>
                    </select>
                </div>
            </div>

            <div className='flex gap-2 flex-wrap mt-4 max-sm:justify-center'>
                <span className={styles.filterTag}>Populaire</span>
                <span className={styles.filterTag}>Rapide</span>
                <span className={styles.filterTag}>Healthy</span>
                <span className={styles.filterTag}>Economique</span>
                <span className={styles.filterTag}>Famililial</span>
                <span className={styles.filterTag}>Gourmet</span>
            </div>
        </section>
    )
}

export default Search;