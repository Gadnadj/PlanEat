export const styles = {
    statItem: 'text-center',
    statValue: 'text-[1.5rem] font-bold text-[#3b82f6]',
    statLabel: 'text-[0.9rem] text-[#b0b0b0]',

    actionButton:
        'bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white border-none py-[0.8rem] px-6 rounded-[10px] cursor-pointer font-bold transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(30,56,59,0.4)] max-sm:w-full',

    actionButtonSecondary:
        'bg-linear-to-br from-[#404040] to-[#2a2a2a] hover:bg-linear-to-br hover:from-[#505050] hover:to-[#3a3a3a]',

    actionButtonDanger:
        'bg-linear-to-br from-[#d32d2d] to-[#b71c1c] hover:bg-linear-to-br hover:from-[#f44336] hover:to-[#d32d2d]',

    categoryButton:
        'bg-[#3a3a3a] text-[#b0b0b0] border-none py-2 px-4 border-[20px] cursor-pointer text-[0.8rem] transition-all duration-300 ease-in-out hover:bg-linear-to-br hover:from-[#3b82f6] hover:to-[#64748b]',

    shoppingItem:
        'bg-[#3a3a3a] rounded-[10px] p-4 flex items-center gap-4 transition-all duration-300 ease-in-out border-l-4 border-l-transparent hover:bg-[$404040] hover:-translate-x-[5px]',

    itemCompleted: 'opacity-60 bg-[#2d2d2d] border-l-4 border-l-[#7cb342]',
    itemCompleteLine: 'line-through',

    itemCheckbox:
        'w-[20px] h-[20px] border-2 border-[#3b82f6] rounded-[50%] cursor-pointer flex items-center justify-center transition-all duration-300 ease-in-out',

    checkboxChecked: 'bg-[#3b82f6]',
    checkmark: 'text-white font-bold text-[0.8rem]',

    itemContent: 'flex-1 flex flex-col',
    itemName: 'font-bold text-[#e0e0e0] mb-[0.2rem]',
    itemDetails:
        'text-[0.8rem] text-[#b0b0b0] flex gap-4 max-md:flex-col max-md:gap-2',
    itemCategory:
        'bg-[rgba(124, 179, 66, 0.2)] text-[#3b82f6] py-[0.1rem] px-2 rounded-[10px] text-[0.7rem]',
    itemActions: 'flex gap-2',
    itemActionButton:
        'bg-[#505050] text-white border-none py-[0.4rem] px-[0.6rem] rounded-[5px] cursor-pointer text-[0.7rem] transition-all duration-300 ease-in-out hover:bg-[#3b82f6]',
    itemDeleteButton: 'hover:bg-[#d32f2f]',

    summaryStat:
        'flex justify-between items-center py-2 px-0 border-b-1 border-b-[#404040]',
    summaryLabel: 'text-[#b0b0b0] text-[0.9rem]',
    summaryValue: 'text-[#3b82f6] font-bold',
};
