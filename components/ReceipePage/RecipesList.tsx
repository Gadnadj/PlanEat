import RecipeCard from "./RecipeCard";
import { styles } from "./styles";

const RecipesList = () => {
    return (
        <main className='max-w-[1400px] mx-auto pt-0 px-8 pb-8'>
            <div className='flex justify-between items-center mb-8 py-4 border-b border-[#404040] max-md:flex-col max-md:items-start max-md:gap-4'>
                <span className='text-[#b0b0b0] text-base'>248 recettes trouvees</span>
                <div className='flex gap-4 items-center'>
                    <span className='text-[#b0b0b0] text-base'>Trier par:</span>
                    <select className={styles.select}>
                        <option>Popularite</option>
                        <option>Date d ajout</option>
                        <option>Temps de preparation</option>
                        <option>Difficulte</option>
                        <option>Note</option>
                    </select>
                </div>
            </div>

            <div className='grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] max-md:grid-cols-1  max-sm:pl-4 max-sm:pr-4'>
                <RecipeCard />
                <RecipeCard />
                <RecipeCard />
                <RecipeCard />
            </div>
        </main>
    )
}

export default RecipesList;