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
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  private db = inject(Firestore);
  private menusCollection = collection(this.db, 'menus');

  getMenus(): Observable<Menu[]> {
    return new Observable((observer) => {
      const menusQuery = query(this.menusCollection);
      return onSnapshot(
        menusQuery,
        (snapshot) => observer.next(snapshot.docs.map((docSnapshot) => this.mapDocumentToMenu(docSnapshot.id, docSnapshot.data()))),
        (error) => observer.error(error)
      );
    });
  }

  getMenusByUrl(url: string): Observable<Menu[]> {
    return new Observable((observer) => {
      const menusByUrlQuery = query(this.menusCollection, where('url', '==', url));
      return onSnapshot(
        menusByUrlQuery,
        (snapshot) => observer.next(snapshot.docs.map((docSnapshot) => this.mapDocumentToMenu(docSnapshot.id, docSnapshot.data()))),
        (error) => observer.error(error)
      );
    });
  }

  addMenu(menu: Omit<Menu, 'id'>): Promise<unknown> {
    return addDoc(this.menusCollection, menu);
  }

  updateMenu(menuId: string, menu: Partial<Omit<Menu, 'id'>>): Promise<void> {
    return updateDoc(doc(this.db, `menus/${menuId}`), menu);
  }

  deleteMenu(menuId: string): Promise<void> {
    return deleteDoc(doc(this.db, `menus/${menuId}`));
  }

  private mapDocumentToMenu(id: string, data: unknown): Menu {
    return { id, ...(data as Omit<Menu, 'id'>) };
  }
}
