import { styles } from './styles'

const Summary = () => {
    return (
        <div className='bg-[#2a2a2a] rounded-[15px] p-6 shadow-[0_4px_15px_rgba(0.0.0.0.2)]'>
            <h3 className='text-[#3b82f6] text-[1.2rem] font-bold mb-4'>📊 Résumé</h3>
            <div className='flex flex-col gap-4'>
                <div className={styles.summaryStat}>
                    <span className={styles.summaryLabel}>Total d articles</span>
                    <span className={styles.summaryValue}>12</span>
                </div>

                <div className={styles.summaryStat}>
                    <span className={styles.summaryLabel}>Article coches</span>
                    <span className={styles.summaryValue}>7</span>
                </div>

                <div className={styles.summaryStat}>
                    <span className={styles.summaryLabel}>Budget estime</span>
                    <span className={styles.summaryValue}>45$</span>
                </div>

                <div className={`${styles.summaryStat} border-none`}>
                    <span className={styles.summaryLabel}>Temps estime</span>
                    <span className={styles.summaryValue}>25 minutes</span>
                </div>
            </div>
        </div>
    )
}

export default Summary