import { Component, OnInit, inject } from '@angular/core'; // <-- Πρόσθεσε το OnInit
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ingredient } from '../../shared/interfaces';
import { RecipeService } from '../../services/recipe';
import { Generator } from '../../services/generator';


@Component({
  selector: 'app-recipe-generator',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './recipe-generator.html',
  styleUrl: './recipe-generator.scss',
})

export class RecipeGenerator implements OnInit {
  
  private recipeService = inject(RecipeService);
  private generatorService = inject(Generator); 
  private router = inject(Router); 
  

  isMainDropdownOpen = false;
  mainSelectedUnit = 'gram';
  units = ['piece', 'ml', 'gram'];
  currentName: string = '';
  currentAmount: number | null = null;
  ingredientsList: Ingredient[] = [];
  knownIngredients: string[] = []; 
  filteredIngredients: string[] = [];
  isAutocompleteOpen = false;
  hintText: string = ''; 
  highlightedIndex: number = -1;

  ngOnInit() {
    this.recipeService.getIngredientsList().subscribe(data => {
      if (data && data.list) {
        this.knownIngredients = data.list;
      }
    });
  }

  filterIngredients() {
    const searchWord = this.currentName.toLowerCase(); 
    
    if (searchWord.length > 0) {
      let matches = this.knownIngredients.filter(ingredient => 
        ingredient.toLowerCase().startsWith(searchWord)
      );
      matches.sort((a, b) => a.localeCompare(b));
      this.filteredIngredients = matches.slice(0, 3);
      this.isAutocompleteOpen = this.filteredIngredients.length > 0;
      this.highlightedIndex = -1;
      const firstSug = this.filteredIngredients[0];
      if (firstSug) {
        this.hintText = this.currentName + firstSug.substring(this.currentName.length);
      } else {
        this.hintText = '';
      }

    } else {
      this.isAutocompleteOpen = false;
      this.filteredIngredients = [];
      this.hintText = '';
    }
  }

 onKeyDown(event: KeyboardEvent) {
    if (!this.isAutocompleteOpen && event.key !== 'Enter') return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredIngredients.length - 1);
    
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
    
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.highlightedIndex >= 0) {
        this.selectSuggestion(this.filteredIngredients[this.highlightedIndex]);
      } 
      else if (this.hintText) {
        this.selectSuggestion(this.filteredIngredients[0]);
      }
    
    } else if (event.key === 'ArrowRight' || event.key === 'Tab') {
      if (this.hintText && this.currentName !== this.hintText) {
        event.preventDefault();
        this.selectSuggestion(this.filteredIngredients[0]);
      }
    
    } else if (event.key === 'Escape') {
      this.isAutocompleteOpen = false;
      this.hintText = '';
    }
  }

  selectSuggestion(suggestion: string) {
    this.currentName = suggestion; 
    this.isAutocompleteOpen = false; 
    this.hintText = ''; 
    this.highlightedIndex = -1;
  }

  toggleMainDropdown() { this.isMainDropdownOpen = !this.isMainDropdownOpen; }
  
  selectMainUnit(unit: string, event: Event) {
    event.stopPropagation();
    this.mainSelectedUnit = unit;
    this.isMainDropdownOpen = false;
  }

addIngredient() {
    if (this.currentName.trim() !== '' && this.currentAmount !== null && this.currentAmount > 0) {
      
      this.ingredientsList.push({
        name: this.currentName,
        amount: this.currentAmount,
        unit: this.mainSelectedUnit,
        isEditing: false,
        isDropdownOpen: false
      });
      
      this.currentName = '';
      this.currentAmount = null;
      this.isAutocompleteOpen = false;
    }
  }

  toggleEdit(item: Ingredient) {
    item.isEditing = !item.isEditing;
    if (!item.isEditing) item.isDropdownOpen = false; 
  }

  toggleItemDropdown(item: Ingredient) { item.isDropdownOpen = !item.isDropdownOpen; }
  
  selectItemUnit(item: Ingredient, unit: string, event: Event) {
    event.stopPropagation();
    item.unit = unit;
    item.isDropdownOpen = false;
  }

  deleteIngredient(index: number) { this.ingredientsList.splice(index, 1);
   }

   goToNextStep() {
    if (this.ingredientsList.length > 0) {
      this.generatorService.setIngredients(this.ingredientsList);
      this.router.navigate(['/preferences']);
    }

}

}