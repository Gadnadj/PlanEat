"use client"
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PlanificationPage() {
  const [selectedDay, setSelectedDay] = useState<string>("lundi");
  const [preferences, setPreferences] = useState<{
    dietType: string;
    allergies: string[];
    dislikes: string[];
    numberOfPeople: number;
    budget: string;
    cookingTime: string;
  } | null>(null);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('mealPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const generateMealPlan = (dietType: string) => {
    const mealPlans = {
      omnivore: {
        lundi: {
          matin: { name: "Petit-déjeuner Continental", emoji: "🥐", ingredients: ["Croissants", "Confiture", "Café", "Jus d'orange"] },
          midi: { name: "Salade César au Poulet", emoji: "🥗", ingredients: ["Salade verte", "Poulet grillé", "Parmesan", "Croûtons"] },
          soir: { name: "Pâtes Carbonara", emoji: "🍝", ingredients: ["Pâtes", "Lardons", "Œufs", "Parmesan", "Crème"] }
        },
        mardi: {
          matin: { name: "Pancakes aux Myrtilles", emoji: "🥞", ingredients: ["Farine", "Œufs", "Lait", "Myrtilles", "Sirop d'érable"] },
          midi: { name: "Wrap au Poulet", emoji: "🌯", ingredients: ["Tortilla", "Poulet", "Avocat", "Tomates", "Laitue"] },
          soir: { name: "Saumon Grillé aux Légumes", emoji: "🐟", ingredients: ["Saumon", "Brocolis", "Carottes", "Citron", "Herbes"] }
        },
        mercredi: {
          matin: { name: "Smoothie Bowl", emoji: "🥤", ingredients: ["Banane", "Baies", "Granola", "Yaourt grec", "Miel"] },
          midi: { name: "Quiche Lorraine", emoji: "🥧", ingredients: ["Pâte brisée", "Œufs", "Lardons", "Crème", "Fromage"] },
          soir: { name: "Curry de Légumes", emoji: "🍛", ingredients: ["Riz", "Légumes variés", "Lait de coco", "Curry", "Épices"] }
        },
        jeudi: {
          matin: { name: "Omelette aux Herbes", emoji: "🍳", ingredients: ["Œufs", "Basilic", "Persil", "Tomates", "Pain grillé"] },
          midi: { name: "Bowl de Buddha", emoji: "🥗", ingredients: ["Quinoa", "Avocat", "Épinards", "Graines", "Vinaigrette"] },
          soir: { name: "Poulet Rôti aux Pommes de Terre", emoji: "🍗", ingredients: ["Poulet entier", "Pommes de terre", "Carottes", "Oignons", "Thym"] }
        },
        vendredi: {
          matin: { name: "Granola Maison", emoji: "🥣", ingredients: ["Flocons d'avoine", "Noix", "Miel", "Fruits secs", "Yaourt"] },
          midi: { name: "Burger Classique", emoji: "🍔", ingredients: ["Pain burger", "Steak haché", "Salade", "Tomate", "Sauce"] },
          soir: { name: "Pizza Margherita", emoji: "🍕", ingredients: ["Pâte à pizza", "Tomates", "Mozzarella", "Basilic", "Huile d'olive"] }
        },
        samedi: {
          matin: { name: "Brunch Anglais", emoji: "🥓", ingredients: ["Œufs brouillés", "Bacon", "Haricots", "Tomates", "Pain"] },
          midi: { name: "Tacos au Poisson", emoji: "🌮", ingredients: ["Tortillas", "Poisson blanc", "Chou", "Sauce", "Citron vert"] },
          soir: { name: "Risotto aux Champignons", emoji: "🍚", ingredients: ["Riz Arborio", "Champignons", "Bouillon", "Parmesan", "Vin blanc"] }
        },
        dimanche: {
          matin: { name: "Pain Perdu", emoji: "🍞", ingredients: ["Pain rassis", "Œufs", "Lait", "Cannelle", "Sirop"] },
          midi: { name: "Déjeuner Familial", emoji: "🍽️", ingredients: ["Rôti de bœuf", "Légumes rôtis", "Yorkshire pudding", "Sauce"] },
          soir: { name: "Soupe de Légumes", emoji: "🍲", ingredients: ["Légumes variés", "Bouillon", "Herbes", "Pain", "Fromage"] }
        }
      },
      vegetarian: {
        lundi: {
          matin: { name: "Avoine aux Fruits", emoji: "🥣", ingredients: ["Flocons d'avoine", "Banane", "Baies", "Lait végétal", "Miel"] },
          midi: { name: "Salade de Quinoa", emoji: "🥗", ingredients: ["Quinoa", "Épinards", "Tomates", "Avocat", "Vinaigrette"] },
          soir: { name: "Pâtes aux Légumes", emoji: "🍝", ingredients: ["Pâtes", "Courgettes", "Tomates", "Basilic", "Parmesan"] }
        },
        mardi: {
          matin: { name: "Pancakes Végétariens", emoji: "🥞", ingredients: ["Farine", "Œufs", "Lait végétal", "Myrtilles", "Sirop d'érable"] },
          midi: { name: "Wrap Végétarien", emoji: "🌯", ingredients: ["Tortilla", "Avocat", "Tomates", "Laitue", "Hummus"] },
          soir: { name: "Curry de Légumes", emoji: "🍛", ingredients: ["Riz", "Légumes variés", "Lait de coco", "Curry", "Épices"] }
        },
        mercredi: {
          matin: { name: "Smoothie Bowl Végétarien", emoji: "🥤", ingredients: ["Banane", "Baies", "Granola", "Yaourt grec", "Miel"] },
          midi: { name: "Quiche aux Légumes", emoji: "🥧", ingredients: ["Pâte brisée", "Œufs", "Épinards", "Tomates", "Fromage"] },
          soir: { name: "Risotto aux Légumes", emoji: "🍚", ingredients: ["Riz Arborio", "Légumes variés", "Bouillon", "Parmesan", "Herbes"] }
        },
        jeudi: {
          matin: { name: "Omelette aux Herbes", emoji: "🍳", ingredients: ["Œufs", "Basilic", "Persil", "Tomates", "Pain grillé"] },
          midi: { name: "Bowl de Buddha", emoji: "🥗", ingredients: ["Quinoa", "Avocat", "Épinards", "Graines", "Vinaigrette"] },
          soir: { name: "Gratin de Légumes", emoji: "🥔", ingredients: ["Pommes de terre", "Carottes", "Courgettes", "Fromage", "Crème"] }
        },
        vendredi: {
          matin: { name: "Granola Maison", emoji: "🥣", ingredients: ["Flocons d'avoine", "Noix", "Miel", "Fruits secs", "Yaourt"] },
          midi: { name: "Burger Végétarien", emoji: "🍔", ingredients: ["Pain burger", "Steak végétal", "Salade", "Tomate", "Sauce"] },
          soir: { name: "Pizza Végétarienne", emoji: "🍕", ingredients: ["Pâte à pizza", "Tomates", "Mozzarella", "Basilic", "Légumes"] }
        },
        samedi: {
          matin: { name: "Brunch Végétarien", emoji: "🥓", ingredients: ["Œufs brouillés", "Haricots", "Tomates", "Pain", "Avocat"] },
          midi: { name: "Tacos Végétariens", emoji: "🌮", ingredients: ["Tortillas", "Haricots", "Chou", "Sauce", "Avocat"] },
          soir: { name: "Risotto aux Champignons", emoji: "🍚", ingredients: ["Riz Arborio", "Champignons", "Bouillon", "Parmesan", "Herbes"] }
        },
        dimanche: {
          matin: { name: "Pain Perdu", emoji: "🍞", ingredients: ["Pain rassis", "Œufs", "Lait végétal", "Cannelle", "Sirop"] },
          midi: { name: "Déjeuner Végétarien", emoji: "🍽️", ingredients: ["Quiche", "Légumes rôtis", "Salade", "Vinaigrette"] },
          soir: { name: "Soupe de Légumes", emoji: "🍲", ingredients: ["Légumes variés", "Bouillon", "Herbes", "Pain", "Fromage"] }
        }
      },
      vegan: {
        lundi: {
          matin: { name: "Avoine aux Fruits", emoji: "🥣", ingredients: ["Flocons d'avoine", "Banane", "Baies", "Lait d'amande", "Miel"] },
          midi: { name: "Salade de Quinoa", emoji: "🥗", ingredients: ["Quinoa", "Épinards", "Tomates", "Avocat", "Vinaigrette"] },
          soir: { name: "Pâtes aux Légumes", emoji: "🍝", ingredients: ["Pâtes", "Courgettes", "Tomates", "Basilic", "Levure nutritionnelle"] }
        },
        mardi: {
          matin: { name: "Pancakes Végan", emoji: "🥞", ingredients: ["Farine", "Lait d'avoine", "Banane", "Myrtilles", "Sirop d'érable"] },
          midi: { name: "Wrap Végan", emoji: "🌯", ingredients: ["Tortilla", "Avocat", "Tomates", "Laitue", "Hummus"] },
          soir: { name: "Curry de Légumes", emoji: "🍛", ingredients: ["Riz", "Légumes variés", "Lait de coco", "Curry", "Épices"] }
        },
        mercredi: {
          matin: { name: "Smoothie Bowl Végan", emoji: "🥤", ingredients: ["Banane", "Baies", "Granola", "Yaourt de coco", "Miel"] },
          midi: { name: "Quiche Végane", emoji: "🥧", ingredients: ["Pâte brisée", "Tofu", "Épinards", "Tomates", "Levure nutritionnelle"] },
          soir: { name: "Risotto Végan", emoji: "🍚", ingredients: ["Riz Arborio", "Légumes variés", "Bouillon", "Levure nutritionnelle", "Herbes"] }
        },
        jeudi: {
          matin: { name: "Tofu Brouillé", emoji: "🍳", ingredients: ["Tofu", "Basilic", "Persil", "Tomates", "Pain grillé"] },
          midi: { name: "Bowl de Buddha", emoji: "🥗", ingredients: ["Quinoa", "Avocat", "Épinards", "Graines", "Vinaigrette"] },
          soir: { name: "Gratin de Légumes Végan", emoji: "🥔", ingredients: ["Pommes de terre", "Carottes", "Courgettes", "Crème de coco", "Herbes"] }
        },
        vendredi: {
          matin: { name: "Granola Végan", emoji: "🥣", ingredients: ["Flocons d'avoine", "Noix", "Miel", "Fruits secs", "Yaourt de coco"] },
          midi: { name: "Burger Végan", emoji: "🍔", ingredients: ["Pain burger", "Steak végétal", "Salade", "Tomate", "Sauce végane"] },
          soir: { name: "Pizza Végane", emoji: "🍕", ingredients: ["Pâte à pizza", "Tomates", "Fromage végan", "Basilic", "Légumes"] }
        },
        samedi: {
          matin: { name: "Brunch Végan", emoji: "🥓", ingredients: ["Tofu brouillé", "Haricots", "Tomates", "Pain", "Avocat"] },
          midi: { name: "Tacos Végan", emoji: "🌮", ingredients: ["Tortillas", "Haricots", "Chou", "Sauce", "Avocat"] },
          soir: { name: "Risotto Végan", emoji: "🍚", ingredients: ["Riz Arborio", "Champignons", "Bouillon", "Levure nutritionnelle", "Herbes"] }
        },
        dimanche: {
          matin: { name: "Pain Perdu Végan", emoji: "🍞", ingredients: ["Pain rassis", "Lait d'avoine", "Cannelle", "Sirop", "Banane"] },
          midi: { name: "Déjeuner Végan", emoji: "🍽️", ingredients: ["Quiche végane", "Légumes rôtis", "Salade", "Vinaigrette"] },
          soir: { name: "Soupe de Légumes", emoji: "🍲", ingredients: ["Légumes variés", "Bouillon", "Herbes", "Pain", "Levure nutritionnelle"] }
        }
      },
      pescatarian: {
        lundi: {
          matin: { name: "Avoine aux Fruits", emoji: "🥣", ingredients: ["Flocons d'avoine", "Banane", "Baies", "Lait végétal", "Miel"] },
          midi: { name: "Salade de Quinoa", emoji: "🥗", ingredients: ["Quinoa", "Épinards", "Tomates", "Avocat", "Vinaigrette"] },
          soir: { name: "Saumon Grillé aux Légumes", emoji: "🐟", ingredients: ["Saumon", "Brocolis", "Carottes", "Citron", "Herbes"] }
        },
        mardi: {
          matin: { name: "Pancakes aux Fruits", emoji: "🥞", ingredients: ["Farine", "Œufs", "Lait végétal", "Myrtilles", "Sirop d'érable"] },
          midi: { name: "Wrap au Thon", emoji: "🌯", ingredients: ["Tortilla", "Thon", "Avocat", "Tomates", "Laitue"] },
          soir: { name: "Curry de Légumes", emoji: "🍛", ingredients: ["Riz", "Légumes variés", "Lait de coco", "Curry", "Épices"] }
        },
        mercredi: {
          matin: { name: "Smoothie Bowl", emoji: "🥤", ingredients: ["Banane", "Baies", "Granola", "Yaourt grec", "Miel"] },
          midi: { name: "Quiche aux Légumes", emoji: "🥧", ingredients: ["Pâte brisée", "Œufs", "Épinards", "Tomates", "Fromage"] },
          soir: { name: "Risotto aux Fruits de Mer", emoji: "🍚", ingredients: ["Riz Arborio", "Fruits de mer", "Bouillon", "Parmesan", "Herbes"] }
        },
        jeudi: {
          matin: { name: "Omelette aux Herbes", emoji: "🍳", ingredients: ["Œufs", "Basilic", "Persil", "Tomates", "Pain grillé"] },
          midi: { name: "Bowl de Buddha", emoji: "🥗", ingredients: ["Quinoa", "Avocat", "Épinards", "Graines", "Vinaigrette"] },
          soir: { name: "Poisson en Papillote", emoji: "🐟", ingredients: ["Poisson blanc", "Légumes", "Citron", "Herbes", "Huile d'olive"] }
        },
        vendredi: {
          matin: { name: "Granola Maison", emoji: "🥣", ingredients: ["Flocons d'avoine", "Noix", "Miel", "Fruits secs", "Yaourt"] },
          midi: { name: "Burger de Poisson", emoji: "🍔", ingredients: ["Pain burger", "Steak de poisson", "Salade", "Tomate", "Sauce"] },
          soir: { name: "Pizza aux Fruits de Mer", emoji: "🍕", ingredients: ["Pâte à pizza", "Tomates", "Mozzarella", "Fruits de mer", "Basilic"] }
        },
        samedi: {
          matin: { name: "Brunch Pescatarien", emoji: "🥓", ingredients: ["Œufs brouillés", "Saumon fumé", "Tomates", "Pain", "Avocat"] },
          midi: { name: "Tacos au Poisson", emoji: "🌮", ingredients: ["Tortillas", "Poisson blanc", "Chou", "Sauce", "Citron vert"] },
          soir: { name: "Risotto aux Champignons", emoji: "🍚", ingredients: ["Riz Arborio", "Champignons", "Bouillon", "Parmesan", "Herbes"] }
        },
        dimanche: {
          matin: { name: "Pain Perdu", emoji: "🍞", ingredients: ["Pain rassis", "Œufs", "Lait végétal", "Cannelle", "Sirop"] },
          midi: { name: "Déjeuner Pescatarien", emoji: "🍽️", ingredients: ["Poisson rôti", "Légumes rôtis", "Salade", "Vinaigrette"] },
          soir: { name: "Soupe de Poisson", emoji: "🍲", ingredients: ["Poisson blanc", "Légumes", "Bouillon", "Herbes", "Pain"] }
        }
      }
    };

    return mealPlans[dietType as keyof typeof mealPlans] || mealPlans.omnivore;
  };

  const weeklyMealPlan = preferences ? generateMealPlan(preferences.dietType) : generateMealPlan('omnivore');

  const days = Object.keys(weeklyMealPlan) as Array<keyof typeof weeklyMealPlan>;

  const getMealCard = (meal: { name: string; emoji: string; ingredients: string[] }, time: string) => (
    <div key={time} className="bg-gradient-to-br from-[#3a3a3a] to-[#2d2d2d] rounded-xl p-4 border border-gray-600 hover:border-[#3b82f6] transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{meal.emoji}</span>
        <h4 className="text-[#3b82f6] font-bold text-lg">{meal.name}</h4>
      </div>
      <div className="space-y-1">
        <p className="text-gray-400 text-sm font-medium">Ingrédients:</p>
        <ul className="space-y-1">
          {meal.ingredients.map((ingredient: string, index: number) => (
            <li key={index} className="text-[#b0b0b0] text-sm flex items-center gap-2">
              <span className="text-[#3b82f6] text-xs">•</span>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

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
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🍽️ Planning des Repas IA
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Votre planning hebdomadaire personnalisé avec des repas équilibrés pour chaque jour
          </p>
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
              {day.charAt(0).toUpperCase() + day.slice(1)}
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
              {getMealCard(weeklyMealPlan[selectedDay as keyof typeof weeklyMealPlan].matin, "matin")}
            </div>

            {/* Déjeuner */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                ☀️ Déjeuner
              </h3>
              {getMealCard(weeklyMealPlan[selectedDay as keyof typeof weeklyMealPlan].midi, "midi")}
            </div>

            {/* Dîner */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🌙 Dîner
              </h3>
              {getMealCard(weeklyMealPlan[selectedDay as keyof typeof weeklyMealPlan].soir, "soir")}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button className="bg-gradient-to-r from-[#3b82f6] to-[#64748b] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            🛒 Ajouter à la liste de courses
          </button>
          <button className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            🔄 Régénérer le planning
          </button>
          <Link 
            href="/" 
            className="bg-gradient-to-r from-[#6b7280] to-[#4b5563] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            ← Retour à l accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
