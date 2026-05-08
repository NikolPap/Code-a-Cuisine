export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  isEditing?: boolean;
  isDropdownOpen?: boolean; 
}

export interface RecipeSummary {
  id: string;
  title: string;
  time: string;
}

export interface Recipe {
  title: string;
  time: string;
  likes: number;
}

export interface Cuisine {
  id: string; 
  name: string;
  emoji: string;
  image: string;
}

export interface RecipeListItem {
  id: string;
  title: string;
  time: string;
  tags: string[];
  likes: number;
}

export interface UserPreferences {
  portions: number;
  persons: number;
  time: string;
  cuisine: string;
  diet: string;
}

export interface ModalConfig {
  show: boolean;
  title: string;
  message: string;
  btnText: string;
  btnLink: string;
}

export interface FullRecipe {
  id: string;
  title: string;
  time: string;
  portions: number;
  chefsCount: number;
  likes: number;
  tags: string[];
  nutrition: {
    energy: string;
    protein: string;
    fat: string;
    carbs: string;
  };
  myIngredients: { amount: string; name: string }[];
  extraIngredients: { amount: string; name: string }[];
  steps: { 
    num: number; 
    title: string; 
    chefId: number; 
    text: string; 
  }[];
}