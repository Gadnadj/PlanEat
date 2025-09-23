import { styles } from '../styles'

interface ShoppingItemProps {
    item: {
        id: string;
        name: string;
        category: string;
        quantity?: string;
        isCompleted: boolean;
    };
    onToggle: () => void;
    onDelete: () => void;
    onEdit: () => void;
    isEditing: boolean;
    editQuantity: string;
    onEditQuantityChange: (value: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
}

const ShoppingItem = ({ 
    item, 
    onToggle, 
    onDelete, 
    onEdit, 
    isEditing, 
    editQuantity, 
    onEditQuantityChange, 
    onSaveEdit, 
    onCancelEdit 
}: ShoppingItemProps) => {
    return (
        <div className={`${styles.shoppingItem} ${item.isCompleted ? 'opacity-60' : ''}`}>
            <div className={styles.itemCheckbox}>
                <input 
                    type="checkbox" 
                    checked={item.isCompleted}
                    onChange={onToggle}
                    className="w-5 h-5 text-[#3b82f6] bg-[#3a3a3a] border-[#505050] rounded focus:ring-[#3b82f6] focus:ring-2"
                />
            </div>
            <div className={styles.itemContent}>
                <div 
                    className={`${styles.itemName} ${item.isCompleted ? styles.itemCompleteLine : ''}`}
                    style={item.isCompleted ? { textDecoration: 'line-through' } : {}}
                >
                    {item.name}
                </div>
                <div className={styles.itemDetails}>
                    <span className={styles.itemCategory}>{item.category}</span>
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input 
                                type="text"
                                value={editQuantity}
                                onChange={(e) => onEditQuantityChange(e.target.value)}
                                placeholder="Quantité"
                                className="bg-[#2a2a2a] border border-[#505050] rounded px-2 py-1 text-sm text-white w-20"
                                onKeyPress={(e) => e.key === 'Enter' && onSaveEdit()}
                            />
                            <button 
                                onClick={onSaveEdit}
                                className="text-green-400 hover:text-green-300 text-sm"
                                title="Sauvegarder"
                            >
                                ✓
                            </button>
                            <button 
                                onClick={onCancelEdit}
                                className="text-red-400 hover:text-red-300 text-sm"
                                title="Annuler"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <span>
                            {item.quantity && `${item.quantity}`}
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.itemActions}>
                {!isEditing && (
                    <button 
                        className={styles.itemActionButton}
                        onClick={onEdit}
                        title="Modifier la quantité"
                    >
                        ✏️
                    </button>
                )}
                <button 
                    className={`${styles.itemActionButton} ${styles.itemDeleteButton}`}
                    onClick={onDelete}
                    title="Supprimer l'article"
                >
                    🗑️
                </button>
            </div>
        </div>
    )
}

export default ShoppingItem