import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ingredient } from '../shared/interfaces';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class Generator {
  private http = inject(HttpClient);
  private n8nWebhookUrl = 'http://localhost:5678/webhook/generate-recipe';
  private userIngredients: Ingredient[] = [];
  private userPrefs: any = null; 

  setUserPrefs(prefs: any) {
    this.userPrefs = prefs;
  }


  getUserPrefs() {
    return this.userPrefs;
  }


 setIngredients(ingredients: Ingredient[]) {
    this.userIngredients = ingredients;
  }

   getIngredients(): Ingredient[] {
    return this.userIngredients;
  }
  
  generateRecipesFromN8n(preferences: any): Observable<any> {

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
    
    return this.http.post(this.n8nWebhookUrl, payload);
  }

    private generatedRecipes: any[] = []; 

  setGeneratedRecipes(recipes: any[]) {
    this.generatedRecipes = recipes;
  }

  getGeneratedRecipes() {
    return this.generatedRecipes;
  }

}
