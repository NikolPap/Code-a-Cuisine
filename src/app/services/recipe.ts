import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, docData, updateDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FullRecipe } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private firestore = inject(Firestore);

  /** Saves a new recipe to the Firestore database and returns the generated document ID. */
  async saveRecipe(recipeData: FullRecipe): Promise<string> {
    const recipesCollection = collection(this.firestore, 'recipes');
    const docRef = await addDoc(recipesCollection, recipeData);
    return docRef.id; 
  }

  /** Streams all recipe documents from the Firestore collection as an array of FullRecipe objects. */
  getAllRecipes(): Observable<FullRecipe[]> {
    const recipesCollection = collection(this.firestore, 'recipes');
    return collectionData(recipesCollection, { idField: 'id' }) as Observable<FullRecipe[]>; 
  }

  /** Retrieves a single recipe document from Firestore based on its unique ID. */
  getRecipeById(id: string): Observable<FullRecipe> {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return docData(recipeDoc, { idField: 'id' }) as Observable<FullRecipe>;
  }

  /** Updates the like count for a specific recipe document in the Firestore database. */
  async updateLikes(recipeId: string, newLikesCount: number): Promise<void> {
    const recipeDocRef = doc(this.firestore, `recipes/${recipeId}`);
    await updateDoc(recipeDocRef, { likes: newLikesCount });
  }

  /** Persists the master list of ingredient names to a metadata document for autocomplete functionality. */
  async saveIngredientsList(ingredientsArray: string[]): Promise<void> {
    const docRef = doc(this.firestore, 'metadata/ingredients');
    await setDoc(docRef, { list: ingredientsArray });
  }

  /** Fetches the centralized list of ingredient names from the metadata collection. */
  getIngredientsList(): Observable<{ list: string[] }> {
    const docRef = doc(this.firestore, 'metadata/ingredients');
    return docData(docRef) as Observable<{ list: string[] }>;
  }
}