import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-preferences',
  imports: [RouterLink, CommonModule],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss',
})

export class Preferences {
   // --- Counters ---
  portions: number = 2; 
  persons: number = 1;

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

  // --- Selections (Pills) ---
  selectedTime: string = '';
  selectedCuisine: string = '';
  selectedDiet: string = ''; 

  selectTime(time: string) {
    this.selectedTime = time;
  }

  selectCuisine(cuisine: string) {
    this.selectedCuisine = cuisine;
  }

  selectDiet(diet: string) {
    this.selectedDiet = diet;
  }
}
