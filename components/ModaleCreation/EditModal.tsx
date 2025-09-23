import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

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
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

type Props = {
  recipe: RecipeData;
  onClose: () => void;
  onRecipeUpdated: () => void;
}

const EditModal = ({ recipe, onClose, onRecipeUpdated }: Props) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form state - initialize with recipe data
  const [formData, setFormData] = useState({
    title: recipe.title,
    description: recipe.description,
    category: recipe.category,
    prepTime: recipe.prepTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    calories: recipe.nutrition.calories,
    protein: recipe.nutrition.protein,
    carbs: recipe.nutrition.carbs,
    fat: recipe.nutrition.fat,
    emoji: recipe.emoji
  });

  const [tags, setTags] = useState<string[]>(recipe.tags);
  const [newTag, setNewTag] = useState('');
  const [ingredients, setIngredients] = useState<{ name: string, amount: string, unit: string }[]>(recipe.ingredients);
  const [newIngredient, setNewIngredient] = useState({ name: '', amount: '', unit: '' });
  const [instructions, setInstructions] = useState<string[]>(recipe.instructions);
  const [newInstruction, setNewInstruction] = useState('');

  // Style constants
  const formSection = 'mb-8';
  const formRow = 'flex gap-4 mb-4 max-md:flex-col';
  const formGroup = 'flex-1';
  const formLabel = 'block mb-2 text-[#b0b0b0] font-medium';
  const formInput = 'w-full px-4 py-[0.8rem] bg-[#3a3a3a] border-2 border-solid border-[#404040] rounded-[10px] text-[#e0e0e0] text-[1rem] transition-colors duration-300 ease-in-out focus:outline-none focus:border-[#3b82f6]';
  const formSelect = formInput;
  const formTextArea = formInput;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addIngredient = () => {
    if (newIngredient.name.trim() && newIngredient.amount.trim()) {
      setIngredients([...ingredients, { ...newIngredient, name: newIngredient.name.trim(), amount: newIngredient.amount.trim() }]);
      setNewIngredient({ name: '', amount: '', unit: '' });
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert('Please log in to edit a recipe');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || ingredients.length === 0 || instructions.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/recipes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: recipe.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          prepTime: formData.prepTime,
          servings: formData.servings,
          difficulty: formData.difficulty,
          emoji: formData.emoji,
          tags,
          ingredients,
          instructions,
          nutrition: {
            calories: formData.calories,
            protein: formData.protein,
            carbs: formData.carbs,
            fat: formData.fat
          }
        })
      });

      if (response.ok) {
        alert('Recipe updated successfully!');
        onRecipeUpdated();
        onClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Unable to update recipe'}`);
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Error updating recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black/90 flex items-center justify-center z-[1001] p-8 max-md:p-4'>
      <div className='bg-linear-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-[20px] w-full max-w-[800px] max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-[#404040] relative'>
        {/* Header */}
        <div className='bg-linear-to-br from-[#10b981] to-[#059669] px-8 py-6 rounded-t-[20px] text-white flex justify-between items-center'>
          <h2 className='text-[1.5rem] font-bold m-0'>✏️ Edit Recipe</h2>
          <button
            onClick={onClose}
            className='bg-none border-none text-white text-[1.5rem] cursor-pointer p-2 rounded-full transition-colors duration-300 ease-in-out hover:bg-[rgba(255,255,255,0.2)]'
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className='p-8 text-[#e0e0e0] max-md:p-6'>
          <form id="edit-recipe-form" onSubmit={handleSubmit}>
            {/* Infos générales */}
            <div className={formSection}>
              <h3 className='text-[#3b82f6] mb-4 text-[1.2rem] flex items-center gap-2'>📝 General Information</h3>
              <div className={formRow}>
                <div className={formGroup}>
                  <label className={formLabel}>Recipe Name *</label>
                  <input
                    className={formInput}
                    type="text"
                    placeholder='Ex: Caesar Salad'
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                <div className={formGroup}>
                  <label className={formLabel}>Category</label>
                  <select
                    className={formSelect}
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option>Appetizer</option>
                    <option>Main Course</option>
                    <option>Dessert</option>
                    <option>Beverage</option>
                    <option>Side Dish</option>
                  </select>
                </div>
              </div>

              <div className={formRow}>
                <div className={formGroup}>
                  <label className={formLabel}>Preparation Time (min)</label>
                  <input
                    className={formInput}
                    type="number"
                    placeholder='15'
                    min={1}
                    value={formData.prepTime}
                    onChange={(e) => handleInputChange('prepTime', parseInt(e.target.value))}
                  />
                </div>
                <div className={formGroup}>
                  <label className={formLabel}>Number of Servings</label>
                  <input
                    className={formInput}
                    type="number"
                    placeholder='4'
                    min={1}
                    value={formData.servings}
                    onChange={(e) => handleInputChange('servings', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className={formRow}>
                <div className={formGroup}>
                  <label className={formLabel}>Difficulty</label>
                  <select
                    className={formSelect}
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className={formGroup}>
                  <label className={formLabel}>Calories per Serving</label>
                  <input
                    className={formInput}
                    type="number"
                    placeholder='350'
                    min={0}
                    value={formData.calories}
                    onChange={(e) => handleInputChange('calories', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className={formGroup}>
                <label className={formLabel}>Description *</label>
                <textarea
                  className={formTextArea}
                  placeholder='Describe your recipe in a few words...'
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            {/* Tags */}
            <div className={formSection}>
              <h3 className='text-[#3b82f6] mb-4 text-[1.2rem]'>🏷️ Tags</h3>
              <div className={formGroup}>
                <label className={formLabel}>Add Tags</label>
                <div className='flex flex-wrap gap-2 px-4 py-2 bg-[#3a3a3a] border-2 border-[#404040] rounded-[10px] min-h-[40px] cursor-text focus-within:border-[#3b82f6]'>
                  {tags.map((tag, index) => (
                    <span key={index} className='bg-[#3b82f6] text-white px-2 py-1 rounded text-sm flex items-center gap-1'>
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className='text-white hover:text-red-300'>×</button>
                    </span>
                  ))}
                  <input
                    className='bg-transparent flex-1 outline-none text-[#e0e0e0]'
                    type="text"
                    placeholder='Type a tag...'
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                </div>
                <button type="button" onClick={addTag} className='bg-[#404040] text-[#e0e0e0] px-4 py-2 rounded text-sm mt-2 hover:bg-[#505050]'>
                  + Add Tag
                </button>
              </div>
            </div>

            {/* Ingrédients */}
            <div className={formSection}>
              <h3 className='text-[#3b82f6] mb-4 text-[1.2rem] flex items-center gap-2'>🥕 Ingredients</h3>
              <div className={formRow}>
                <input
                  className={formInput}
                  type="text"
                  placeholder="Ingredient Name"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                />
                <input
                  className={formInput}
                  type="text"
                  placeholder='Quantity'
                  value={newIngredient.amount}
                  onChange={(e) => setNewIngredient({ ...newIngredient, amount: e.target.value })}
                />
                <input
                  className={formInput}
                  type="text"
                  placeholder='Unit (optional)'
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                />
              </div>
              <button
                type="button"
                onClick={addIngredient}
                className='bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white px-6 py-[0.8rem] rounded-[10px] font-bold mt-4 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(124,179,66,0.3)]'
              >
                + Add Ingredient
              </button>
              <div className='bg-[#3a3a3a] border-2 border-[#404040] rounded-[10px] p-4 max-h-[200px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mt-4'>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className='flex justify-between items-center py-2 border-b border-[#404040] last:border-b-0'>
                    <span className='text-[#e0e0e0]'>{ingredient.name} - {ingredient.amount} {ingredient.unit}</span>
                    <button type="button" onClick={() => removeIngredient(index)} className='text-red-400 hover:text-red-300'>×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Étapes */}
            <div className={formSection}>
              <h3 className='text-[#3b82f6] mb-4 text-[1.2rem] flex items-center gap-2'>📋 Preparation Steps</h3>
              <textarea
                className={formTextArea}
                placeholder="Describe the preparation step..."
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
              ></textarea>
              <button
                type="button"
                onClick={addInstruction}
                className='bg-linear-to-br from-[#3b82f6] to-[#64748b] text-white px-6 py-[0.8rem] rounded-[10px] font-bold mt-4 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(124,179,66,0.3)]'
              >
                + Add Step
              </button>
              <div className='bg-[#3a3a3a] border-2 border-[#404040] rounded-[10px] p-4 max-h-[300px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mt-4'>
                {instructions.map((instruction, index) => (
                  <div key={index} className='flex justify-between items-start py-2 border-b border-[#404040] last:border-b-0'>
                    <div className='flex items-start gap-2'>
                      <span className='bg-[#3b82f6] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold'>{index + 1}</span>
                      <span className='text-[#e0e0e0]'>{instruction}</span>
                    </div>
                    <button type="button" onClick={() => removeInstruction(index)} className='text-red-400 hover:text-red-300 ml-2'>×</button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className='px-8 py-6 border-t border-[#404040] flex gap-4 justify-end max-md:flex-col max-md:gap-2'>
          <button
            type="button"
            onClick={onClose}
            className='bg-[#404040] text-[#e0e0e0] px-8 py-4 rounded-[10px] font-bold hover:bg-[#505050] transition-colors max-md:w-full'
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-recipe-form"
            className='bg-linear-to-br from-[#10b981] to-[#059669] text-white px-8 py-4 rounded-[10px] font-bold transition-all duration-300 hover:-translate-y-[2px] hover:bg-gradient-to-br hover:from-[#10b981] hover:to-[#047857] max-md:w-full disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={loading}
          >
            {loading ? '⏳ Updating...' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditModal
