import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http'; // <-- ΝΕΟ IMPORT
import { LoadingScreen } from '../../components/loading-screen/loading-screen';
import { Generator } from '../../services/generator';
import { firstValueFrom } from 'rxjs'; 
import { UserPreferences, ModalConfig, Ingredient } from '../../shared/interfaces';

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

  modalConfig: ModalConfig = {
    show: false,
    title: '',
    message: '',
    btnText: '',
    btnLink: ''
  };

  changePortions(amount: number): void {
    const newValue = this.portions + amount;
    if (newValue >= 1 && newValue <= 12) this.portions = newValue;
  }

  changePersons(amount: number): void {
    const newValue = this.persons + amount;
    if (newValue >= 1 && newValue <= 3) this.persons = newValue;
  }

  selectTime(t: string): void { this.selectedTime = t; }
  selectCuisine(c: string): void { this.selectedCuisine = c; }
  selectDiet(d: string): void { this.selectedDiet = d; }
  closeModal(): void { this.modalConfig.show = false; }

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

  private validatePreferences(): boolean {
    return !!(this.selectedTime && this.selectedCuisine && this.selectedDiet);
  }

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

  private async fetchFromAI(): Promise<void> {
    const userPrefs: UserPreferences = {
      portions: this.portions, persons: this.persons,
      time: this.selectedTime, cuisine: this.selectedCuisine, diet: this.selectedDiet
    };

    const [response] = await Promise.all([
      firstValueFrom(this.generatorService.generateRecipesFromN8n(userPrefs)),
      new Promise(res => setTimeout(res, 9000))
    ]);
    
    if (response?.recipes?.length > 0) {
      this.generatorService.setUserPrefs(userPrefs);
      this.generatorService.setGeneratedRecipes(response.recipes);
      this.isLoading = false; 
      this.router.navigate(['/results']); 
    } else {
      throw { status: 429 };
    }
  }

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