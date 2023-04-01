import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, user, authState, Auth } from '@angular/fire/auth';
import { AdminServiceService } from './Service/admin-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {


  constructor(private firestore: AngularFirestore,
              private fireauth: AngularFireAuth,
              private app: FirebaseApp) { }

  // Admin
  adminLogin(email:string,password:string){
    const auth = getAuth(this.app)
    return signInWithEmailAndPassword(auth,email,password);
  }
  login(email: string, password: string) {
    const auth = getAuth(this.app)
    return signInWithEmailAndPassword(auth, email, password);
  }
  logout() {
    sessionStorage.removeItem('adminLogin');
    sessionStorage.removeItem('staffLogin');
    return this.fireauth.signOut();
  }
}

