export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  isEditing?: boolean;
  isDropdownOpen?: boolean; 
}

export interface RecipeSummary {
  id: number;
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
  id: number;
  title: string;
  time: string;
  tags: string[];
  likes: number;
}