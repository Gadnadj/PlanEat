import { styles } from './styles'

interface SummaryProps {
    totalItems: number;
    completedItems: number;
}

const Summary = ({ totalItems, completedItems }: SummaryProps) => {
    const remainingItems = totalItems - completedItems;
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return (
        <div className='bg-[#2a2a2a] rounded-[15px] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.2)]'>
            <h3 className='text-[#3b82f6] text-[1.2rem] font-bold mb-4'>📊 Résumé</h3>
            <div className='flex flex-col gap-4'>
                <div className={styles.summaryStat}>
                    <span className={styles.summaryLabel}>Total d&apos;articles</span>
                    <span className={styles.summaryValue}>{totalItems}</span>
                </div>

                <div className={styles.summaryStat}>
                    <span className={styles.summaryLabel}>Articles cochés</span>
                    <span className={styles.summaryValue}>{completedItems}</span>
                </div>

                <div className={styles.summaryStat}>
                    <span className={styles.summaryLabel}>Restants</span>
                    <span className={styles.summaryValue}>{remainingItems}</span>
                </div>

                <div className={styles.summaryStat}>
                    <span className={styles.summaryLabel}>Progression</span>
                    <span className={styles.summaryValue}>{completionPercentage}%</span>
                </div>

                <div className='w-full bg-[#3a3a3a] rounded-full h-2 mb-2'>
                    <div 
                        className='bg-gradient-to-r from-[#3b82f6] to-[#10b981] h-2 rounded-full transition-all duration-300'
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>

            </div>
        </div>
    )
}

export default Summary