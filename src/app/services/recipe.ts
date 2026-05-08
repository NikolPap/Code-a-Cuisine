import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, docData, updateDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FullRecipe } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private firestore = inject(Firestore);

  async saveRecipe(recipeData: FullRecipe): Promise<string> {
    const recipesCollection = collection(this.firestore, 'recipes');
    const docRef = await addDoc(recipesCollection, recipeData);
    return docRef.id; 
  }

  getAllRecipes(): Observable<FullRecipe[]> {
    const recipesCollection = collection(this.firestore, 'recipes');
    return collectionData(recipesCollection, { idField: 'id' }) as Observable<FullRecipe[]>; 
  }

  getRecipeById(id: string): Observable<FullRecipe> {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return docData(recipeDoc, { idField: 'id' }) as Observable<FullRecipe>;
  }

  async updateLikes(recipeId: string, newLikesCount: number): Promise<void> {
    const recipeDocRef = doc(this.firestore, `recipes/${recipeId}`);
    await updateDoc(recipeDocRef, { likes: newLikesCount });
  }

  async saveIngredientsList(ingredientsArray: string[]): Promise<void> {
    const docRef = doc(this.firestore, 'metadata/ingredients');
    await setDoc(docRef, { list: ingredientsArray });
  }

  getIngredientsList(): Observable<{ list: string[] }> {
    const docRef = doc(this.firestore, 'metadata/ingredients');
    return docData(docRef) as Observable<{ list: string[] }>;
  }
}