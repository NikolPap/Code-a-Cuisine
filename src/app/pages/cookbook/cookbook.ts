import { Component, ElementRef, ViewChild  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Recipe, Cuisine } from '../../shared/interfaces';

@Component({
  selector: 'app-cookbook',
  imports: [RouterLink, CommonModule,],
  templateUrl: './cookbook.html',
  styleUrl: './cookbook.scss',
})
export class Cookbook {
   mostLikedRecipes: Recipe[] = [
    { title: 'Quinoa Salad with Roasted Chickpeas', time: '20min', likes: 84 },
    { title: 'Shakshuka with Feta and Sourdough', time: '25min', likes: 112 },
    { title: 'Zucchini Noodles with Avocado Pesto', time: '15min', likes: 49 },
    { title: 'Honey Garlic Glazed Salmon', time: '20min', likes: 93 }, 
    { title: 'Creamy Mushroom Risotto', time: '35min', likes: 78 },
    { title: 'Eggplant Parmigiana Bake', time: '45min', likes: 55 },
    { title: 'Homemade Gnocchi with Sage Butter', time: '40min', likes: 61 },
    { title: 'Spicy Arrabbiata with Burrata', time: '25min', likes: 88 }
  ];

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

  onMouseDown(e: MouseEvent) {
    this.isDown = true;
    this.startX = e.pageX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  onMouseUp() {
    this.isDown = false;
  }

  onMouseLeave() {
    this.isDown = false;
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDown) return; 
    e.preventDefault(); 
    
    const x = e.pageX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2; 
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }
}
