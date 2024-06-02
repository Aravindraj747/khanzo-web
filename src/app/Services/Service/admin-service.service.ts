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

  getAdmin(email: string) {
    // console.log('get admin')
    this.firestore.collection('admin').doc<Admin>(email).get().subscribe(res => {
      sessionStorage.setItem('adminLogin', this.isAdmin)
    })
  }

  saveAdmin(email: string) {
    sessionStorage.setItem('adminLogin', "true");
    sessionStorage.setItem('email', email);
  }

  getStaff(email: string) {
    this.firestore.collection('staff').doc<Staff>(email).get().subscribe(res => {
      sessionStorage.setItem('staffLogin', this.isStaff)
      sessionStorage.setItem('staffRole', res.data()?.role!)
    })
  }

  saveStaff(staff: Staff) {
    sessionStorage.setItem('staffLogin', 'true')
    sessionStorage.setItem('staffRole', staff.role);
    sessionStorage.setItem('email', staff.email);
  }

  getAdminLogin() {
    if (this.isAdmin === '') {
      this.isAdmin = sessionStorage.getItem('adminLogin')!;
    }
    return this.isAdmin;
  }

  getStaffRole() {
    return sessionStorage.getItem('staffRole');
  }

  getStaffLogin() {
    if (this.isStaff === '') {
      this.isStaff = sessionStorage.getItem('staffLogin')!;
    }
    return this.isStaff;
  }

  checkIfAdmin(id: string) {
    return this.firestore.collection('admin', ref => ref.where("email", "==", id)).get();
  }

  checkIfStaff(id: string) {
    return this.firestore.collection('staff', ref => ref.where("email", "==", id)).get();
  }

  getEmail(): string {
    return sessionStorage.getItem('email')!;
  }
}
