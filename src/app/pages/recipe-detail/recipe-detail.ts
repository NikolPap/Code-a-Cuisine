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
        this.recipeService.getRecipeById(recipeId).subscribe((data: FullRecipe) => {
          this.recipe = data; 
          this.cdr.detectChanges();
        });
      }
    });
  }

  goBack(event: Event): void {
    event.preventDefault(); 
    this.location.back();
  }
  
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