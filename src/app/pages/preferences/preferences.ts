import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingScreen } from '../../components/loading-screen/loading-screen';
import { Generator } from '../../services/generator';
import { firstValueFrom } from 'rxjs'; 

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
  showErrorModal: boolean = false;
  selectedTime: string = '';
  selectedCuisine: string = '';
  selectedDiet: string = ''; 



  private router = inject(Router);
  private generatorService = inject(Generator);
  private cdr = inject(ChangeDetectorRef); 

  changePortions(amount: number) {
    const newValue = this.portions + amount;
    if (newValue >= 1 && newValue <= 12) { 
      this.portions = newValue;
    }
  }

  changePersons(amount: number) {
    const newValue = this.persons + amount;
    if (newValue >= 1 && newValue <= 3) { 
      this.persons = newValue;
    }
  }

   selectTime(time: string) {
    this.selectedTime = time;
  }

  selectCuisine(cuisine: string) {
    this.selectedCuisine = cuisine;
  }

  selectDiet(diet: string) {
    this.selectedDiet = diet;
  }

  modalConfig = {
    show: false,
    title: '',
    message: '',
    btnText: '',
    btnLink: ''
  };

  closeModal() {
    this.modalConfig.show = false;
  }

  async generateRecipe() {
    if (!this.validatePreferences()) return;
    if (!this.validateIngredientsWeight()) return;

    this.isLoading = true;
    
    try {
      await this.fetchFromAI();
    } catch (error) {
      this.handleAIError(error);
    }
  }

  private validatePreferences(): boolean {
    if (!this.selectedTime || !this.selectedCuisine || !this.selectedDiet) {
      return false;
    }
    return true;
  }

  private validateIngredientsWeight(): boolean {
    const ingredients = this.generatorService.getIngredients();
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

  private async fetchFromAI() {
    const userPrefs = {
      portions: this.portions, persons: this.persons,
      time: this.selectedTime, cuisine: this.selectedCuisine, diet: this.selectedDiet
    };

    const [response] = await Promise.all([
      firstValueFrom(this.generatorService.generateRecipesFromN8n(userPrefs)),
      new Promise(res => setTimeout(res, 9000))
    ]);
    
    this.generatorService.setGeneratedRecipes(response.recipes);
    this.isLoading = false; 
    this.router.navigate(['/results']); 
  }

  private handleAIError(err: any) {
    this.isLoading = false; 
    const isQuotaError = err.status === 429;
    
    this.modalConfig = {
      show: true,
      title: isQuotaError ? 'Daily Limit Reached 🛑' : 'Oops! Server is sleeping 💤',
      message: isQuotaError ? 'Maximum AI recipes reached.' : 'AI chefs are busy or server is down.',
      btnText: 'Explore Cookbook',
      btnLink: '/cookbook'
    };

    this.cdr.detectChanges();
  }

  private showIngredientError() {
    this.modalConfig = {
      show: true,
      title: 'Ups! Not quite enough...',
      message: 'Ingredient quantities aren\'t sufficient. Please adjust and try again.',
      btnText: 'Go back to ingredients',
      btnLink: '/generate'
    };
  }
}