
const BASE_URL = 'https://dummyjson.com/recipes';

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

export interface RecipeResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

export const recipeApi = {
  // Get all recipes with pagination
  getRecipes: async (limit = 12, skip = 0): Promise<RecipeResponse> => {
    const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
    return response.json();
  },

  // Search recipes
  searchRecipes: async (query: string): Promise<RecipeResponse> => {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  // Get single recipe
  getRecipe: async (id: number): Promise<Recipe> => {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
  },

  // Get all tags (we'll extract from recipes)
  getTags: async (): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}?limit=50`);
    const data: RecipeResponse = await response.json();
    const allTags = data.recipes.flatMap(recipe => recipe.tags);
    return [...new Set(allTags)].sort();
  },

  // Filter by tag
  getRecipesByTag: async (tag: string): Promise<RecipeResponse> => {
    const response = await fetch(`${BASE_URL}/tag/${tag}`);
    return response.json();
  },

  // Create recipe (mock - DummyJSON doesn't persist)
  createRecipe: async (recipe: Omit<Recipe, 'id'>): Promise<Recipe> => {
    const response = await fetch(`${BASE_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    });
    return response.json();
  },

  // Update recipe (mock - DummyJSON doesn't persist)
  updateRecipe: async (id: number, recipe: Partial<Recipe>): Promise<Recipe> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    });
    return response.json();
  }
};
