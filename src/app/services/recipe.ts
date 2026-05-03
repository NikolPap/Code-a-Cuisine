import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private firestore = inject(Firestore);


  async saveRecipe(recipeData: any) {
    const recipesCollection = collection(this.firestore, 'recipes');
    const docRef = await addDoc(recipesCollection, recipeData);
    return docRef.id; 
  }


  getAllRecipes(): Observable<any[]> {
    const recipesCollection = collection(this.firestore, 'recipes');
    return collectionData(recipesCollection, { idField: 'id' }); 
  }

  
  getRecipeById(id: string): Observable<any> {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return docData(recipeDoc, { idField: 'id' });
  }

   async updateLikes(recipeId: string, newLikesCount: number) {
    const recipeDocRef = doc(this.firestore, `recipes/${recipeId}`);
    await updateDoc(recipeDocRef, { likes: newLikesCount });
  }
}