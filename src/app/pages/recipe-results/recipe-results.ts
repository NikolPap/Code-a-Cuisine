import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Generator } from '../../services/generator';
import { RecipeService } from '../../services/recipe';


@Component({
  selector: 'app-recipe-results',
  imports: [RouterLink, CommonModule],
  templateUrl: './recipe-results.html',
  styleUrl: './recipe-results.scss',
})
export class RecipeResults {
  private generatorService = inject(Generator);
  private recipeService = inject(RecipeService);
  private router = inject(Router);

  tags: string[] = ['AI Generated', 'New'];
  recipes: any[] = [];

 ngOnInit() {
    this.recipes = this.generatorService.getGeneratedRecipes();
    
    // === ΔΥΝΑΜΙΚΑ TAGS ===
    const prefs = this.generatorService.getUserPrefs();
    if (prefs) {
      // Φτιάχνουμε τη λίστα των Tags με την Κουζίνα και τον Χρόνο που επιλέχθηκαν!
      this.tags = [prefs.cuisine, prefs.time];
    }

    if (this.recipes.length === 0) {
      this.router.navigate(['/generate']);
    }
  }

  async viewAndSaveRecipe(recipe: any) {
    const firebaseId = await this.recipeService.saveRecipe(recipe);
    this.router.navigate(['/recipe', firebaseId]);
  }
}
