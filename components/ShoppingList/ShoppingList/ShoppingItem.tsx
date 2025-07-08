import { styles } from '../styles'

const ShoppingItem = () => {
    return (
        <div className={styles.shoppingItem}>
            <div className={styles.itemCheckbox}>
            </div>
            <div className={styles.itemContent}>
                <div className={styles.itemName}>Tomates cerises</div>
                <div className={styles.itemDetails}>
                    <span className={styles.itemCategory}>Fruits & Legumes</span>
                    <span>500g • ~3$</span>
                </div>
            </div>

            <div className={styles.itemActions}>
                <button className={styles.itemActionButton}>✏️</button>
                <button className={`${styles.itemActionButton} ${styles.itemDeleteButton}`}>🗑️</button>
            </div>
        </div>
    )
}

export default ShoppingItem