import {
  generateRecipeSlug,
  validateRecipeData,
  createRecipeWithImage,
  NewRecipeData,
} from '../recipeHelpers';
import { getRecipeImageUrl } from '../recipeImages';

// Mock le module recipeImages
jest.mock('../recipeImages');
const mockGetRecipeImageUrl = getRecipeImageUrl as jest.MockedFunction<typeof getRecipeImageUrl>;

describe('Recipe Helpers', () => {
  beforeEach(() => {
    mockGetRecipeImageUrl.mockReturnValue('/images/recipes/test-recipe.png');
  });

  describe('generateRecipeSlug', () => {
    it('should generate a valid slug from a title', () => {
      const slug = generateRecipeSlug('Chocolate Chip Cookies');
      expect(slug).toBe('chocolate-chip-cookies');
    });

    it('should handle special characters', () => {
      const slug = generateRecipeSlug('Pâtes à la Carbonara!!!');
      expect(slug).toBe('ptes-la-carbonara');
    });

    it('should remove extra spaces and hyphens', () => {
      // Note: spaces at start/end become hyphens, then trim removes them
      const slug = generateRecipeSlug('Multiple  Spaces');
      expect(slug).toBe('multiple-spaces');
    });

    it('should handle lowercase conversion', () => {
      const slug = generateRecipeSlug('UPPERCASE TITLE');
      expect(slug).toBe('uppercase-title');
    });

    it('should handle numbers', () => {
      const slug = generateRecipeSlug('Recipe 123');
      expect(slug).toBe('recipe-123');
    });
  });

  describe('validateRecipeData', () => {
    const validRecipe: NewRecipeData = {
      title: 'Test Recipe',
      description: 'A valid recipe description',
      emoji: '🍕',
      ingredients: [
        { name: 'Flour', amount: '500', unit: 'g' }
      ],
      instructions: ['Step 1', 'Step 2'],
      prepTime: 30,
      servings: 4,
      difficulty: 'medium',
      category: 'Main Course',
      tags: ['test'],
      nutrition: {
        calories: 350,
        protein: 20,
        carbs: 40,
        fat: 15
      }
    };

    it('should validate a correct recipe', () => {
      const errors = validateRecipeData(validRecipe);
      expect(errors).toHaveLength(0);
    });

    it('should reject recipes with short titles', () => {
      const recipe = { ...validRecipe, title: 'Ab' };
      const errors = validateRecipeData(recipe);
      expect(errors).toContain('Le titre doit contenir au moins 3 caractères');
    });

    it('should reject recipes with short descriptions', () => {
      const recipe = { ...validRecipe, description: 'Short' };
      const errors = validateRecipeData(recipe);
      expect(errors).toContain('La description doit contenir au moins 10 caractères');
    });

    it('should reject recipes without ingredients', () => {
      const recipe = { ...validRecipe, ingredients: [] };
      const errors = validateRecipeData(recipe);
      expect(errors).toContain('Au moins un ingrédient est requis');
    });

    it('should reject recipes without instructions', () => {
      const recipe = { ...validRecipe, instructions: [] };
      const errors = validateRecipeData(recipe);
      expect(errors).toContain('Au moins une instruction est requise');
    });

    it('should reject recipes with non-positive prep time', () => {
      const recipe = { ...validRecipe, prepTime: 0 };
      const errors = validateRecipeData(recipe);
      expect(errors).toContain('Le temps de préparation doit être positif');
    });

    it('should reject recipes with non-positive servings', () => {
      const recipe = { ...validRecipe, servings: 0 };
      const errors = validateRecipeData(recipe);
      expect(errors).toContain('Le nombre de portions doit être positif');
    });

    it('should reject invalid difficulty levels', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recipe = { ...validRecipe, difficulty: 'very-hard' as any };
      const errors = validateRecipeData(recipe);
      expect(errors).toContain('La difficulté doit être easy, medium ou hard');
    });

    it('should reject negative calories', () => {
      const recipe = {
        ...validRecipe,
        nutrition: { ...validRecipe.nutrition, calories: -10 }
      };
      const errors = validateRecipeData(recipe);
      expect(errors).toContain('Les calories ne peuvent pas être négatives');
    });

    it('should accumulate multiple errors', () => {
      const recipe = {
        ...validRecipe,
        title: 'Ab',
        description: 'Short',
        ingredients: []
      };
      const errors = validateRecipeData(recipe);
      expect(errors.length).toBeGreaterThan(1);
    });
  });

  describe('createRecipeWithImage', () => {
    it('should create a recipe with an image URL', () => {
      const recipeData: NewRecipeData = {
        title: 'Pizza Margherita',
        description: 'A classic Italian pizza',
        emoji: '🍕',
        ingredients: [
          { name: 'Flour', amount: '500', unit: 'g' },
          { name: 'Tomatoes', amount: '400', unit: 'g' }
        ],
        instructions: ['Make dough', 'Add toppings', 'Bake'],
        prepTime: 45,
        servings: 4,
        difficulty: 'medium',
        category: 'Main Course',
        tags: ['italian', 'pizza'],
        nutrition: {
          calories: 400,
          protein: 15,
          carbs: 50,
          fat: 12
        }
      };

      const result = createRecipeWithImage(recipeData);

      expect(result).toMatchObject(recipeData);
      expect(result.image).toBe('/images/recipes/test-recipe.png');
      expect(result.source).toBe('manual');
    });

    it('should call getRecipeImageUrl with the recipe title', () => {
      const recipeData: NewRecipeData = {
        title: 'Pizza Margherita',
        description: 'A classic Italian pizza',
        emoji: '🍕',
        ingredients: [{ name: 'Flour', amount: '500', unit: 'g' }],
        instructions: ['Make dough'],
        prepTime: 45,
        servings: 4,
        difficulty: 'medium',
        category: 'Main Course',
        tags: ['italian'],
        nutrition: {
          calories: 400,
          protein: 15,
          carbs: 50,
          fat: 12
        }
      };

      createRecipeWithImage(recipeData);

      expect(mockGetRecipeImageUrl).toHaveBeenCalledWith('Pizza Margherita');
    });
  });

  describe('validateRecipeData - difficulty validation', () => {
    const baseRecipe: NewRecipeData = {
      title: 'Test Recipe',
      description: 'A valid recipe description',
      emoji: '🍕',
      ingredients: [{ name: 'Flour', amount: '500', unit: 'g' }],
      instructions: ['Step 1'],
      prepTime: 30,
      servings: 4,
      difficulty: 'medium',
      category: 'Main Course',
      tags: ['test'],
      nutrition: { calories: 350, protein: 20, carbs: 40, fat: 15 }
    };

    it('should accept easy difficulty', () => {
      const recipe = { ...baseRecipe, difficulty: 'easy' as const };
      const errors = validateRecipeData(recipe);
      expect(errors).toHaveLength(0);
    });

    it('should accept medium difficulty', () => {
      const recipe = { ...baseRecipe, difficulty: 'medium' as const };
      const errors = validateRecipeData(recipe);
      expect(errors).toHaveLength(0);
    });

    it('should accept hard difficulty', () => {
      const recipe = { ...baseRecipe, difficulty: 'hard' as const };
      const errors = validateRecipeData(recipe);
      expect(errors).toHaveLength(0);
    });
  });
});
