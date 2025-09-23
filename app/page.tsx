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
      const response = await fetch('/api/recipes?limit=6&sortBy=createdAt&sortOrder=desc');
      
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
  }, []);

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
      alert('Veuillez vous connecter pour ajouter des articles à votre liste de courses');
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
        // Recharger la shopping list
        await loadShoppingItems();
        alert(`${ingredient.name} ajouté à votre liste de courses (${category}) !`);
      } else {
        console.error(`Erreur lors de l'ajout de ${ingredient.name}`);
        alert('Erreur lors de l\'ajout à la liste de courses');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la liste de courses:', error);
      alert('Erreur lors de l\'ajout à la liste de courses');
    }
  };

  const handleStartWithAI = async () => {
    // Rediriger vers la page de préférences
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

  // Page d'accueil pour utilisateurs non connectés
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
              Planifiez vos repas avec l intelligence artificielle. 
              Obtenez des suggestions personnalisées et optimisez vos courses.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login?mode=signup">
                <button className="bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white px-8 py-4 border-none rounded-full text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-xs hover:-translate-y-0.5 hover:shadow-lg">
                  Créer un compte
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-gradient-to-br from-[#6b7280] to-[#4b5563] text-white px-8 py-4 border-none rounded-full text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-xs hover:-translate-y-0.5 hover:shadow-lg">
                  Se connecter
                </button>
              </Link>
            </div>
          </section>

          {/* Features */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-xl text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-[#3b82f6] mb-4">IA Personnalisée</h3>
              <p className="text-gray-300">
                Des suggestions de repas adaptées à vos goûts, allergies et préférences alimentaires.
              </p>
            </div>
            
            <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-xl text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-[#3b82f6] mb-4">Planning Hebdomadaire</h3>
              <p className="text-gray-300">
                Organisez vos repas de la semaine avec des plats équilibrés pour chaque jour.
              </p>
            </div>
            
            <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-xl text-center">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-[#3b82f6] mb-4">Liste de Courses</h3>
              <p className="text-gray-300">
                Générez automatiquement vos listes de courses basées sur vos repas planifiés.
              </p>
            </div>
          </section>

          {/* CTA Final */}
          <section className="bg-gradient-to-br from-[#3b82f6] to-[#64748b] p-12 text-center shadow-xl rounded-lg">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à révolutionner votre alimentation ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez PlanEat dès maintenant et découvrez une nouvelle façon de cuisiner.
            </p>
            <Link href="/login?mode=signup">
              <button className="bg-white text-[#3b82f6] px-8 py-4 border-none rounded-full text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-xs hover:-translate-y-0.5 hover:shadow-lg">
                Commencer gratuitement
              </button>
            </Link>
          </section>
        </div>
      </div>
    );
  }

  // Page d'accueil pour utilisateurs connectés (votre contenu original)
  const recipeCard = 'bg-gradient-to-br from-[#3a3a3a] to-gray-[#2d2d2d] rounded-xl overflow-hidden transition-all duration-300 ease-out border border-gray-600 hover:-translate-y-1 hover:shadow-2xl';
  const recipeImage = 'w-full h-50 bg-gradient-to-br from-[#3b82f6] to-[#64748b] flex items-center justify-center text-9xl text-white';
  const recipeInfo = 'p-6';
  const recipeInfoH3 = 'text-[#3b82f6] mb-4 text-xl font-bold';
  const ingredients = 'mb-6';
  const ingredientsH4 = 'text-gray-300 mb-2 text-base font-bold';
  const ingredientsul = 'list-none pl-0';
  const ingredientli = "text-[#b0b0b0] mb-[0.3rem] pl-4 relative before:content-['•'] before:text-[#3b82f6] before:absolute before:left-0";
  // const addToList = 'bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white border-none py-3 px-6 rounded-full cursor-pointer font-bold transition-all duration-300 ease-out w-full hover:-translate-y-0.5 hover:bg-gradient-to-br hover:blue-blue-600 hover:to-blue-700';
  const shoppingItem = 'bg-[#3a3a3a] p-4 mb-2 rounded-lg border-l-4 border-l-[#3b82f6] transition-all duration-300 ease-out hover:bg-[#404040] hover:-translate-x-[5px]'

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-[1fr] gap-8 max-md:grid-cols-1 max-md:gap-4">
      <main className="flex flex-col gap-8">
        {/* MAIN CONTAINER */}
        <section className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-12 text-center shadow-xl rounded-lg max-md:p-8 max-sm:p-6">
          <h1 className="welcome-title">
            Planifier Vos Repas avec IA
          </h1>

          <p className="text-xl mb-8 opacity-90 max-w-[600px] ml-auto mr-auto max-sm:text-base">
            Decouvez une nouvelle facon de planifier vos repas grace a notre Intelligence Artificielle.
            Obtenez des suggestions personnalisees, optimisez vos courses et savourez chaque repas.
          </p>

              <button 
                onClick={handleStartWithAI}
                className="bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white px-8 py-4 border-none rounded-full text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-xs hover:-translate-y-0.5 hover:shadow-lg shadow-blue-900 hover:to-blue-700"
              >
                Commencer
              </button>
        </section>

        {/* RECEIPE SECTION */}
        <section className="bg-[#2a2a2a] p-8 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#3b82f6] text-3xl">
              Suggestions de recettes
            </h2>
            <Link 
              href="/recipe"
              className="text-[#3b82f6] hover:text-[#60a5fa] text-sm font-medium transition-colors"
            >
              Voir toutes les recettes
            </Link>
          </div>

          {recipesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
              <p className="text-gray-300">Chargement des recettes...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-300 mb-4">Aucune recette disponible pour le moment</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-[#3b82f6] hover:text-[#60a5fa] text-sm font-medium transition-colors"
              >
                Recharger
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 max-md:grid-cols-1">
              {recipes.map((recipe) => (
                <div key={recipe.id} className={recipeCard}>
                  <div className={recipeImage} style={{ backgroundImage: `url(${recipe.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="text-6xl">{recipe.emoji}</div>
                  </div>
                  <div className={recipeInfo}>
                    <h3 className={recipeInfoH3}>{recipe.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                      <span>👥 {recipe.servings} pers.</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        recipe.difficulty === 'facile' ? 'bg-green-900 text-green-300' :
                        recipe.difficulty === 'moyen' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                    <div className={ingredients}>
                      <h4 className={ingredientsH4}>Ingrédients:</h4>
                      <p className="text-[#b0b0b0] text-sm mb-4 md:hidden">Touchez le + pour ajouter à votre liste</p>
                      <ul className={ingredientsul}>
                        {recipe.ingredients.slice(0, 5).map((ingredient, index) => (
                          <li key={index} className={`${ingredientli} flex items-center justify-between group`}>
                            <span>
                              {ingredient.name} {ingredient.amount} {ingredient.unit || ''}
                            </span>
                            <button
                              onClick={() => addIngredientToShoppingList(ingredient)}
                              className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm px-3 py-2 rounded ml-2 md:text-xs md:px-2 md:py-1"
                              title="Ajouter à la liste de courses"
                            >
                              +
                            </button>
                          </li>
                        ))}
                        {recipe.ingredients.length > 5 && (
                          <li className={ingredientli}>... et {recipe.ingredients.length - 5} autres</li>
                        )}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        href={`/recipe/${recipe.id}`}
                        className="flex-1 bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none py-3 px-6 rounded-full cursor-pointer font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg text-center"
                      >
                        Voir la recette
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
            Liste de courses
          </h2>
          <Link 
            href="/shopping-list"
            className="text-[#3b82f6] hover:text-[#60a5fa] text-sm font-medium transition-colors"
          >
            Voir tout
          </Link>
        </div>

        {shoppingLoading ? (
          <div className="text-center text-[#888] p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3b82f6] mx-auto mb-2"></div>
            Chargement...
          </div>
        ) : shoppingItems.length === 0 ? (
          <div className="text-center text-[#888] italic p-8">
            Votre liste de courses est vide.<br />
            <Link href="/shopping-list" className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
              Ajoutez des articles
            </Link> pour commencer!
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-[#b0b0b0] mb-3">
              {shoppingItems.filter(item => !item.isCompleted).length} article(s) restant(s)
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
