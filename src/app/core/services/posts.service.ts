import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private db = inject(Firestore);
  private postsCollection = collection(this.db, 'posts');

  getPosts(): Observable<Post[]> {
    return new Observable((observer) => {
      const postsQuery = query(this.postsCollection);
      return onSnapshot(
        postsQuery,
        (snapshot) => observer.next(snapshot.docs.map((docSnapshot) => this.mapDocumentToPost(docSnapshot.id, docSnapshot.data()))),
        (error) => observer.error(error)
      );
    });
  }

  getPostsByMenuId(menuId: string): Observable<Post[]> {
    return new Observable((observer) => {
      const postsByMenuQuery = query(this.postsCollection, where('menu_id', '==', menuId));
      return onSnapshot(
        postsByMenuQuery,
        (snapshot) => observer.next(snapshot.docs.map((docSnapshot) => this.mapDocumentToPost(docSnapshot.id, docSnapshot.data()))),
        (error) => observer.error(error)
      );
    });
  }

  addPost(post: Omit<Post, 'id'>): Promise<unknown> {
    return addDoc(this.postsCollection, post);
  }

  updatePost(postId: string, post: Partial<Omit<Post, 'id'>>): Promise<void> {
    return updateDoc(doc(this.db, `posts/${postId}`), post);
  }

  deletePost(postId: string): Promise<void> {
    return deleteDoc(doc(this.db, `posts/${postId}`));
  }

  private mapDocumentToPost(id: string, data: unknown): Post {
    return { id, ...(data as Omit<Post, 'id'>) };
  }
}
