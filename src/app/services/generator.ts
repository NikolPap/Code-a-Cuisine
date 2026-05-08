import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient, FullRecipe, UserPreferences } from '../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class Generator {
  private http = inject(HttpClient);
  private n8nWebhookUrl = 'http://localhost:5678/webhook/generate-recipe';
  private userIngredients: Ingredient[] = [];
  private generatedRecipes: FullRecipe[] = [];
  private userPrefs: UserPreferences | null = null; 


  setUserPrefs(prefs: UserPreferences): void {
    this.userPrefs = prefs;
  }

  getUserPrefs(): UserPreferences | null {
    return this.userPrefs;
  }

  setIngredients(ingredients: Ingredient[]): void {
    this.userIngredients = ingredients;
  }

  getIngredients(): Ingredient[] {
    return this.userIngredients;
  }

  generateRecipesFromN8n(preferences: UserPreferences): Observable<{ success: boolean; recipes: FullRecipe[] }> {

    const payload = {
      action: "generate_recipes",
      data: {
        ingredients: this.userIngredients.map(ing => ({
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit
        })),
        preferences: {
          portions: preferences.portions,
          personsCooking: preferences.persons,
          timeLimit: preferences.time,
          cuisineStyle: preferences.cuisine,
          dietType: preferences.diet
        }
      }
    };
    
    return this.http.post<{ success: boolean; recipes: FullRecipe[] }>(this.n8nWebhookUrl, payload);
  }

  setGeneratedRecipes(recipes: FullRecipe[]): void {
    this.generatedRecipes = recipes;
  }

  getGeneratedRecipes(): FullRecipe[] {
    return this.generatedRecipes;
  }
}