"use client"
import { useRouter } from 'next/navigation'
import { styles } from "./styles";
const RecipeCard = () => {

    const router = useRouter();

    return (
        <div className='grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] max-md:grid-cols-1  max-sm:pl-4 max-sm:pr-4'>
            {/* Recette 1 */}
            <article className={styles.recipeTag} >
                <div className={styles.recipeImage}>
                    🥗
                    <span className={styles.recipeDifficulty}>Facile</span>
                    <span className={styles.recipeTime}>⏱️ 15 min</span>
                </div>
                <div className={styles.recipeInfo}>
                    <h3 className={styles.recipeTitle}>Salade Mediteraneenne</h3>
                    <p className={styles.recipeDescription}>Une salade fraîche et colorée aux saveurs méditerranéennes, parfaite pour l été.</p>
                    <div className={styles.recipeTags}>
                        <span className={styles.recipeTagss}>Vegetarien</span>
                        <span className={styles.recipeTagss}>Healthy</span>
                        <span className={styles.recipeTagss}>Rapide</span>
                    </div>
                    <div className={styles.recipeStats}>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>4.8</div>
                            <div className={styles.statLabel}>Note</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>2</div>
                            <div className={styles.statLabel}>Portions</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>285</div>
                            <div className={styles.statLabel}>Calories</div>
                        </div>
                    </div>

                    <div className={styles.recipeAction}>
                        <button onClick={() => router.push('/recipe/555')} className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#3b82f6] to-[#64748b] hover:to-blue-700 text-white'>Voir la recette</button>
                        <button className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#505050] bg-[#404040] text-[#e0e0e0]'>+ Liste</button>
                    </div>
                </div>
            </article >
        </div >
    )

}

export default RecipeCard;