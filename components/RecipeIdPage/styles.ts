// styles/recipeStyles.js
export const styles = {
    // Stats et métriques
    statItem: 'text-center bg-[rgba(30,41,59,0.4)] p-4 rounded-[12px] border border-[rgba(124,179,66,0.2)]',
    statValue: 'font-bold text-[#3b82f6] text-[1.3rem] block',
    statLabel: 'text-[0.85rem] text-[#b0b0b0] mt-[0.3rem]',

    // Boutons
    buttonAction: 'flex-1 py-4 px-6 border-none font-bold cursor-pointer transition-all duration-300 ease-in-out text-[1rem] hover:-translate-y-(2px) hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]',
    buttonPrimary: 'bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white hover:bg-linear-to-br hover:from-blue-500 hover:to-blue-600',
    buttonSecondary: 'bg-[#404040] text-[#e0e0e0] border-2 border-[#505050] hover:bg-[#505050] hover:border-[#606060]',

    // Ingrédients
    ingredientItem: 'bg-[#3a3a3a] p-4 rounded-[10px] border-l-4 border-[#3b82f6] transition-all duration-300 ease-in-out flex justify-between items-center hover:bg-[#424242] hover:-translate-x-[5px]',
    ingredientName: 'font-medium text-[#e0e0e0]',
    ingredientQuantity: 'text-[#3b82f6] font-bold text-[0.9rem]',

    // Étapes
    stepItem: 'className="step-item group [counter-increment:step-counter] relative mb-4 pl-16 p-6 rounded-xl bg-[#3a3a3a] hover:bg-[#424242] transition-all duration-300 ease-in-out before:content-[counter(step-counter)] before:absolute before:left-4 before:top-1/2 before:transform before:-translate-y-1/2 before:bg-gradient-to-br before:from-[#7cb342] before:to-[#558b2f] before:text-white before:w-8 before:h-8 before:rounded-full before:flex before:items-center before:justify-center before:font-bold before:text-[0.9rem]',
    stepText: 'text-[#e0e0e0] leading-[1.6]',
    stepTime: 'text-[#3b82f6] text-[0.85rem] font-medium mt-2',

    // Nutrition
    nutritionItem: 'bg-[#3a3a3a] p-[0.8rem] rounded-[8px] text-center',
    nutritionValue: 'font-bold text-[#3b82f6] text-[1.1rem]',
    nutritionLabel: 'text-[0.8rem] text-[#b0b0b0] text-[1.1rem]'
};