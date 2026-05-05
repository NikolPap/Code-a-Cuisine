import { Component, inject } from '@angular/core';
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

  async generateRecipe() {
    if (!this.selectedTime || !this.selectedCuisine || !this.selectedDiet) {
      alert("Please select Cooking time, Cuisine, and Diet preferences!");
      return;
    }

    this.isLoading = true;

    const userPrefs = {
      portions: this.portions,
      persons: this.persons,
      time: this.selectedTime,
      cuisine: this.selectedCuisine,
      diet: this.selectedDiet
    };

    try {
      const [n8nResponse] = await Promise.all([
        firstValueFrom(this.generatorService.generateRecipesFromN8n(userPrefs)),
        new Promise(resolve => setTimeout(resolve, 9000)) 
      ]);
      
      if (n8nResponse && n8nResponse.recipes) {
        this.generatorService.setGeneratedRecipes(n8nResponse.recipes);
        this.isLoading = false;
        this.router.navigate(['/results']); 
      }

    } catch (err) {
      console.error("❌ n8n:", err);
      this.isLoading = false; 
    }
  }
}