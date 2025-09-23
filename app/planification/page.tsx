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

  // Translation function for day names (display only)
  const translateDayForDisplay = (frenchDay: string): string => {
    const dayTranslations: { [key: string]: string } = {
      'lundi': 'Monday',
      'mardi': 'Tuesday', 
      'mercredi': 'Wednesday',
      'jeudi': 'Thursday',
      'vendredi': 'Friday',
      'samedi': 'Saturday',
      'dimanche': 'Sunday'
    };
    return dayTranslations[frenchDay] || frenchDay;
  };

  const loadUserData = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Load preferences from database
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

      // Load AI-generated plan from database
      const mealPlanResponse = await fetch('/api/meal-plans', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (mealPlanResponse.ok) {
        const mealPlanData = await mealPlanResponse.json();
        if (mealPlanData.success) {
          console.log('Meal plan loaded:', mealPlanData.mealPlan);
          setGeneratedPlan(mealPlanData.mealPlan);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData, refreshTrigger]);

  // Listen for meal plan changes from other pages
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'planningUpdated') {
        console.log('Meal plan updated via storage');
        setRefreshTrigger(prev => prev + 1);
        localStorage.removeItem('planningUpdated');
      }
    };

    const handlePlanningUpdate = () => {
      console.log('Meal plan updated via event');
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
        // Save the new AI-generated plan to database
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
          alert('Meal plan updated successfully!');
        } else {
          alert('Error updating meal plan');
        }
      } else {
        alert('Error regenerating meal plan');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('API connection error');
    } finally {
      setIsGenerating(false);
    }
  };

  const weeklyMealPlan = generatedPlan;

  const days = weeklyMealPlan ? Object.keys(weeklyMealPlan) as string[] : [];

  const getMealCard = (meal: Meal, time: string, day: string) => {
    // Handle both formats: default plan and AI-generated plan
    const mealName = meal.name || meal.nom || `Meal ${time}`;
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
          <p className="text-gray-400 text-sm font-medium">Ingredients:</p>
          <ul className="space-y-1">
            {Array.isArray(mealIngredients) ? mealIngredients.slice(0, 3).map((ingredient: string | { amount?: string; unit?: string; name?: string }, index: number) => (
              <li key={index} className="text-[#b0b0b0] text-sm flex items-center gap-2">
                <span className="text-[#3b82f6] text-xs">•</span>
                {typeof ingredient === 'string' ? ingredient : `${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.name || ''}`.trim()}
              </li>
            )) : (
              <li className="text-[#b0b0b0] text-sm">No ingredients available</li>
            )}
            {Array.isArray(mealIngredients) && mealIngredients.length > 3 && (
              <li className="text-[#3b82f6] text-sm font-medium">
                +{mealIngredients.length - 3} more ingredients...
              </li>
            )}
          </ul>
        </div>
        <div className="mt-3 text-center border-t border-gray-600 pt-3">
          <span className="text-[#3b82f6] text-sm font-medium">Click to view details</span>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
            <p className="text-[#b0b0b0] text-lg">Loading your data...</p>
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
            🍽️ AI Meal Planning
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            Your personalized weekly meal plan with balanced meals for every day
          </p>
          
            <div className="flex gap-4 justify-center mb-6">
              <Link
                href="/preferences"
                className="bg-gradient-to-r from-[#3b82f6] to-[#64748b] text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 inline-block"
              >
                🤖 Configure and Generate with AI
              </Link>
              <button
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 inline-block"
              >
                🔄 Refresh
              </button>
            </div>
          
          {preferences && (
            <div className="mt-4 bg-[#2a2a2a] rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-[#3b82f6] font-medium">
                🎯 Diet: {preferences.dietType.charAt(0).toUpperCase() + preferences.dietType.slice(1)} • 
                👥 {preferences.numberOfPeople} person{preferences.numberOfPeople > 1 ? 's' : ''} • 
                💰 Budget {preferences.budget} • 
                ⏱️ Cooking {preferences.cookingTime}
              </p>
            </div>
          )}
        </div>

        {/* Empty state if no generated plan */}
        {!weeklyMealPlan ? (
          <div className="bg-[#2a2a2a] rounded-2xl p-12 shadow-xl text-center">
            <div className="text-6xl mb-6">🍽️</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              No Meal Plan Generated
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Click on &quot;🤖 Configure and Generate with AI&quot; to set up your dietary preferences and create your personalized meal plan.
            </p>
            <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md mx-auto mb-6">
              <h3 className="text-lg font-bold text-[#3b82f6] mb-3">💡 How does it work?</h3>
              <ul className="text-gray-300 text-sm space-y-2 text-left">
                <li>• Configure your dietary preferences</li>
                <li>• AI generates a personalized meal plan</li>
                <li>• Regenerate as many times as you want</li>
                <li>• Your meal plans are saved</li>
              </ul>
            </div>
            <Link
              href="/preferences"
              className="bg-gradient-to-r from-[#3b82f6] to-[#64748b] text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 inline-block"
            >
              🚀 Start Configuration
            </Link>
          </div>
        ) : (
          <>
            {/* Day navigation */}
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
                  {translateDayForDisplay(day)}
                </button>
              ))}
            </div>

            {/* Selected day meal plan */}
            <div className="bg-[#2a2a2a] rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-[#3b82f6] mb-6 text-center">
                📅 {translateDayForDisplay(selectedDay)}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ gridTemplateRows: '1fr' }}>
                {/* Breakfast */}
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    🌅 Breakfast
                  </h3>
                  <div className="flex-grow">
                    {getMealCard(weeklyMealPlan[selectedDay]?.matin, "matin", selectedDay)}
                  </div>
                </div>

                {/* Lunch */}
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    ☀️ Lunch
                  </h3>
                  <div className="flex-grow">
                    {getMealCard(weeklyMealPlan[selectedDay]?.midi, "midi", selectedDay)}
                  </div>
                </div>

                {/* Dinner */}
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    🌙 Dinner
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
                  Regenerating...
                </span>
              ) : (
                '🔄 Regenerate Meal Plan'
              )}
            </button>
          )}
          <Link 
            href="/" 
            className="bg-gradient-to-r from-[#6b7280] to-[#4b5563] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
