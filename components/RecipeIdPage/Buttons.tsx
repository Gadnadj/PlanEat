import { styles } from "./styles";

const Buttons = () => {
    return (
        <div className='flex gap-4 max-md:flex-col '>
            <button className={`${styles.buttonAction} ${styles.buttonPrimary}`}>Add to Meal Plan</button>
            <button className={`${styles.buttonAction} ${styles.buttonSecondary}`}>❤️ Favorites</button>
            <button className={`${styles.buttonAction} ${styles.buttonSecondary}`}>📤 Share</button>
        </div>
    )
}

export default Buttons;