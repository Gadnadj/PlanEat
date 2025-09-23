"use client"
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

interface Meal {
  name?: string;
  nom?: string;
  emoji?: string;
  ingredients: string[];
  temps?: string;
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

  const loadUserData = useCallback(async () => {
    if (!token) return;
    
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
          setGeneratedPlan(mealPlanData.mealPlan);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadUserData();
    }
  }, [token, loadUserData]);


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

  const getMealCard = (meal: Meal, time: string) => {
    // Gérer les deux formats : plan par défaut et plan généré par IA
    const mealName = meal.name || meal.nom || `Repas ${time}`;
    const mealEmoji = meal.emoji || '🍽️';
    const mealIngredients = meal.ingredients || [];
    const mealTime = meal.temps || '30 min';
    
    return (
      <div key={time} className="bg-gradient-to-br from-[#3a3a3a] to-[#2d2d2d] rounded-xl p-4 border border-gray-600 hover:border-[#3b82f6] transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{mealEmoji}</span>
            <h4 className="text-[#3b82f6] font-bold text-lg">{mealName}</h4>
          </div>
          {mealTime && <span className="text-xs bg-[#3b82f6] text-white px-2 py-1 rounded">{mealTime}</span>}
        </div>
        <div className="space-y-1">
          <p className="text-gray-400 text-sm font-medium">Ingrédients:</p>
          <ul className="space-y-1">
            {mealIngredients.map((ingredient: string, index: number) => (
              <li key={index} className="text-[#b0b0b0] text-sm flex items-center gap-2">
                <span className="text-[#3b82f6] text-xs">•</span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Si pas de préférences, rediriger vers la page de préférences
  if (!preferences) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            🍽️ Configuration Requise
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Veuillez dVeuillez d abord configurerapos;abord configurer vos préférences alimentaires
          </p>
          <Link 
            href="/preferences"
            className="bg-gradient-to-r from-[#3b82f6] to-[#64748b] text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            🚀 Configurer mes préférences
          </Link>
        </div>
      </div>
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
          
          <Link
            href="/preferences"
            className="bg-gradient-to-r from-[#3b82f6] to-[#64748b] text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 mb-6 inline-block"
          >
            🤖 Configurer et générer avec l&apos;IA
          </Link>
          
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Petit-déjeuner */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    🌅 Petit-déjeuner
                  </h3>
                  {getMealCard(weeklyMealPlan[selectedDay]?.matin, "matin")}
                </div>

                {/* Déjeuner */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    ☀️ Déjeuner
                  </h3>
                  {getMealCard(weeklyMealPlan[selectedDay]?.midi, "midi")}
                </div>

                {/* Dîner */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    🌙 Dîner
                  </h3>
                  {getMealCard(weeklyMealPlan[selectedDay]?.soir, "soir")}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {weeklyMealPlan && (
            <button className="bg-gradient-to-r from-[#3b82f6] to-[#64748b] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              🛒 Ajouter à la liste de courses
            </button>
          )}
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
