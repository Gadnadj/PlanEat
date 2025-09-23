import { styles } from './styles'

interface StatSectionProps {
    totalItems: number;
    completedItems: number;
    remainingItems: number;
}

const StatSection = ({ totalItems, completedItems, remainingItems }: StatSectionProps) => {
    const list = [
        { label: 'Items', value: totalItems.toString() },
        { label: 'Completed', value: completedItems.toString() },
        { label: 'Remaining', value: remainingItems.toString() }
    ];

    return (
        <div className='flex gap-8 items-center bg-[#2a2a2a] py-4 px-8 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.2)] max-md:flex-col max-md:gap-4 max-md:text-center'>
            {
                list.map((item, index) => (
                    <div className={styles.statItem} key={index}>
                        <div className={styles.statValue}>{item.value}</div>
                        <div className={styles.statLabel}>{item.label}</div>
                    </div>
                ))
            }
        </div>
    )
}

export default StatSection;
