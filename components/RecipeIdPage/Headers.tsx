import Buttons from './Buttons';
import { styles } from './styles';

const Header = () => {
    return (
        <header className='bg-linear-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] mb-8'>
            <div className='relative h-[400px] bg-linear-to-br from-[#3b82f6] to-[#64748b] flex justify-center items-center text-[8rem] text-white max-md:h-[250px] max-md:text-[4rem]'>
                🥗
                <span className='absolute top-6 right-6 bg-[rgba(76,89,175,0.9)] text-white px-4 py-2 rounded-[20px] text-[0.9rem] font-bold '>Facile</span>
                <span className='absolute bottom-6 left-6 bg-black/80 text-white px-4 py-2 rounded-[20px] text-[0.9rem] flex items-center gap-2'>15 min</span>
            </div>

            <div className='p-8 max-sm:p-6'>
                <h1 className='text-[2.5rem] text-[#3b82f6] mb-4 font-bold max-md:text-[2rem]'>Salade Mediterraneenne</h1>
                <p className='text-[1.1rem] text-[#b0b0b0] mb-8 leading-[1.7]'>Une salade fraîche et colorée aux saveurs méditerranéennes, parfaite pour l été.
                    Cette recette combine les meilleurs ingrédients de la cuisine méditerranéenne pour
                    un plat sain, savoureux et rafraîchissant qui vous transportera directement sur les
                    côtes ensoleillées de la Méditerranée.
                </p>

                <div className='flex gap-[0.7rem] mb-8 flex-wrap'>
                    <span className='bg-[#404040] text-[#b0b0b0] px-4 py-2 rounded-[15px] text-[0.9rem] font-medium'>Vegetarien</span>
                    <span className='bg-[#404040] text-[#b0b0b0] px-4 py-2 rounded-[15px] text-[0.9rem] font-medium'>Healthy</span>
                    <span className='bg-[#404040] text-[#b0b0b0] px-4 py-2 rounded-[15px] text-[0.9rem] font-medium'>Rapide</span>
                    <span className='bg-[#404040] text-[#b0b0b0] px-4 py-2 rounded-[15px] text-[0.9rem] font-medium'>Sans cussion</span>
                </div>

                <div className='grid [grid-template-columns:1fr_1fr_1fr_1fr] gap-4 mb-8 max-lg:grid-cols-2 max-sm:grid-cols-1'>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>4.8</span>
                        <span className={styles.statLabel}>Note</span>
                    </div>

                    <div className={styles.statItem}>
                        <span className={styles.statValue}>2</span>
                        <span className={styles.statLabel}>Portions</span>
                    </div>

                    <div className={styles.statItem}>
                        <span className={styles.statValue}>285</span>
                        <span className={styles.statLabel}>Calories</span>
                    </div>

                    <div className={styles.statItem}>
                        <span className={styles.statValue}>15 min</span>
                        <span className={styles.statLabel}>Preparation</span>
                    </div>
                </div>

                <Buttons />
            </div>
        </header>
    )
}

export default Header;