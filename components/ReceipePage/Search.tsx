import { useState } from 'react';
import { styles } from "./styles";

interface SearchProps {
    searchTerm: string;
    onSearchChange: (searchTerm: string) => void;
    onFilterChange: (filters: {
        category: string;
        prepTime: string;
        difficulty: string;
        diet: string;
        tags: string[];
    }) => void;
    onSortChange: (sortBy: string, sortOrder: string) => void;
}

const Search = ({ searchTerm, onSearchChange, onFilterChange, onSortChange }: SearchProps) => {
    const [filters, setFilters] = useState({
        category: 'All',
        prepTime: 'All',
        difficulty: 'All',
        diet: 'All',
        tags: [] as string[]
    });
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleFilterChange = (filterType: string, value: string) => {
        const newFilters = { ...filters, [filterType]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleTagToggle = (tag: string) => {
        const newTags = filters.tags.includes(tag) 
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag];
        const newFilters = { ...filters, tags: newTags };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        const defaultFilters = {
            category: 'All',
            prepTime: 'All',
            difficulty: 'All',
            diet: 'All',
            tags: []
        };
        setFilters(defaultFilters);
        onSearchChange('');
        onFilterChange(defaultFilters);
    };

    const handleSortChange = (newSortBy: string) => {
        setSortBy(newSortBy);
        onSortChange(newSortBy, sortOrder);
    };

    const handleSortOrderChange = (newSortOrder: string) => {
        setSortOrder(newSortOrder);
        onSortChange(sortBy, newSortOrder);
    };
    return (
        <section className='max-w-[1400px] mx-auto px-8 pb-8 bg-[#2a2a2a] rounded-[15px] mb-8 shadow-[0_4px_15px_rgba(0,0,0,0.2)] max-sm:pl-4 max-sm:pr-4'>
            <div className='py-8 pt-8 pb-4 flex gap-4 items-center max-md:flex-col'>
                <input 
                    className='flex-1 px-6 py-4 bg-[#3a3a3a] border-2 border-[#404040] rounded-[10px] text-[#e0e0e0] text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-[#3b82f6]' 
                    type="text" 
                    placeholder='Search for a recipe, ingredient...' 
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <button 
                    onClick={resetFilters}
                    className='bg-gradient-to-br from-[#6b7280] to-[#4b5563] text-white border-none px-6 py-4 rounded-[10px] font-bold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(0,0,0,0.4)]'
                >
                    🔄 Reset
                </button>
                <button className='bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white border-none px-8 py-4 rounded-[10px] font-bold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(30,56,59,0.4)]'>🔍 Search</button>
            </div>

            <div className='flex gap-4 flex-wrap pb-4 max-md:flex-col max-md:gap-4'>
                <div className='flex flex-col gap-2 max-md:w-full'>
                    <label className={styles.label}>Category</label>
                    <select 
                        className={styles.select}
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option>All</option>
                        <option>Appetizer</option>
                        <option>Main Course</option>
                        <option>Dessert</option>
                        <option>Beverage</option>
                        <option>Side Dish</option>
                    </select>
                </div>

                <div className='flex flex-col gap-2 max-md:w-full'>
                    <label className={styles.label}>Prep Time</label>
                    <select 
                        className={styles.select}
                        value={filters.prepTime}
                        onChange={(e) => handleFilterChange('prepTime', e.target.value)}
                    >
                        <option>All</option>
                        <option>Less than 15 min</option>
                        <option>15-30 min</option>
                        <option>30-60 min</option>
                        <option>More than 1 hour</option>
                    </select>
                </div>

                <div className='flex flex-col gap-2 max-md:w-full'>
                    <label className={styles.label}>Difficulty</label>
                    <select 
                        className={styles.select}
                        value={filters.difficulty}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    >
                        <option>All</option>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>

                <div className='flex flex-col gap-2 max-md:w-full'>
                    <label className={styles.label}>Diet</label>
                    <select 
                        className={styles.select}
                        value={filters.diet}
                        onChange={(e) => handleFilterChange('diet', e.target.value)}
                    >
                        <option>All</option>
                        <option>Vegetarian</option>
                        <option>Vegan</option>
                        <option>Gluten-free</option>
                        <option>Ketogenic</option>
                    </select>
                </div>

                <div className='flex flex-col gap-2 max-md:w-full'>
                    <label className={styles.label}>Sort by</label>
                    <select 
                        className={styles.select}
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                    >
                        <option value="createdAt">Creation Date</option>
                        <option value="title">Name</option>
                        <option value="prepTime">Prep Time</option>
                        <option value="difficulty">Difficulty</option>
                        <option value="calories">Calories</option>
                    </select>
                </div>

                <div className='flex flex-col gap-2 max-md:w-full'>
                    <label className={styles.label}>Order</label>
                    <select 
                        className={styles.select}
                        value={sortOrder}
                        onChange={(e) => handleSortOrderChange(e.target.value)}
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>
            </div>

            <div className='flex gap-2 flex-wrap mt-4 max-sm:justify-center'>
                {['Popular', 'Quick', 'Healthy', 'Budget', 'Family', 'Gourmet'].map((tag) => (
                    <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`${styles.filterTag} ${
                            filters.tags.includes(tag) 
                                ? 'bg-[#3b82f6] text-white' 
                                : 'bg-[#404040] text-[#b0b0b0] hover:bg-[#505050]'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </section>
    )
}

export default Search;