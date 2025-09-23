"use client"
import Modal from '@/components/ModaleCreation/Modal'
import EditModal from '@/components/ModaleCreation/EditModal'
import Header from '@/components/ReceipePage/Headers'
import RecipesList from '@/components/ReceipePage/RecipesList'
import Search from '@/components/ReceipePage/Search'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

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
  cookTime: number;
  servings: number;
  difficulty: 'facile' | 'moyen' | 'difficile';
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
    const { user, token } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<RecipeData | null>(null);
    const [recipes, setRecipes] = useState<RecipeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: 'Toutes',
        prepTime: 'Tous',
        difficulty: 'Toutes',
        diet: 'Tous',
        tags: [] as string[]
    });
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

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

    const loadRecipes = async () => {
        try {
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            // Construire les paramètres de requête
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (filters.category !== 'Toutes') params.append('category', filters.category);
            if (filters.difficulty !== 'Toutes') params.append('difficulty', filters.difficulty.toLowerCase());
            if (filters.prepTime !== 'Tous') params.append('prepTime', filters.prepTime);
            if (filters.tags.length > 0) params.append('tags', filters.tags.join(','));
            params.append('sortBy', sortBy);
            params.append('sortOrder', sortOrder);
            
            // console.log('Chargement des recettes avec:', { sortBy, sortOrder, params: params.toString() });
            
            const response = await fetch(`/api/recipes?${params.toString()}`, { headers });
            if (response.ok) {
                const data = await response.json();
                setRecipes(data.recipes);
            } else {
                console.error('Erreur lors du chargement des recettes');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des recettes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecipeCreated = () => {
        // Recharger les recettes après création
        loadRecipes();
        closeModal();
    };
    
    const handleRecipeUpdated = () => {
        loadRecipes();
        closeEditModal();
    };

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
    };

    const handleSearchChange = (newSearchTerm: string) => {
        setSearchTerm(newSearchTerm);
    };

    const handleSortChange = (newSortBy: string, newSortOrder: string) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    const deleteRecipe = async (recipeId: string) => {
        if (!token) {
            alert('Veuillez vous connecter pour supprimer une recette');
            return;
        }

        if (!confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
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
                alert('Recette supprimée avec succès !');
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.message}`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la recette:', error);
            alert('Erreur lors de la suppression de la recette');
        }
    };

    // Le filtrage se fait maintenant côté serveur
    const filteredRecipes = recipes;

    useEffect(() => {
        loadRecipes();
    }, [searchTerm, filters, sortBy, sortOrder, token]);

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
                    className='w-[60px] h-[60px] bg-linear-to-br from-[#3b82f6] to-[#64748b] border-none rounded-[50%] text-white text-[1.8rem] cursor-pointer shadow-[0_4px_15px_rgba(30,41,59,0.4)] transition-all duration-300 ease-in-out flex items-center justify-center hover:scale-110 hover:shadow-[0_6px_25px_rgba(66,165,245,0.6)] active:scale-95 max-md:w-[50px] max-md:h-[50px] max-md:text-[1.5rem]'
                    onClick={openModal}
                >
                    +
                </button>
            </div>

            {isModalOpen && <Modal onClose={closeModal} onRecipeCreated={handleRecipeCreated} />}
            {isEditModalOpen && editingRecipe && <EditModal recipe={editingRecipe} onClose={closeEditModal} onRecipeUpdated={handleRecipeUpdated} />}
            <Header />
            <Search onSearchChange={handleSearchChange} onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
            <RecipesList 
                recipes={filteredRecipes} 
                loading={loading}
                onDelete={deleteRecipe}
                onEdit={openEditModal}
                currentUserId={user?.id}
            />
            </div>
        </ProtectedRoute>
    )
}

export default Page
