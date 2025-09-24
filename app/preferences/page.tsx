"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function PreferencesPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [preferences, setPreferences] = useState({
    dietType: "",
    allergies: [] as string[],
    dislikes: [] as string[],
    budget: "medium",
    cookingTime: "medium"
  });

  const [customAllergy, setCustomAllergy] = useState("");
  const [customDislike, setCustomDislike] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationTime, setGenerationTime] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');

  const dietTypes = [
    { value: "omnivore", label: "🥩 Omnivore", description: "Eats everything" },
    { value: "vegetarian", label: "🥗 Vegetarian", description: "No meat or fish" },
    { value: "vegan", label: "🌱 Vegan", description: "No animal products" },
    { value: "pescatarian", label: "🐟 Pescatarian", description: "Vegetarian + fish" }
  ];


  const budgetOptions = [
    { value: "low", label: "💰 Low", description: "Budget-friendly meals" },
    { value: "medium", label: "💳 Medium", description: "Standard budget" },
    { value: "high", label: "💎 High", description: "Premium budget" }
  ];

  const cookingTimeOptions = [
    { value: "quick", label: "⚡ Quick", description: "15-30 minutes" },
    { value: "medium", label: "⏰ Medium", description: "30-60 minutes" },
    { value: "long", label: "🍳 Long", description: "1h+ (slow-cooked dishes)" }
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
    setGenerationProgress(0);
    setGenerationTime(0);
    setGenerationStatus('Initializing...');

    // Démarrer le timer
    const startTime = Date.now();
    const timer = setInterval(() => {
      setGenerationTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    try {
      setGenerationStatus('Saving preferences...');
      setGenerationProgress(10);
      
      // Sauvegarder les préférences en base de données
      const preferencesResponse = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          preferences: {
            ...preferences,
            numberOfPeople: 1
          }
        }),
      });

      if (!preferencesResponse.ok) {
        throw new Error('Error saving preferences');
      }

      setGenerationStatus('Generating meal plan with AI...');
      setGenerationProgress(30);

      // Générer le plan avec l'IA (API simple et fiable)
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          preferences: {
            ...preferences,
            numberOfPeople: 1
          },
          token
        }),
      });

      setGenerationStatus('Processing AI response...');
      setGenerationProgress(70);

      const data = await response.json();
      console.log('Generated meal plan data:', data);
      
      if (data.success && data.mealPlan) {
        setGenerationStatus('Saving meal plan...');
        setGenerationProgress(90);

        console.log('Preparing to save meal plan...');
        console.log('Preferences:', preferences);
        console.log('Meal plan keys:', Object.keys(data.mealPlan));
        console.log('Sample day structure (monday):', data.mealPlan.monday);
        
        // Validate meal plan structure
        const hasValidStructure = Object.values(data.mealPlan).every((day: unknown) => 
          day && typeof day === 'object' && day !== null &&
          ('morning' in day || 'matin' in day) && 
          ('lunch' in day || 'midi' in day || 'noon' in day) && 
          ('dinner' in day || 'soir' in day || 'evening' in day)
        );
        console.log('Meal plan has valid structure:', hasValidStructure);

        // Sauvegarder le plan généré en base de données
        const saveResponse = await fetch('/api/meal-plans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ preferences, mealPlan: data.mealPlan }),
        });

        console.log('Save response status:', saveResponse.status);
        console.log('Save response headers:', Object.fromEntries(saveResponse.headers));

        if (saveResponse.ok) {
          const saveData = await saveResponse.json();
          console.log('Save success data:', saveData);
          
          setGenerationStatus('Meal plan generated successfully!');
          setGenerationProgress(100);
          
          // Attendre un peu pour que l'utilisateur voie le 100%
          setTimeout(() => {
            router.push('/planification');
          }, 1000);
        } else {
          // Obtenir le détail de l'erreur
          try {
            const errorData = await saveResponse.json();
            console.error('Save error details:', errorData);
            console.error('Response status:', saveResponse.status);
            console.error('Response statusText:', saveResponse.statusText);
            alert('Error saving meal plan: ' + (errorData.message || `Status: ${saveResponse.status} - ${saveResponse.statusText}`));
          } catch (jsonError) {
            console.error('Error parsing error response:', jsonError);
            const errorText = await saveResponse.text();
            console.error('Raw error response:', errorText);
            alert('Error saving meal plan: Unable to parse server response. Status: ' + saveResponse.status);
          }
        }
      } else {
        console.error('Generation failed:', data);
        alert('Error generating meal plan: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      setGenerationStatus('Error during generation');
      alert('API connection error');
    } finally {
      clearInterval(timer);
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
            🍽️ Your Dietary Preferences
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Customize your meal plan according to your tastes and constraints
          </p>
        </div>

        <div className="bg-[#2a2a2a] rounded-2xl p-8 shadow-xl space-y-8">
          {/* Type de régime */}
          <section>
            <h2 className="text-2xl font-bold text-[#3b82f6] mb-4">
              🥗 Dietary Type
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
              ⚠️ Food Allergies
            </h2>
            
            {/* Ajout d'allergie personnalisée */}
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">Add your allergies</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAllergy}
                  onChange={(e) => setCustomAllergy(e.target.value)}
                  placeholder="Ex: Gluten, Lactose, Nuts, Peanuts, Eggs..."
                  className="flex-1 px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#3b82f6] focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
                />
                <button
                  onClick={addCustomAllergy}
                  className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
                >
                  Add
                </button>
              </div>
              
              {/* Liste des allergies */}
              {preferences.allergies.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-2">Your allergies:</p>
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
              🚫 Foods to Avoid
            </h2>
            
            {/* Ajout d'aliment à éviter personnalisé */}
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">Add foods to avoid</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customDislike}
                  onChange={(e) => setCustomDislike(e.target.value)}
                  placeholder="Ex: Spinach, Broccoli, Mushrooms, Onions..."
                  className="flex-1 px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#3b82f6] focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomDislike()}
                />
                <button
                  onClick={addCustomDislike}
                  className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
                >
                  Add
                </button>
              </div>
              
              {/* Liste des aliments à éviter */}
              {preferences.dislikes.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-2">Foods to avoid:</p>
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
              ⏱️ Available Cooking Time
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
              <h3 className="text-xl font-bold text-[#3b82f6] mb-4">📋 Summary of your preferences</h3>
              <div className="space-y-2 text-gray-300">
                <p><strong>Diet:</strong> {dietTypes.find(d => d.value === preferences.dietType)?.label}</p>
                <p><strong>People:</strong> 1 (adjustable per recipe)</p>
                <p><strong>Budget:</strong> {budgetOptions.find(b => b.value === preferences.budget)?.label}</p>
                <p><strong>Cooking time:</strong> {cookingTimeOptions.find(t => t.value === preferences.cookingTime)?.label}</p>
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
                    <p><strong>To avoid:</strong></p>
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
                Generating...
              </span>
            ) : (
              '🚀 Generate My Meal Plan'
            )}
          </button>
          <Link 
            href="/" 
            className="bg-gradient-to-r from-[#6b7280] to-[#4b5563] text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Indicateur de progression détaillé */}
        {isGenerating && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                {generationStatus}
              </h3>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-[#3b82f6] to-[#10b981] h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              
              {/* Pourcentage et temps */}
              <div className="flex justify-between items-center text-sm text-gray-300">
                <span>{generationProgress}%</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {generationTime}s
                </span>
              </div>
              
              {/* Message d'information */}
              <p className="text-gray-400 text-sm mt-3">
                {generationProgress < 30 && "AI is analyzing your preferences..."}
                {generationProgress >= 30 && generationProgress < 70 && "AI is generating your personalized meal plan..."}
                {generationProgress >= 70 && generationProgress < 90 && "Processing data..."}
                {generationProgress >= 90 && generationProgress < 100 && "Finalizing..."}
                {generationProgress === 100 && "Done! Redirecting..."}
              </p>
            </div>
          </div>
        )}
      </div>
      </div>
    </ProtectedRoute>
  );
}
