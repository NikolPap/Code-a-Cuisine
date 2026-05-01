import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { RecipeGenerator } from './pages/recipe-generator/recipe-generator';
import { Preferences } from './pages/preferences/preferences';
import { RecipeResults } from './pages/recipe-results/recipe-results';


export const routes: Routes = [
   { path: '', component: LandingPage },
  { path: 'generate', component: RecipeGenerator},
   { path: 'preferences', component: Preferences },
     { path: 'results', component: RecipeResults}
];
