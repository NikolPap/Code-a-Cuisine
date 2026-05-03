import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe';

@Component({
  selector: 'app-cookbook-category',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './cookbook-category.html', // ή .component.html ανάλογα πώς το έχεις
  styleUrl: './cookbook-category.scss'
})
export class CookbookCategory implements OnInit {
  categoryBanner: string = '';
  currentCategory: string = '';
  
  // --- PAGINATION VARIABLES ---
  allMatchedRecipes: any[] = []; // Εδώ κρατάμε ΟΛΕΣ όσες ταιριάζουν
  recipes: any[] = []; // Εδώ κρατάμε ΜΟΝΟ τις 15 της τρέχουσας σελίδας
  
  currentPage: number = 1;
  itemsPerPage: number = 15; // Το όριο που ζήτησες
  totalPages: number = 1;
  pageNumbers: number[] = []; // Ο πίνακας για να φτιάξουμε τα κουμπάκια 1, 2, 3...

  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.currentCategory = params.get('category') || '';
      
      if (this.currentCategory) {
        this.categoryBanner = `${this.currentCategory}-recipe.svg`;
        
        this.recipeService.getAllRecipes().subscribe(allRecipes => {
          
          // 1. Βρίσκουμε όλες όσες ταιριάζουν
          this.allMatchedRecipes = allRecipes.filter(recipe => {
            if (!recipe.tags || !Array.isArray(recipe.tags)) return false;
            return recipe.tags.some((tag: string) => tag.toLowerCase() === this.currentCategory.toLowerCase());
          });

          // 2. Υπολογίζουμε πόσες σελίδες χρειαζόμαστε
          // π.χ. 16 συνταγές / 15 = 1.06 -> Στρογγυλοποιείται στο 2 (Math.ceil)
          this.totalPages = Math.ceil(this.allMatchedRecipes.length / this.itemsPerPage) || 1;
          
          // Φτιάχνουμε έναν πίνακα [1, 2, 3...] ανάλογα με τις συνολικές σελίδες
          this.pageNumbers = Array.from({length: this.totalPages}, (_, i) => i + 1);

          // 3. Εμφανίζουμε την πρώτη σελίδα
          this.goToPage(1);
        });
      }
    });
  }

  // --- ΣΥΝΑΡΤΗΣΗ ΓΙΑ ΑΛΛΑΓΗ ΣΕΛΙΔΑΣ ---
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      
      // Βρίσκουμε από ποιο μέχρι ποιο index θα "κόψουμε" τον πίνακα
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      
      // Κρατάμε μόνο τις 15 συνταγές
      this.recipes = this.allMatchedRecipes.slice(startIndex, endIndex);
      
      // Σκρολάρουμε την οθόνη πάνω-πάνω για να δει τα νέα αποτελέσματα
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Ξυπνάμε το HTML
      this.cdr.detectChanges();
    }
  }
}