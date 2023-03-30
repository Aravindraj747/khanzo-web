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
  adminLogout(){
    return this.fireauth.signOut();
  }
  login(email: string, password: string) {
    const auth = getAuth(this.app)
    return signInWithEmailAndPassword(auth, email, password);
  }
  logout() {
    console.log('before')
    console.log('adminLogin')
    console.log('staffLogin')
    sessionStorage.removeItem('adminLogin');
    sessionStorage.removeItem('staffLogin');
    console.log('after')
    console.log('adminLogin')
    console.log('staffLogin')
    return this.fireauth.signOut();
  }
  // Staff
  checkIfStaff(id: string) {
    return this.firestore.collection('staff', ref => ref.where("email", "==", id)).get();
  }
}

