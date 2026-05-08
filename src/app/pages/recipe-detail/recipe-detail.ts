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

  /** Initializes the component by fetching recipe details based on the ID provided in the route parameters. */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const recipeId = params.get('id');
      
      if (recipeId) {
        this.recipeService.getRecipeById(recipeId).subscribe((data: FullRecipe) => {
          this.recipe = data; 
          this.cdr.detectChanges();
        });
      }
    });
  }

  /** Navigates back to the previous page using the platform's location history. */
  goBack(event: Event): void {
    event.preventDefault(); 
    this.location.back();
  }
  
  /** Updates the like count locally and synchronizes the change with the database. */
  toggleLike(): void {
    if (!this.recipe) return;
    this.isLiked = !this.isLiked;
    let currentLikes = Number(this.recipe.likes);
    this.recipe.likes = this.isLiked ? currentLikes + 1 : currentLikes - 1;
    if (this.recipe.id) {
      this.recipeService.updateLikes(this.recipe.id, this.recipe.likes);
    } else {
      console.error("error ");
    }
  }
}