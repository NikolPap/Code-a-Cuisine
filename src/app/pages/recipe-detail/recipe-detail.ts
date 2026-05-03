import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-detail',
  imports: [RouterLink, CommonModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss',
})
export class RecipeDetail {
    recipe = {
    title: 'Pasta with spinach and cherry tomatoes',
    time: '20min',
    portions: 2,
    chefsCount: 2,
    likes: 66,
    tags: ['Vegetarian', 'Quick'],
    nutrition: { energy: '630 kcal', protein: '18g', fat: '24g', carbs: '58g' },
    
    // Υλικά
    myIngredients: [
      { amount: '80g', name: 'Pasta noodles' },
      { amount: '100g', name: 'Baby spinach' },
      { amount: '150g', name: 'Cherry tomatoes' },
      { amount: '1 piece', name: 'Egg' }
    ],
    extraIngredients: [
      { amount: '40g', name: 'Parmesan cheese' },
      { amount: '30ml', name: 'Olive oil' },
      { amount: 'Herbs', name: '(dry basil, oregano, garlic)' }
    ],

    // Βήματα Εκτέλεσης (Το chefId καθορίζει ποια εικόνα θα φορτώσει)
    steps: [
      { num: 1, title: 'Cook the pasta', chefId: 1, text: 'Cook your noodles in boiling, salted water, until the pasta is al dente. Drain the pasta and reserve some of the pasta water.' },
      { num: 2, title: 'Make the sauce', chefId: 2, text: 'While the pasta is cooking, heat olive oil in a pan over medium heat. Add the garlic, and sauté until it starts to turn golden. Add the tomatoes, oregano, salt, and pepper, and cook for 3-4 minutes.' },
      { num: 3, title: 'Finish the pasta', chefId: 1, text: 'Add the noodles to the sauce, then add pasta water until the sauce is the right consistency. Simmer for 1 minute, then add the spinach, basil, chili flakes, and parmesan.' },
      { num: 4, title: 'Make the sauce', chefId: 2, text: 'Lower the heat to low, stir until mixed, and remove from the heat. Season to taste, top with parmesan cheese, and enjoy.' }
    ]
  };

  isLiked = false;

  toggleLike() {
    this.isLiked = !this.isLiked;
    this.isLiked ? this.recipe.likes++ : this.recipe.likes--;
  }
}
