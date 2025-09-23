import React, { useState } from 'react';

interface RecipeData {
  id: string;
  title: string;
  description: string;
  image: string;
  emoji: string;
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface PlanningModalProps {
  recipe: RecipeData | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToPlanning: (recipeId: string, day: string, meal: string) => void;
}

const PlanningModal = ({ recipe, isOpen, onClose, onAddToPlanning }: PlanningModalProps) => {
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedMeal, setSelectedMeal] = useState('lunch');

  const days = [
    { value: 'monday', label: 'Lundi' },
    { value: 'tuesday', label: 'Mardi' },
    { value: 'wednesday', label: 'Mercredi' },
    { value: 'thursday', label: 'Jeudi' },
    { value: 'friday', label: 'Vendredi' },
    { value: 'saturday', label: 'Samedi' },
    { value: 'sunday', label: 'Dimanche' }
  ];

  const meals = [
    { value: 'morning', label: 'Matin', emoji: '🌅' },
    { value: 'lunch', label: 'Midi', emoji: '☀️' },
    { value: 'dinner', label: 'Soir', emoji: '🌙' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipe) {
      onAddToPlanning(recipe.id, selectedDay, selectedMeal);
      onClose();
    }
  };

  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl">{recipe.emoji}</div>
          <div>
            <h2 className="text-2xl font-bold text-white">{recipe.title}</h2>
            <p className="text-gray-400 text-sm">{recipe.category} • {recipe.prepTime}min</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-3">Choisir le jour</label>
            <div className="grid grid-cols-2 gap-2">
              {days.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => setSelectedDay(day.value)}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    selectedDay === day.value
                      ? 'bg-[#3b82f6] text-white'
                      : 'bg-[#404040] text-gray-300 hover:bg-[#505050]'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-3">Choisir le moment</label>
            <div className="space-y-2">
              {meals.map((meal) => (
                <button
                  key={meal.value}
                  type="button"
                  onClick={() => setSelectedMeal(meal.value)}
                  className={`w-full p-4 rounded-lg font-medium transition-all flex items-center gap-3 ${
                    selectedMeal === meal.value
                      ? 'bg-[#3b82f6] text-white'
                      : 'bg-[#404040] text-gray-300 hover:bg-[#505050]'
                  }`}
                >
                  <span className="text-xl">{meal.emoji}</span>
                  <span>{meal.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#6b7280] text-white rounded-lg font-medium hover:bg-[#5a6268] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
            >
              Ajouter au planning
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanningModal;
