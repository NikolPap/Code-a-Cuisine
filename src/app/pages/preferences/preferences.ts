import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingScreen } from '../../components/loading-screen/loading-screen';
import { Generator } from '../../services/generator';
import { firstValueFrom } from 'rxjs'; 
import { UserPreferences, ModalConfig, Ingredient } from '../../shared/interfaces';
import { RecipeService } from '../../services/recipe';

@Component({
  selector: 'app-preferences',
  standalone: true, 
  imports: [RouterLink, CommonModule, LoadingScreen],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})
export class Preferences {
  portions: number = 2; 
  persons: number = 1;
  isLoading: boolean = false;
  selectedTime: string = '';
  selectedCuisine: string = '';
  selectedDiet: string = ''; 

  private router = inject(Router);
  private generatorService = inject(Generator);
  private cdr = inject(ChangeDetectorRef); 
   private recipeService = inject(RecipeService); 


  modalConfig: ModalConfig = {
    show: false,
    title: '',
    message: '',
    btnText: '',
    btnLink: ''
  };

  /** Increments or decrements the number of portions within the allowed range (1-12). */
  changePortions(amount: number): void {
    const newValue = this.portions + amount;
    if (newValue >= 1 && newValue <= 12) this.portions = newValue;
  }

  /** Increments or decrements the number of persons cooking within the allowed range (1-3). */
  changePersons(amount: number): void {
    const newValue = this.persons + amount;
    if (newValue >= 1 && newValue <= 3) this.persons = newValue;
  }

  /** Sets the selected cooking time category. */
  selectTime(t: string): void { this.selectedTime = t; }

  /** Sets the selected cuisine style. */
  selectCuisine(c: string): void { this.selectedCuisine = c; }

  /** Sets the selected dietary preference. */
  selectDiet(d: string): void { this.selectedDiet = d; }

  /** Closes the error modal by setting its visibility to false. */
  closeModal(): void { this.modalConfig.show = false; }

  /** Orchestrates the recipe generation process by validating inputs and fetching data from the AI service. */
  async generateRecipe(): Promise<void> {
    if (!this.validatePreferences()) return;
    if (!this.validateIngredientsWeight()) return;

    this.isLoading = true;
    try {
      await this.fetchFromAI();
    } catch (error) {
      this.handleAIError(error as HttpErrorResponse);
    }
  }

  /** Checks if all mandatory preferences (time, cuisine, diet) have been selected. */
  private validatePreferences(): boolean {
    return !!(this.selectedTime && this.selectedCuisine && this.selectedDiet);
  }

  /** Validates that the user has provided enough ingredients and sufficient quantities for the selected portions. */
  private validateIngredientsWeight(): boolean {
    const ingredients: Ingredient[] = this.generatorService.getIngredients();
    if (ingredients.length < 2) {
      this.showIngredientError(); return false; 
    }
    
    let totalWeight = 0;
    ingredients.forEach(i => totalWeight += (i.unit === 'piece' ? i.amount * 100 : i.amount));
    
    if ((totalWeight / this.portions) < 150) {
      this.showIngredientError(); return false; 
    }
    return true;
  }

  /** Handles the asynchronous API call to n8n and ensures the loading animation plays for a minimum duration. */
  private async fetchFromAI(): Promise<void> {
    const userPrefs: UserPreferences = {
      portions: this.portions, persons: this.persons,
      time: this.selectedTime, cuisine: this.selectedCuisine, diet: this.selectedDiet
    };

    const [response] = await Promise.all([
      firstValueFrom(this.generatorService.generateRecipesFromN8n(userPrefs)),
      new Promise(res => setTimeout(res, 9000))
    ]);
    
  if (response?.recipes?.length > 0)  {
      for (let recipe of response.recipes) {
        const firebaseId = await this.recipeService.saveRecipe(recipe);
        recipe.id = firebaseId;
      }

      this.generatorService.setUserPrefs(userPrefs);
      this.generatorService.setGeneratedRecipes(response.recipes);
      this.isLoading = false; 
      this.router.navigate(['/results']); 
    } else {
      throw { status: 429 };
    }
  }

  /** Manages errors from the AI generation process and displays appropriate messages in the modal. */
  private handleAIError(err: HttpErrorResponse): void {
    this.isLoading = false; 
    const isQuota = err.status === 429 || err.error?.message?.includes('Limit');
    
    this.modalConfig = {
      show: true,
      title: isQuota ? 'Daily Limit Reached' : 'Oops! Server is sleeping',
      message: isQuota ? 'Maximum AI recipes reached.' : 'AI chefs are busy or server is down.',
      btnText: 'Explore Cookbook',
      btnLink: '/cookbook'
    };
    this.cdr.detectChanges();
  }

  /** Configures and displays the modal for cases where input ingredients are insufficient. */
  private showIngredientError(): void {
    this.modalConfig = {
      show: true,
      title: 'Ups! Not quite enough...',
      message: 'Ingredient quantities aren\'t sufficient. Please adjust and try again.',
      btnText: 'Go back to ingredients',
      btnLink: '/generate'
    };
  }
}