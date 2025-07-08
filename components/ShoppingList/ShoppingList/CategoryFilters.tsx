import { styles } from '../styles'

const CategoryFilters = () => {
    return (
        <div className='flex gap-2 mb-8 flex-wrap max-md:justify-center'>
            <button className={styles.categoryButton}>Tout</button>
            <button className={styles.categoryButton}>🥕 Fruits & Légumes</button>
            <button className={styles.categoryButton}>🥩 Viandes</button>
            <button className={styles.categoryButton}>🥛 Produits laitiers</button>
            <button className={styles.categoryButton}>🏪 Épiceri</button>
            <button className={styles.categoryButton}>📦 Autres</button>
        </div>
    )
}

export default CategoryFilters