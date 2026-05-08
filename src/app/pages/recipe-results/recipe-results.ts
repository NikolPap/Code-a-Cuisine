import { Component, OnInit, inject } from '@angular/core'; // Πρόσθεσε το OnInit
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Generator } from '../../services/generator';
import { RecipeService } from '../../services/recipe';
import { FullRecipe } from '../../shared/interfaces'; 

@Component({
  selector: 'app-recipe-results',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './recipe-results.html',
  styleUrl: './recipe-results.scss',
})
export class RecipeResults implements OnInit { 
  private generatorService = inject(Generator);
  private recipeService = inject(RecipeService);
  private router = inject(Router);

  tags: string[] = ['AI Generated', 'New'];
  recipes: FullRecipe[] = [];

  /** Retrieves generated recipes and user preferences from the service upon component initialization. */
  ngOnInit(): void {
    this.recipes = this.generatorService.getGeneratedRecipes();
    
    const prefs = this.generatorService.getUserPrefs();
    if (prefs) {
      this.tags = [prefs.cuisine, prefs.time];
    }
    if (this.recipes.length === 0) {
      this.router.navigate(['/generate']);
    }
  }

  /** Saves the selected recipe to the database if it hasn't been saved yet and navigates to its detailed view. */
  async viewAndSaveRecipe(recipe: FullRecipe) {
    if (recipe.id) {
      this.router.navigate(['/recipe', recipe.id]);
      return;
    }
    const firebaseId = await this.recipeService.saveRecipe(recipe);
    recipe.id = firebaseId;
    this.router.navigate(['/recipe', firebaseId]);
  }
}