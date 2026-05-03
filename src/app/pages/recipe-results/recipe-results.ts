import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeSummary } from '../../shared/interfaces';

@Component({
  selector: 'app-recipe-results',
  imports: [RouterLink, CommonModule],
  templateUrl: './recipe-results.html',
  styleUrl: './recipe-results.scss',
})
export class RecipeResults {
   tags: string[] = ['Italian', 'Quick'];

  recipes: RecipeSummary[] = [
    { id: 1, title: 'Pasta with spinach and cherry tomatoes', time: '20min' },
    { id: 2, title: 'Creamy garlic shrimp pasta', time: '22min' },
    { id: 3, title: 'Pasta alla Trapanese (Sicilian Tomato Pesto)', time: '20min' }
  ];
}
