import { Component, ElementRef, ViewChild  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Recipe {
  title: string;
  time: string;
  likes: number;
}

interface Cuisine {
  name: string;
  emoji: string;
  image: string;
}

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
    { name: 'Italian cuisine', emoji: '🤌', image: 'assets/images/italian.svg' },
    { name: 'German cuisine', emoji: '🥨', image: 'assets/images/german.svg' },
    { name: 'Japanese cuisine', emoji: '🥢', image: 'assets/images/japanese.svg' },
    { name: 'Gourmet cuisine', emoji: '✨', image: 'assets/images/gourmet.svg' },
    { name: 'Indian cuisine', emoji: '🍛', image: 'assets/images/indian.svg' },
    { name: 'Fusion cuisine', emoji: '🍢', image: 'assets/images/fusion.svg' }
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
