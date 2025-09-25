"use client"
import Modal from '@/components/ModaleCreation/Modal'
import EditModal from '@/components/ModaleCreation/EditModal'
import PlanningModal from '@/components/PlanningModal/PlanningModal'
import Header from '@/components/ReceipePage/Headers'
import RecipesList from '@/components/ReceipePage/RecipesList'
import Search from '@/components/ReceipePage/Search'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState, useCallback } from 'react'

interface RecipeData {
  id: string;
  userId?: string;
  title: string;
  description: string;
  image: string;
  emoji: string;
  ingredients: {
    name: string;
    amount: string;
    unit?: string;
  }[];
  instructions: string[];
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const Page = () => {
    const { user, token, loading: authLoading } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<RecipeData | null>(null);
    const [planningRecipe, setPlanningRecipe] = useState<RecipeData | null>(null);
    const [recipes, setRecipes] = useState<RecipeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: 'All',
        prepTime: 'All',
        difficulty: 'All',
        diet: 'All',
        tags: [] as string[]
    });
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [shouldScrollToTop, setShouldScrollToTop] = useState(false);

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)
    
    const openEditModal = (recipe: RecipeData) => {
        setEditingRecipe(recipe);
        setIsEditModalOpen(true);
    }
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingRecipe(null);
    }

    const openPlanningModal = (recipe: RecipeData) => {
        setPlanningRecipe(recipe);
        setIsPlanningModalOpen(true);
    }
    const closePlanningModal = () => {
        setIsPlanningModalOpen(false);
        setPlanningRecipe(null);
    }

    const loadRecipes = useCallback(async () => {
        try {
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            // Build query parameters
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (filters.category !== 'All') params.append('category', filters.category);
            if (filters.difficulty !== 'All') params.append('difficulty', filters.difficulty.toLowerCase());
            if (filters.prepTime !== 'All') params.append('prepTime', filters.prepTime);
            if (filters.tags.length > 0) params.append('tags', filters.tags.join(','));
            params.append('sortBy', sortBy);
            params.append('sortOrder', sortOrder);
            params.append('page', currentPage.toString());
            params.append('limit', '12');
            
            // console.log('Chargement des recettes avec:', { sortBy, sortOrder, params: params.toString() });
            
            const response = await fetch(`/api/recipes?${params.toString()}`, { headers });
            if (response.ok) {
                const data = await response.json();
                setRecipes(data.recipes);
                setTotalPages(data.pagination?.pages || 1);
                setTotalRecipes(data.pagination?.total || 0);
            } else {
                console.error('Error loading recipes:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error loading recipes:', error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filters, sortBy, sortOrder, token, user?.id, currentPage]);

    const handleRecipeCreated = () => {
        // Reload recipes after creation
        loadRecipes();
        closeModal();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setShouldScrollToTop(true);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setShouldScrollToTop(true);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setShouldScrollToTop(true);
        }
    };

    const resetToFirstPage = () => {
        setCurrentPage(1);
        setShouldScrollToTop(true);
    };
    
    const handleRecipeUpdated = () => {
        loadRecipes();
        closeEditModal();
    };

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
        resetToFirstPage();
    };

    const handleSearchChange = (newSearchTerm: string) => {
        setSearchTerm(newSearchTerm);
        resetToFirstPage();
    };

    const handleSortChange = (newSortBy: string, newSortOrder: string) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        resetToFirstPage();
    };

    const handleAddToPlanning = async (recipeId: string, day: string, meal: string) => {
        if (!token) {
            alert('Please log in to add a recipe to the meal plan');
            return;
        }

        try {
            const response = await fetch('/api/meal-plans/add-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipeId,
                    day,
                    meal
                })
            });

            if (response.ok) {
                alert('Recipe added to meal plan successfully!');
                // Trigger meal planning page reload
                localStorage.setItem('planningUpdated', 'true');
                window.dispatchEvent(new Event('planningUpdated'));
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || 'Unable to add recipe to meal plan'}`);
            }
        } catch (error) {
            console.error('Error adding to meal plan:', error);
            alert('Error adding to meal plan');
        }
    };

    const deleteRecipe = async (recipeId: string) => {
        if (!token) {
            alert('Please log in to delete a recipe');
            return;
        }

        if (!confirm('Are you sure you want to delete this recipe?')) {
            return;
        }

        try {
            const response = await fetch(`/api/recipes?id=${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                await loadRecipes();
                alert('Recipe deleted successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Error deleting recipe');
        }
    };

    // Filtering is now done server-side
    const filteredRecipes = recipes;

    useEffect(() => {
        // Ne charger les recettes qu'une seule fois quand l'authentification est complètement initialisée
        if (!authLoading) {
            loadRecipes();
        }
    }, [authLoading, currentPage]);

    // Scroll vers le haut quand la page change
    useEffect(() => {
        if (shouldScrollToTop) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShouldScrollToTop(false);
        }
    }, [shouldScrollToTop]);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    return (
        <ProtectedRoute>
            <div className='relative'>
            <div className='fixed bottom-2 right-0 block z-[99] max-md:bottom-1 max-md:right-1'>
                <button
                    className='w-[60px] h-[60px] bg-gradient-to-br from-[#3b82f6] to-[#64748b] border-none rounded-[50%] text-white text-[1.8rem] cursor-pointer shadow-[0_4px_15px_rgba(30,41,59,0.4)] transition-all duration-300 ease-in-out flex items-center justify-center hover:scale-110 hover:shadow-[0_6px_25px_rgba(66,165,245,0.6)] active:scale-95 max-md:w-[50px] max-md:h-[50px] max-md:text-[1.5rem]'
                    onClick={openModal}
                >
                    +
                </button>
            </div>

            {isModalOpen && <Modal onClose={closeModal} onRecipeCreated={handleRecipeCreated} />}
            {isEditModalOpen && editingRecipe && <EditModal recipe={editingRecipe} onClose={closeEditModal} onRecipeUpdated={handleRecipeUpdated} />}
            {isPlanningModalOpen && planningRecipe && (
                <PlanningModal 
                    recipe={planningRecipe} 
                    isOpen={isPlanningModalOpen} 
                    onClose={closePlanningModal} 
                    onAddToPlanning={handleAddToPlanning} 
                />
            )}
            <Header />
            <Search onSearchChange={handleSearchChange} onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
            <RecipesList 
                recipes={filteredRecipes} 
                loading={loading}
                onDelete={deleteRecipe}
                onEdit={openEditModal}
                onAddToPlanning={openPlanningModal}
                currentUserId={user?.id} 
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8 mb-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-slate-700 hover:to-slate-800 transition-all duration-200"
                    >
                        Previous
                    </button>
                    
                    <div className="flex space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                                        currentPage === pageNum
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                                            : 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-slate-700 hover:to-slate-800 transition-all duration-200"
                    >
                        Next
                    </button>
                </div>
            )}
            
            {/* Info de pagination */}
            <div className="text-center text-slate-400 text-sm mb-4">
                Page {currentPage} of {totalPages} • {totalRecipes} recipes in total
            </div>
            </div>
        </ProtectedRoute>
    )
}

export default Page
