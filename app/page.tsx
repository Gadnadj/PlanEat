"use client"
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getIngredientCategory } from "@/lib/ingredientCategories";

interface ShoppingItemData {
  id: string;
  name: string;
  category: string;
  quantity?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export default function Home() {
  const { user, loading, token } = useAuth();
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemData[]>([]);
  const [shoppingLoading, setShoppingLoading] = useState(false);
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(false);

  const loadShoppingItems = useCallback(async () => {
    if (!token) return;
    
    setShoppingLoading(true);
    try {
      const response = await fetch('/api/shopping-list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setShoppingItems(data.items);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setShoppingLoading(false);
    }
  }, [token]);

  const loadRecipes = useCallback(async () => {
    setRecipesLoading(true);
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/recipes?limit=6&sortBy=createdAt&sortOrder=desc', { headers });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRecipes(data.recipes);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des recettes:', error);
    } finally {
      setRecipesLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      loadShoppingItems();
    }
    loadRecipes();
  }, [user, token, loadShoppingItems, loadRecipes]);

  // Rafraîchir la liste quand l'utilisateur revient sur la page
  useEffect(() => {
    const handleFocus = () => {
      if (user && token) {
        loadShoppingItems();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, token, loadShoppingItems]);


  const addIngredientToShoppingList = async (ingredient: { name: string; amount: string; unit?: string }) => {
    if (!token) {
      alert('Please log in to add items to your shopping list');
      return;
    }

    try {
      const category = getIngredientCategory(ingredient.name);
      
      const response = await fetch('/api/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: ingredient.name,
          category: category,
          quantity: ingredient.amount + (ingredient.unit ? ` ${ingredient.unit}` : '')
        })
      });

      if (response.ok) {
        // Reload shopping list
        await loadShoppingItems();
        alert(`${ingredient.name} added to your shopping list (${category})!`);
      } else {
        console.error(`Error adding ${ingredient.name}`);
        alert('Error adding to shopping list');
      }
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      alert('Error adding to shopping list');
    }
  };


  const handleStartWithAI = async () => {
    // Redirect to preferences page
    window.location.href = '/preferences';
  };

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
          <p className="text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  // Home page for non-logged-in users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-12 text-center shadow-xl rounded-lg mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">
              🍽️ PlanEat
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-[600px] mx-auto">
              Plan your meals with artificial intelligence. 
              Get personalized suggestions and optimize your shopping.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login?mode=signup">
                <button className="bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white px-8 py-4 border-none rounded-full text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-xs hover:-translate-y-0.5 hover:shadow-lg">
                  Create Account
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-gradient-to-br from-[#6b7280] to-[#4b5563] text-white px-8 py-4 border-none rounded-full text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-xs hover:-translate-y-0.5 hover:shadow-lg">
                  Sign In
                </button>
              </Link>
            </div>
          </section>

          {/* Features */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-xl text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-[#3b82f6] mb-4">Personalized AI</h3>
              <p className="text-gray-300">
                Meal suggestions adapted to your tastes, allergies and dietary preferences.
              </p>
            </div>
            
            <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-xl text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-[#3b82f6] mb-4">Weekly Planning</h3>
              <p className="text-gray-300">
                Organize your weekly meals with balanced dishes for every day.
              </p>
            </div>
            
            <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-xl text-center">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-[#3b82f6] mb-4">Shopping List</h3>
              <p className="text-gray-300">
                Automatically generate your shopping lists based on your planned meals.
              </p>
            </div>
          </section>

          {/* CTA Final */}
          <section className="bg-gradient-to-br from-[#3b82f6] to-[#64748b] p-12 text-center shadow-xl rounded-lg">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to revolutionize your nutrition?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join PlanEat now and discover a new way to cook.
            </p>
            <Link href="/login?mode=signup">
              <button className="bg-white text-[#3b82f6] px-8 py-4 border-none rounded-full text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-xs hover:-translate-y-0.5 hover:shadow-lg">
                Get Started Free
              </button>
            </Link>
          </section>
        </div>
      </div>
    );
  }

  // Home page for logged-in users (your original content)
  const recipeCard = 'bg-gradient-to-br from-[#3a3a3a] to-gray-[#2d2d2d] rounded-xl overflow-hidden transition-all duration-300 ease-out border border-gray-600 hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full max-sm:rounded-lg';
  const recipeImage = 'w-full h-40 sm:h-48 bg-gradient-to-br from-[#3b82f6] to-[#64748b] flex items-center justify-center text-4xl sm:text-6xl text-white flex-shrink-0';
  const recipeInfo = 'p-4 sm:p-6 flex flex-col flex-grow';
  const recipeInfoH3 = 'text-[#3b82f6] mb-3 sm:mb-4 text-lg sm:text-xl font-bold leading-tight';
  const ingredients = 'mb-4 flex-grow min-h-28 sm:min-h-32';
  const ingredientsH4 = 'text-gray-300 mb-2 text-sm sm:text-base font-bold';
  const ingredientsul = 'list-none pl-0';
  const ingredientli = "text-[#b0b0b0] pl-4 relative before:content-['•'] before:text-[#3b82f6] before:absolute before:left-0 text-sm sm:text-base";
  // const addToList = 'bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white border-none py-3 px-6 rounded-full cursor-pointer font-bold transition-all duration-300 ease-out w-full hover:-translate-y-0.5 hover:bg-gradient-to-br hover:blue-blue-600 hover:to-blue-700';
  const shoppingItem = 'bg-[#3a3a3a] p-4 mb-2 rounded-lg border-l-4 border-l-[#3b82f6] transition-all duration-300 ease-out hover:bg-[#404040] hover:-translate-x-[5px]'

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 grid grid-cols-[1fr] gap-4 sm:gap-8 max-md:grid-cols-1">
      <main className="flex flex-col gap-8">
        {/* MAIN CONTAINER */}
        <section className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-12 text-center shadow-xl rounded-lg max-md:p-8 max-sm:p-6">
          <h1 className="welcome-title">
            Plan Your Meals with AI
          </h1>

          <p className="text-xl mb-8 opacity-90 max-w-[600px] ml-auto mr-auto max-sm:text-base">
            Discover a new way to plan your meals with our Artificial Intelligence.
            Get personalized suggestions, optimize your shopping, and enjoy every meal.
          </p>

              <button 
                onClick={handleStartWithAI}
                className="bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white px-8 py-4 border-none rounded-full text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-xs hover:-translate-y-0.5 hover:shadow-lg shadow-blue-900 hover:to-blue-700"
              >
                Get Started
              </button>
        </section>

        {/* RECEIPE SECTION */}
        <section className="bg-[#2a2a2a] p-8 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#3b82f6] text-3xl">
              Recipe Suggestions
            </h2>
            <Link 
              href="/recipe"
              className="text-[#3b82f6] hover:text-[#60a5fa] text-sm font-medium transition-colors"
            >
              View All Recipes
            </Link>
          </div>

          {recipesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
              <p className="text-gray-300">Loading recipes...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-300 mb-4">No recipes available at the moment</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-[#3b82f6] hover:text-[#60a5fa] text-sm font-medium transition-colors"
              >
                Reload
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" style={{ gridTemplateRows: '1fr' }}>
              {recipes.map((recipe) => (
                <div key={recipe.id} className={recipeCard}>
                  <div className={recipeImage} style={{ backgroundImage: `url(${recipe.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="text-6xl">{recipe.emoji}</div>
                  </div>
                  <div className={recipeInfo}>
                    <h3 className={recipeInfoH3}>{recipe.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 sm:mb-4 line-clamp-2 h-8 sm:h-10 overflow-hidden leading-tight">{recipe.description}</p>
                    <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                      <span className="flex items-center gap-1">👥 {recipe.servings}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        recipe.difficulty === 'facile' ? 'bg-green-900 text-green-300' :
                        recipe.difficulty === 'moyen' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                    <div className={ingredients}>
                      <h4 className={ingredientsH4}>Ingredients:</h4>
                      <p className="text-[#b0b0b0] text-xs sm:text-sm mb-3 sm:mb-4 md:hidden">Tap + to add to your list</p>
                      <ul className={ingredientsul}>
                        {recipe.ingredients.slice(0, 5).map((ingredient, index) => (
                          <li key={index} className={`${ingredientli} flex items-start justify-between group gap-2 mb-2`}>
                            <span className="flex-1 min-w-0 leading-tight break-words">
                              {ingredient.name} {ingredient.amount} {ingredient.unit || ''}
                            </span>
                            <button
                              onClick={() => addIngredientToShoppingList(ingredient)}
                              className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs px-2 py-1 rounded flex-shrink-0 mt-0.5"
                              title="Add to shopping list"
                            >
                              +
                            </button>
                          </li>
                        ))}
                        {recipe.ingredients.length > 5 && (
                          <li className={ingredientli}>... and {recipe.ingredients.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Link 
                        href={`/recipe/${recipe.id}`}
                        className="flex-1 bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none py-2 sm:py-3 px-4 sm:px-6 rounded-full cursor-pointer font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg text-center text-sm sm:text-base"
                      >
                        View Recipe
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main >

      <aside className="bg-[#2a2a2a] p-8 rounded-2xl shadow-xl h-fit sticky top-[120px] max-md:static">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#3b82f6] text-2xl font-bold flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            Shopping List
          </h2>
          <Link 
            href="/shopping-list"
            className="text-[#3b82f6] hover:text-[#60a5fa] text-sm font-medium transition-colors"
          >
            View All
          </Link>
        </div>

        {shoppingLoading ? (
          <div className="text-center text-[#888] p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3b82f6] mx-auto mb-2"></div>
            Loading...
          </div>
        ) : shoppingItems.length === 0 ? (
          <div className="text-center text-[#888] italic p-8">
            Your shopping list is empty.<br />
            <Link href="/shopping-list" className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
              Add items
            </Link> to get started!
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-[#b0b0b0] mb-3">
              {shoppingItems.filter(item => !item.isCompleted).length} item(s) remaining
            </div>
            <ul className="list-none space-y-2">
              {shoppingItems
                .filter(item => !item.isCompleted)
                .slice(0, 5)
                .map((item) => (
                  <li 
                    key={item.id}
                    className={`${shoppingItem} ${item.isCompleted ? 'opacity-60 line-through' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{item.name}</span>
                      {item.quantity && (
                        <span className="text-[#b0b0b0] text-sm">{item.quantity}</span>
                      )}
                    </div>
                    <div className="text-xs text-[#3b82f6] mt-1">{item.category}</div>
                  </li>
                ))}
            </ul>
            {shoppingItems.filter(item => !item.isCompleted).length > 5 && (
              <div className="text-center mt-4">
                <Link 
                  href="/shopping-list"
                  className="text-[#3b82f6] hover:text-[#60a5fa] text-sm font-medium transition-colors"
                >
                  +{shoppingItems.filter(item => !item.isCompleted).length - 5} autres articles
                </Link>
              </div>
            )}
          </div>
        )}
      </aside>
    </div >
  );
}
