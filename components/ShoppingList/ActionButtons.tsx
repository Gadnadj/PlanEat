import { styles } from './styles'

interface ActionButtonProps {
    onDeleteAll: () => void;
    onDeleteCompleted: () => void;
    onPrint: () => void;
    completedCount: number;
}

const ActionButton = ({ onDeleteAll, onDeleteCompleted, onPrint, completedCount }: ActionButtonProps) => {
    return (
        <div className='flex gap-4 max-md:justify-center max-md:flex-wrap max-sm:flex-col max-sm:w-full'>
            {/* <button className={styles.actionButton}>📱 Share</button> */}
            <button 
                className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
                onClick={onPrint}
            >
                📄 Print
            </button>
            {completedCount > 0 && (
                <button 
                    className={`${styles.actionButton} ${styles.actionButtonWarning}`}
                    onClick={onDeleteCompleted}
                    title={`Supprimer ${completedCount} ingrédient(s) coché(s)`}
                >
                    ✅ Supprimer cochés ({completedCount})
                </button>
            )}
            <button 
                className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                onClick={onDeleteAll}
            >
                🗑️ Clear All
            </button>
        </div>
    )
}

export default ActionButton