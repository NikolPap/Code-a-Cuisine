import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeListItem } from '../../shared/interfaces';

@Component({
  selector: 'app-cookbook-category',
  imports: [RouterLink, CommonModule],
  templateUrl: './cookbook-category.html',
  styleUrl: './cookbook-category.scss',
})
export class CookbookCategory {
  categoryBanner: string = ''; 
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('category'); 
      if (categoryId) {
        this.categoryBanner = `${categoryId}-recipe.svg`;
      }
    });
  }

  recipes: RecipeListItem[] = [
    { id: 1, title: 'Pasta with spinach and cherry tomatoes', time: '20min', tags: ['Vegetarian', 'Quick'], likes: 66 },
    { id: 2, title: 'Creamy garlic shrimp pasta', time: '22min', tags: ['Quick'], likes: 32 },
    { id: 3, title: 'Funghi salami pizza', time: '16min', tags: ['Quick'], likes: 42 },
    { id: 4, title: 'Pasta with spinach and cherry tomatoes', time: '20min', tags: ['Vegetarian', 'Quick'], likes: 66 },
    { id: 5, title: 'Creamy garlic shrimp pasta', time: '22min', tags: ['Quick'], likes: 32 },
    { id: 6, title: 'Funghi salami pizza', time: '16min', tags: ['Quick'], likes: 42 },
    { id: 7, title: 'Pasta with spinach and cherry tomatoes', time: '20min', tags: ['Vegetarian', 'Quick'], likes: 66 },
    { id: 8, title: 'Creamy garlic shrimp pasta', time: '22min', tags: ['Quick'], likes: 32 },
    { id: 9, title: 'Funghi salami pizza', time: '16min', tags: ['Quick'], likes: 42 }
  ];
}
