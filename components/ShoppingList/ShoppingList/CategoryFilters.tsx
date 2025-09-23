import { styles } from '../styles'

interface CategoryFiltersProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const CategoryFilters = ({ categories, selectedCategory, onCategoryChange }: CategoryFiltersProps) => {
    const getCategoryEmoji = (category: string) => {
        const emojis: { [key: string]: string } = {
            'Toutes': '📋',
            'Fruits & Légumes': '🥕',
            'Viandes & Poissons': '🥩',
            'Produits laitiers': '🥛',
            'Épicerie': '🏪',
            'Boulangerie': '🍞',
            'Boissons': '🥤',
            'Autres': '📦'
        };
        return emojis[category] || '📦';
    };

    return (
        <div className='flex gap-2 mb-8 flex-wrap max-md:justify-center'>
            {categories.map((category) => (
                <button 
                    key={category}
                    className={`${styles.categoryButton} ${
                        selectedCategory === category ? styles.categoryButtonActive : ''
                    }`}
                    onClick={() => onCategoryChange(category)}
                >
                    {getCategoryEmoji(category)} {category}
                </button>
            ))}
        </div>
    )
}

export default CategoryFilters