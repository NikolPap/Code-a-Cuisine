import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { RecipeGenerator } from './pages/recipe-generator/recipe-generator';
import { Preferences } from './pages/preferences/preferences';
import { RecipeResults } from './pages/recipe-results/recipe-results';
import { Cookbook } from './pages/cookbook/cookbook';
import { RecipeDetail } from './pages/recipe-detail/recipe-detail';


export const routes: Routes = [
   { path: '', component: LandingPage },
  { path: 'generate', component: RecipeGenerator},
   { path: 'preferences', component: Preferences },
    { path: 'cookbook', component: Cookbook},
    { path: 'recipe/:id', component: RecipeDetail },
     { path: 'results', component: RecipeResults}
];
