import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe';
import { Location } from '@angular/common'; 
import { FullRecipe } from '../../shared/interfaces'; 

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail implements OnInit {
  recipe: FullRecipe | null = null;
  isLiked = false;
  isIngredientsHidden = false;
  isDirectionsHidden = false;

  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  private cdr = inject(ChangeDetectorRef); 
  private location = inject(Location);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const recipeId = params.get('id');
      
      if (recipeId) {
        // 2. ΑΛΛΑΓΗ: Ορίζουμε τον τύπο στο subscribe
        this.recipeService.getRecipeById(recipeId).subscribe((data: FullRecipe) => {
          this.recipe = data; 
          this.cdr.detectChanges();
        });
      }
    });
  }

  goBack(): void {
    this.location.back(); 
  }

  toggleLike(): void {
    this.isLiked = !this.isLiked;
    
    if (this.recipe) {
      // Τώρα το VS Code ξέρει ότι το .likes είναι number!
      this.isLiked ? this.recipe.likes++ : this.recipe.likes--;
      
      if (this.recipe.id) {
        this.recipeService.updateLikes(this.recipe.id, this.recipe.likes);
      }
    }
  }
}