import { styles } from "./styles";

const Buttons = () => {
    return (
        <div className='flex gap-4 max-md:flex-col '>
            <button className={`${styles.buttonAction} ${styles.buttonPrimary}`}>Ajouter au planing</button>
            <button className={`${styles.buttonAction} ${styles.buttonSecondary}`}>❤️ Favoris</button>
            <button className={`${styles.buttonAction} ${styles.buttonSecondary}`}>📤 Partager</button>
        </div>
    )
}

export default Buttons;