import { Component, ElementRef, ViewChild, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe';
import { Cuisine, RecipeListItem } from '../../shared/interfaces'; 

@Component({
  selector: 'app-cookbook',
  standalone: true, 
  imports: [RouterLink, CommonModule],
  templateUrl: './cookbook.html',
  styleUrl: './cookbook.scss',
})
export class Cookbook implements OnInit {
  
  private recipeService = inject(RecipeService);
  private cdr = inject(ChangeDetectorRef);
  mostLikedRecipes: RecipeListItem[] = [];

  cuisines: Cuisine[] = [
    { id: 'italian', name: 'Italian cuisine', emoji: '🤌', image: 'assets/images/italian.svg' },
    { id: 'german', name: 'German cuisine', emoji: '🥨', image: 'assets/images/german.svg' },
    { id: 'japanese', name: 'Japanese cuisine', emoji: '🥢', image: 'assets/images/japanese.svg' },
    { id: 'gourmet', name: 'Gourmet cuisine', emoji: '✨', image: 'assets/images/gourmet.svg' },
    { id: 'indian', name: 'Indian cuisine', emoji: '🍛', image: 'assets/images/indian.svg' },
    { id: 'fusion', name: 'Fusion cuisine', emoji: '🍢', image: 'assets/images/fusion.svg' }
  ];

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  isDown = false;
  startX: number = 0;
  scrollLeft: number = 0;

  /** Fetches all recipes from the database and displays the top 10 most liked ones. */
  ngOnInit() {
    this.recipeService.getAllRecipes().subscribe((recipes: RecipeListItem[]) => {
      const sortedRecipes = recipes.sort((a, b) => b.likes - a.likes);
      this.mostLikedRecipes = sortedRecipes.slice(0, 10);
      
      this.cdr.detectChanges();
    });
  }

  /** Initializes the drag-to-scroll functionality when the mouse button is pressed. */
  onMouseDown(e: MouseEvent) {
    this.isDown = true;
    this.startX = e.pageX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  /** Deactivates the drag-to-scroll state when the mouse button is released. */
  onMouseUp() { this.isDown = false; }

  /** Deactivates the drag-to-scroll state when the mouse leaves the container area. */
  onMouseLeave() { this.isDown = false; }

  /** Calculates and applies the horizontal scroll position based on mouse movement during a drag. */
  onMouseMove(e: MouseEvent) {
    if (!this.isDown) return; 
    e.preventDefault(); 
    const x = e.pageX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2; 
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }
}