import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, user, authState, Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {

  isAdmin: boolean = false;

  constructor(private firestore: AngularFirestore,
    private fireauth: AngularFireAuth,
    private app: FirebaseApp) { }

  // Admin
  checkIfAdmin(id: string) {
    return this.firestore.collection('admin', ref => ref.where("email", "==", id)).get();
  }
  adminLogin(email:string,password:string){
    const auth = getAuth(this.app)
    this.isAdmin = true;
    return signInWithEmailAndPassword(auth,email,password);
  }
  adminLogout(){
    this.isAdmin = true;
    return this.fireauth.signOut();
  }
  login(email: string, password: string) {
    const auth = getAuth(this.app)
    return signInWithEmailAndPassword(auth, email, password);
  }
  logout() {
    sessionStorage.removeItem('adminLogin');
    return this.fireauth.signOut();
  }
  // Staff
  checkIfStaff(id: string) {
    return this.firestore.collection('staff', ref => ref.where("email", "==", id)).get();
  }
}

