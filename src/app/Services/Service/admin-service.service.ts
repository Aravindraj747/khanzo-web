import { Injectable } from '@angular/core';
import { idToken } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Admin } from 'src/app/models/admin';
import { Staff } from 'src/app/models/staff';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  isAdmin: string = '';
  isStaff: string = '';
  constructor(private firestore: AngularFirestore) { 
  }

  getAdmin(email: string){
    console.log('get admin')
    this.firestore.collection('admin').doc<Admin>(email).get().subscribe(res=>{
      sessionStorage.setItem('adminLogin',this.isAdmin)
    })
  }

  getStaff(email:string){
    this.firestore.collection('staff').doc<Staff>(email).get().subscribe(res=>{
      sessionStorage.setItem('staffLogin',this.isStaff)
    })
  }

  getAdminLogin() {
    if (this.isAdmin === '') {
      this.isAdmin = sessionStorage.getItem('adminLogin')!;
    }
    return this.isAdmin;
  }

  getStaffLogin(){
    if (this.isStaff === '') {
      this.isStaff = sessionStorage.getItem('staffLogin')!;
    }
    return this.isStaff;
  }

  checkIfAdmin(id: string) {
    return this.firestore.collection('admin', ref => ref.where("email", "==", id)).get();
  }

  checkIfStaff(id:string){
    return this.firestore.collection('staff', ref =>ref.where("email", "==" , id)).get();
  }
}
