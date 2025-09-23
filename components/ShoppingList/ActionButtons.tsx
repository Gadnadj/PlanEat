import { styles } from './styles'

interface ActionButtonProps {
    onDeleteAll: () => void;
}

const ActionButton = ({ onDeleteAll }: ActionButtonProps) => {
    return (
        <div className='flex gap-4 max-md:justify-center max-md:flex-wrap max-sm:flex-col max-sm:w-full'>
            <button className={styles.actionButton}>📱 Partager</button>
            <button className={`${styles.actionButton} ${styles.actionButtonSecondary}`}>📄 Imprimer</button>
            <button 
                className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                onClick={onDeleteAll}
            >
                🗑️ Vider tout
            </button>
        </div>
    )
}

export default ActionButton