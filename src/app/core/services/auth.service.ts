import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private db = inject(Firestore);

  user$: Observable<User | null> = new Observable((observer) => {
    return onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (!firebaseUser) {
        observer.next(null);
        return;
      }

      try {
        const userData = await this.ensureUserDocument(firebaseUser);
        observer.next(userData);
      } catch (error) {
        console.error('Failed to resolve authenticated user data.', error);
        observer.next(null);
      }
    });
  });

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    await this.syncUserDocument(credential.user);
  }

  private async syncUserDocument(user: FirebaseUser): Promise<void> {
    const userRef = doc(this.db, `users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      roles: { subscriber: true }
    };

    await setDoc(userRef, data, { merge: true });
  }

  private async ensureUserDocument(firebaseUser: FirebaseUser): Promise<User> {
    const userRef = doc(this.db, `users/${firebaseUser.uid}`);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data() as User;
    }

    await this.syncUserDocument(firebaseUser);
    const createdSnapshot = await getDoc(userRef);
    return createdSnapshot.data() as User;
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }
}
