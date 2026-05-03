import { Component, OnInit, inject, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe';

@Component({
  selector: 'app-recipe-detail',
  imports: [RouterLink, CommonModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail {
      recipe: any = null;
  isLiked = false;

  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  private cdr = inject(ChangeDetectorRef); 

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const recipeId = params.get('id');
      
      if (recipeId) {
        this.recipeService.getRecipeById(recipeId).subscribe(data => {
          this.recipe = data; 
          
          this.cdr.detectChanges();
        });
      }
    });
  }

 toggleLike() {
    this.isLiked = !this.isLiked;
    
    if (this.recipe) {
      this.isLiked ? this.recipe.likes++ : this.recipe.likes--;
      if (this.recipe.id) {
        this.recipeService.updateLikes(this.recipe.id, this.recipe.likes);
      }
    }
  }
}
