import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ingredient } from '../../shared/interfaces';

@Component({
  selector: 'app-recipe-generator',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './recipe-generator.html',
  styleUrl: './recipe-generator.scss',
})
export class RecipeGenerator {
  isMainDropdownOpen = false;
  mainSelectedUnit = 'gram';
  units = ['piece', 'ml', 'gram'];

  currentName: string = '';
  currentAmount: number | null = null;

  ingredientsList: Ingredient[] = [];
  toggleMainDropdown() {
    this.isMainDropdownOpen = !this.isMainDropdownOpen;
  }

  selectMainUnit(unit: string, event: Event) {
    event.stopPropagation();
    this.mainSelectedUnit = unit;
    this.isMainDropdownOpen = false;
  }

  addIngredient() {
    if (this.currentName.trim() !== '' && this.currentAmount !== null) {
      this.ingredientsList.push({
        name: this.currentName,
        amount: this.currentAmount,
        unit: this.mainSelectedUnit,
        isEditing: false,
        isDropdownOpen: false
      });
      this.currentName = '';
      this.currentAmount = null;
    }
  }

  toggleEdit(item: Ingredient) {
    item.isEditing = !item.isEditing;
    if (!item.isEditing) item.isDropdownOpen = false; 
  }


  toggleItemDropdown(item: Ingredient) {
    item.isDropdownOpen = !item.isDropdownOpen;
  }

  selectItemUnit(item: Ingredient, unit: string, event: Event) {
    event.stopPropagation();
    item.unit = unit;
    item.isDropdownOpen = false;
  }

  deleteIngredient(index: number) {
    this.ingredientsList.splice(index, 1);
  }
}