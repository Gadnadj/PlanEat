import { styles } from './styles'

interface ActionButtonProps {
    onDeleteAll: () => void;
    onPrint: () => void;
}

const ActionButton = ({ onDeleteAll, onPrint }: ActionButtonProps) => {
    return (
        <div className='flex gap-4 max-md:justify-center max-md:flex-wrap max-sm:flex-col max-sm:w-full'>
            <button className={styles.actionButton}>📱 Partager</button>
            <button 
                className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
                onClick={onPrint}
            >
                📄 Imprimer
            </button>
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