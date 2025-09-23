"use client"
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

interface Meal {
  name?: string;
  nom?: string;
  description?: string;
  emoji?: string;
  ingredients?: {
    name: string;
    amount: string;
    unit?: string;
  }[];
  instructions?: string[];
  temps?: string;
  time?: string;
  servings?: number;
  difficulty?: 'facile' | 'moyen' | 'difficile';
  category?: string;
  tags?: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface MealPlan {
  [day: string]: {
    matin: Meal;
    midi: Meal;
    soir: Meal;
  };
}

export default function PlanificationPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<string>("lundi");
  const [preferences, setPreferences] = useState<{
    dietType: string;
    allergies: string[];
    dislikes: string[];
    numberOfPeople: number;
    budget: string;
    cookingTime: string;
  } | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadUserData = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Charger les préférences depuis la base de données
      const preferencesResponse = await fetch('/api/user-preferences', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (preferencesResponse.ok) {
        const preferencesData = await preferencesResponse.json();
        if (preferencesData.success) {
          setPreferences(preferencesData.preferences);
        }
      }

      // Charger le plan généré par l'IA depuis la base de données
      const mealPlanResponse = await fetch('/api/meal-plans', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (mealPlanResponse.ok) {
        const mealPlanData = await mealPlanResponse.json();
        if (mealPlanData.success) {
          console.log('Planning chargé:', mealPlanData.mealPlan);
          setGeneratedPlan(mealPlanData.mealPlan);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData, refreshTrigger]);

  // Écouter les changements de planning depuis d'autres pages
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'planningUpdated') {
        console.log('Planning mis à jour via storage');
        setRefreshTrigger(prev => prev + 1);
        localStorage.removeItem('planningUpdated');
      }
    };

    const handlePlanningUpdate = () => {
      console.log('Planning mis à jour via événement');
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('planningUpdated', handlePlanningUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('planningUpdated', handlePlanningUpdate);
    };
  }, []);


  const regenerateMealPlan = async () => {
    if (!preferences) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      const data = await response.json();
      
      if (data.success && data.mealPlan) {
        // Sauvegarder le nouveau plan généré par l'IA en base de données
        const saveResponse = await fetch('/api/meal-plans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ preferences, mealPlan: data.mealPlan }),
        });

        if (saveResponse.ok) {
          setGeneratedPlan(data.mealPlan);
          alert('Planning mis à jour avec succès !');
        } else {
          alert('Erreur lors de la mise à jour du planning');
        }
      } else {
        alert('Erreur lors de la régénération du plan');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion à l\'API');
    } finally {
      setIsGenerating(false);
    }
  };

  const weeklyMealPlan = generatedPlan;

  const days = weeklyMealPlan ? Object.keys(weeklyMealPlan) as string[] : [];

  const getMealCard = (meal: Meal, time: string, day: string) => {
    // Gérer les deux formats : plan par défaut et plan généré par IA
    const mealName = meal.name || meal.nom || `Repas ${time}`;
    const mealEmoji = meal.emoji || '🍽️';
    const mealIngredients = meal.ingredients || [];
    const mealTime = meal.temps || meal.time || '30 min';
    
    const handleMealClick = () => {
      router.push(`/planning-recipe/${day}-${time}`);
    };
    
    return (
      <div 
        key={time} 
        onClick={handleMealClick}
        className="bg-gradient-to-br from-[#3a3a3a] to-[#2d2d2d] rounded-xl p-4 border border-gray-600 hover:border-[#3b82f6] transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 flex flex-col h-full min-h-[200px]"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{mealEmoji}</span>
            <h4 className="text-[#3b82f6] font-bold text-lg">{mealName}</h4>
          </div>
          {mealTime && <span className="text-xs bg-[#3b82f6] text-white px-2 py-1 rounded">{mealTime}</span>}
        </div>
        <div className="space-y-1 flex-grow">
          <p className="text-gray-400 text-sm font-medium">Ingrédients:</p>
          <ul className="space-y-1">
            {Array.isArray(mealIngredients) ? mealIngredients.slice(0, 3).map((ingredient: any, index: number) => (
              <li key={index} className="text-[#b0b0b0] text-sm flex items-center gap-2">
                <span className="text-[#3b82f6] text-xs">•</span>
                {typeof ingredient === 'string' ? ingredient : `${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.name || ''}`.trim()}
              </li>
            )) : (
              <li className="text-[#b0b0b0] text-sm">Aucun ingrédient disponible</li>
            )}
            {Array.isArray(mealIngredients) && mealIngredients.length > 3 && (
              <li className="text-[#3b82f6] text-sm font-medium">
                +{mealIngredients.length - 3} autres ingrédients...
              </li>
            )}
          </ul>
        </div>
        <div className="mt-3 text-center border-t border-gray-600 pt-3">
          <span className="text-[#3b82f6] text-sm font-medium">Cliquez pour voir les détails</span>
        </div>
      </div>
    );
  };

  // État de chargement
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
            <p className="text-[#b0b0b0] text-lg">Chargement de vos données...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🍽️ Planning des Repas IA
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            Votre planning hebdomadaire personnalisé avec des repas équilibrés pour chaque jour
          </p>
          
            <div className="flex gap-4 justify-center mb-6">
              <Link
                href="/preferences"
                className="bg-gradient-to-r from-[#3b82f6] to-[#64748b] text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 inline-block"
              >
                🤖 Configurer et générer avec l&apos;IA
              </Link>
              <button
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 inline-block"
              >
                🔄 Actualiser
              </button>
            </div>
          
          {preferences && (
            <div className="mt-4 bg-[#2a2a2a] rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-[#3b82f6] font-medium">
                🎯 Régime: {preferences.dietType.charAt(0).toUpperCase() + preferences.dietType.slice(1)} • 
                👥 {preferences.numberOfPeople} personne{preferences.numberOfPeople > 1 ? 's' : ''} • 
                💰 Budget {preferences.budget} • 
                ⏱️ Cuisine {preferences.cookingTime}
              </p>
            </div>
          )}
        </div>

        {/* État vide si pas de plan généré */}
        {!weeklyMealPlan ? (
          <div className="bg-[#2a2a2a] rounded-2xl p-12 shadow-xl text-center">
            <div className="text-6xl mb-6">🍽️</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Aucun planning généré
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Cliquez sur &quot;🤖 Configurer et générer avec l&apos;IA&quot; pour configurer vos préférences alimentaires et créer votre planning personnalisé.
            </p>
            <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md mx-auto mb-6">
              <h3 className="text-lg font-bold text-[#3b82f6] mb-3">💡 Comment ça marche ?</h3>
              <ul className="text-gray-300 text-sm space-y-2 text-left">
                <li>• Configurez vos préférences alimentaires</li>
                <li>• L&apos;IA génère un planning personnalisé</li>
                <li>• Régénérez autant de fois que souhaité</li>
                <li>• Vos plannings sont sauvegardés</li>
              </ul>
            </div>
            <Link
              href="/preferences"
              className="bg-gradient-to-r from-[#3b82f6] to-[#64748b] text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 inline-block"
            >
              🚀 Commencer la configuration
            </Link>
          </div>
        ) : (
          <>
            {/* Navigation des jours */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedDay === day
                      ? "bg-[#3b82f6] text-white shadow-lg"
                      : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] hover:text-white"
                  }`}
                >
                  {String(day).charAt(0).toUpperCase() + String(day).slice(1)}
                </button>
              ))}
            </div>

            {/* Planning du jour sélectionné */}
            <div className="bg-[#2a2a2a] rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-[#3b82f6] mb-6 text-center">
                {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ gridTemplateRows: '1fr' }}>
                {/* Petit-déjeuner */}
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    🌅 Petit-déjeuner
                  </h3>
                  <div className="flex-grow">
                    {getMealCard(weeklyMealPlan[selectedDay]?.matin, "matin", selectedDay)}
                  </div>
                </div>

                {/* Déjeuner */}
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    ☀️ Déjeuner
                  </h3>
                  <div className="flex-grow">
                    {getMealCard(weeklyMealPlan[selectedDay]?.midi, "midi", selectedDay)}
                  </div>
                </div>

                {/* Dîner */}
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    🌙 Dîner
                  </h3>
                  <div className="flex-grow">
                    {getMealCard(weeklyMealPlan[selectedDay]?.soir, "soir", selectedDay)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {weeklyMealPlan && (
            <button 
              onClick={regenerateMealPlan}
              disabled={isGenerating}
              className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Régénération...
                </span>
              ) : (
                '🔄 Régénérer le planning'
              )}
            </button>
          )}
          <Link 
            href="/" 
            className="bg-gradient-to-r from-[#6b7280] to-[#4b5563] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            ← Retour à l accueil
          </Link>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
