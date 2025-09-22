"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PreferencesPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState({
    dietType: "",
    allergies: [] as string[],
    dislikes: [] as string[],
    numberOfPeople: 1,
    budget: "moyen",
    cookingTime: "moyen"
  });

  const [customAllergy, setCustomAllergy] = useState("");
  const [customDislike, setCustomDislike] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const dietTypes = [
    { value: "omnivore", label: "🥩 Omnivore", description: "Mange de tout" },
    { value: "vegetarian", label: "🥗 Végétarien", description: "Pas de viande ni poisson" },
    { value: "vegan", label: "🌱 Végan", description: "Pas de produits animaux" },
    { value: "pescatarian", label: "🐟 Pescatarien", description: "Végétarien + poisson" },
    { value: "keto", label: "🥓 Keto", description: "Riche en lipides, pauvre en glucides" },
    { value: "paleo", label: "🦴 Paléo", description: "Aliments non transformés" }
  ];


  const budgetOptions = [
    { value: "économique", label: "💰 Économique", description: "Repas à petit budget" },
    { value: "moyen", label: "💳 Moyen", description: "Budget standard" },
    { value: "élevé", label: "💎 Élevé", description: "Budget premium" }
  ];

  const cookingTimeOptions = [
    { value: "rapide", label: "⚡ Rapide", description: "15-30 minutes" },
    { value: "moyen", label: "⏰ Moyen", description: "30-60 minutes" },
    { value: "long", label: "🍳 Long", description: "1h+ (plats mijotés)" }
  ];

  const handleDietChange = (diet: string) => {
    setPreferences(prev => ({ ...prev, dietType: diet }));
  };


  const addCustomAllergy = () => {
    if (customAllergy.trim() && !preferences.allergies.includes(customAllergy.trim())) {
      setPreferences(prev => ({
        ...prev,
        allergies: [...prev.allergies, customAllergy.trim()]
      }));
      setCustomAllergy("");
    }
  };

  const addCustomDislike = () => {
    if (customDislike.trim() && !preferences.dislikes.includes(customDislike.trim())) {
      setPreferences(prev => ({
        ...prev,
        dislikes: [...prev.dislikes, customDislike.trim()]
      }));
      setCustomDislike("");
    }
  };

  const removeCustomItem = (item: string, type: 'allergy' | 'dislike') => {
    if (type === 'allergy') {
      setPreferences(prev => ({
        ...prev,
        allergies: prev.allergies.filter(a => a !== item)
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        dislikes: prev.dislikes.filter(d => d !== item)
      }));
    }
  };

  const handleSubmit = async () => {
    if (!preferences.dietType) return;
    
    setIsGenerating(true);
    
    try {
      // Générer le plan avec l'IA
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      const data = await response.json();
      
      if (data.success && data.mealPlan) {
        // Sauvegarder les préférences et le plan généré
        localStorage.setItem('mealPreferences', JSON.stringify(preferences));
        localStorage.setItem('generatedMealPlan', JSON.stringify(data.mealPlan));
        
        // Rediriger vers la page de planification
        router.push('/planification');
      } else {
        alert('Erreur lors de la génération du plan: ' + (data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion à l\'API');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🍽️ Vos Préférences Alimentaires
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Personnalisez votre planning de repas selon vos goûts et contraintes
          </p>
        </div>

        <div className="bg-[#2a2a2a] rounded-2xl p-8 shadow-xl space-y-8">
          {/* Type de régime */}
          <section>
            <h2 className="text-2xl font-bold text-[#3b82f6] mb-4">
              🥗 Type de Régime Alimentaire
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dietTypes.map((diet) => (
                <button
                  key={diet.value}
                  onClick={() => handleDietChange(diet.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    preferences.dietType === diet.value
                      ? "border-[#3b82f6] bg-[#3b82f6]/10"
                      : "border-gray-600 hover:border-[#3b82f6]/50"
                  }`}
                >
                  <div className="font-bold text-white text-lg">{diet.label}</div>
                  <div className="text-gray-400 text-sm">{diet.description}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Allergies */}
          <section>
            <h2 className="text-2xl font-bold text-[#3b82f6] mb-4">
              ⚠️ Allergies Alimentaires
            </h2>
            
            {/* Ajout d'allergie personnalisée */}
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">Ajouter vos allergies</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAllergy}
                  onChange={(e) => setCustomAllergy(e.target.value)}
                  placeholder="Ex: Gluten, Lactose, Noix, Arachides, Œufs..."
                  className="flex-1 px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#3b82f6] focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
                />
                <button
                  onClick={addCustomAllergy}
                  className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
                >
                  Ajouter
                </button>
              </div>
              
              {/* Liste des allergies */}
              {preferences.allergies.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-2">Vos allergies :</p>
                  <div className="flex flex-wrap gap-2">
                    {preferences.allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-sm flex items-center gap-2"
                      >
                        {allergy}
                        <button
                          onClick={() => removeCustomItem(allergy, 'allergy')}
                          className="text-red-400 hover:text-red-300 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Aliments détestés */}
          <section>
            <h2 className="text-2xl font-bold text-[#3b82f6] mb-4">
              🚫 Aliments à Éviter
            </h2>
            
            {/* Ajout d'aliment à éviter personnalisé */}
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">Ajouter des aliments à éviter</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customDislike}
                  onChange={(e) => setCustomDislike(e.target.value)}
                  placeholder="Ex: Épinards, Brocolis, Champignons, Oignons..."
                  className="flex-1 px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#3b82f6] focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomDislike()}
                />
                <button
                  onClick={addCustomDislike}
                  className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
                >
                  Ajouter
                </button>
              </div>
              
              {/* Liste des aliments à éviter */}
              {preferences.dislikes.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-2">Aliments à éviter :</p>
                  <div className="flex flex-wrap gap-2">
                    {preferences.dislikes.map((dislike) => (
                      <span
                        key={dislike}
                        className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-400 text-sm flex items-center gap-2"
                      >
                        {dislike}
                        <button
                          onClick={() => removeCustomItem(dislike, 'dislike')}
                          className="text-orange-400 hover:text-orange-300 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Nombre de personnes */}
          <section>
            <h2 className="text-2xl font-bold text-[#3b82f6] mb-4">
              👥 Nombre de Personnes
            </h2>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setPreferences(prev => ({ ...prev, numberOfPeople: Math.max(1, prev.numberOfPeople - 1) }))}
                className="bg-[#3b82f6] text-white w-10 h-10 rounded-lg font-bold hover:bg-[#2563eb] transition-colors"
              >
                -
              </button>
              <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
                {preferences.numberOfPeople}
              </span>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, numberOfPeople: Math.min(8, prev.numberOfPeople + 1) }))}
                className="bg-[#3b82f6] text-white w-10 h-10 rounded-lg font-bold hover:bg-[#2563eb] transition-colors"
              >
                +
              </button>
            </div>
          </section>

          {/* Budget */}
          <section>
            <h2 className="text-2xl font-bold text-[#3b82f6] mb-4">
              💰 Budget
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budgetOptions.map((budget) => (
                <button
                  key={budget.value}
                  onClick={() => setPreferences(prev => ({ ...prev, budget: budget.value }))}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    preferences.budget === budget.value
                      ? "border-[#3b82f6] bg-[#3b82f6]/10"
                      : "border-gray-600 hover:border-[#3b82f6]/50"
                  }`}
                >
                  <div className="font-bold text-white text-lg">{budget.label}</div>
                  <div className="text-gray-400 text-sm">{budget.description}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Temps de cuisine */}
          <section>
            <h2 className="text-2xl font-bold text-[#3b82f6] mb-4">
              ⏱️ Temps de Cuisine Disponible
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cookingTimeOptions.map((time) => (
                <button
                  key={time.value}
                  onClick={() => setPreferences(prev => ({ ...prev, cookingTime: time.value }))}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    preferences.cookingTime === time.value
                      ? "border-[#3b82f6] bg-[#3b82f6]/10"
                      : "border-gray-600 hover:border-[#3b82f6]/50"
                  }`}
                >
                  <div className="font-bold text-white text-lg">{time.label}</div>
                  <div className="text-gray-400 text-sm">{time.description}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Résumé des préférences */}
          {preferences.dietType && (
            <section className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#3b82f6] mb-4">📋 Résumé de vos préférences</h3>
              <div className="space-y-2 text-gray-300">
                <p><strong>Régime:</strong> {dietTypes.find(d => d.value === preferences.dietType)?.label}</p>
                <p><strong>Personnes:</strong> {preferences.numberOfPeople}</p>
                <p><strong>Budget:</strong> {budgetOptions.find(b => b.value === preferences.budget)?.label}</p>
                <p><strong>Temps de cuisine:</strong> {cookingTimeOptions.find(t => t.value === preferences.cookingTime)?.label}</p>
                {preferences.allergies.length > 0 && (
                  <div>
                    <p><strong>Allergies:</strong></p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {preferences.allergies.map((allergy) => (
                        <span
                          key={allergy}
                          className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {preferences.dislikes.length > 0 && (
                  <div>
                    <p><strong>À éviter:</strong></p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {preferences.dislikes.map((dislike) => (
                        <span
                          key={dislike}
                          className="px-2 py-1 rounded text-xs bg-orange-500/20 text-orange-400"
                        >
                          {dislike}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={handleSubmit}
            disabled={!preferences.dietType || isGenerating}
            className="bg-gradient-to-r from-[#3b82f6] to-[#64748b] text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Génération en cours...
              </span>
            ) : (
              '🚀 Générer mon Planning'
            )}
          </button>
          <Link 
            href="/" 
            className="bg-gradient-to-r from-[#6b7280] to-[#4b5563] text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            ← Retour à l accueil
          </Link>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
