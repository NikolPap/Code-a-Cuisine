import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe';
import { FullRecipe } from '../../shared/interfaces';

@Component({
  selector: 'app-cookbook-category',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './cookbook-category.html',
  styleUrl: './cookbook-category.scss'
})
export class CookbookCategory implements OnInit {
  categoryBanner: string = '';
  currentCategory: string = '';
  allMatchedRecipes: FullRecipe[] = []; 
  recipes: FullRecipe[] = []; 
  currentPage: number = 1;
  itemsPerPage: number = 15; 
  totalPages: number = 1;
  pageNumbers: number[] = []; 

  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  private cdr = inject(ChangeDetectorRef);

  /** Initializes the component by subscribing to route parameters and fetching filtered recipes from the database. */
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.currentCategory = params.get('category') || '';
      
      if (this.currentCategory) {
        this.categoryBanner = `${this.currentCategory}-recipe.svg`;
        this.recipeService.getAllRecipes().subscribe((allRecipes: FullRecipe[]) => {
          
          this.allMatchedRecipes = allRecipes.filter(recipe => {
            if (!recipe.tags || !Array.isArray(recipe.tags)) return false;
            return recipe.tags.some((tag: string) => 
              tag.toLowerCase() === this.currentCategory.toLowerCase()
            );
          });

          this.totalPages = Math.ceil(this.allMatchedRecipes.length / this.itemsPerPage) || 1;
          this.pageNumbers = Array.from({length: this.totalPages}, (_, i) => i + 1);
          this.goToPage(1);
        });
      }
    });
  }

  /** Updates the visible recipes list based on the selected page and scrolls the window to the top. */
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.recipes = this.allMatchedRecipes.slice(startIndex, endIndex);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.cdr.detectChanges();
    }
  }
}