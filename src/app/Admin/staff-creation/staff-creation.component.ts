import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Staff } from 'src/app/models/staff';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';

@Component({
  selector: 'app-staff-creation',
  templateUrl: './staff-creation.component.html',
  styleUrls: ['./staff-creation.component.css']
})
export class StaffCreationComponent implements OnInit {


  spinnerActive:boolean = false;
  staff: Staff = {
    email:'',
    password:''
  }

  constructor(private firestore: FirestoreServiceService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  submit(){
    if(this.staff.email !== '' && this.staff.password !== ''){
      this.firestore.createStaff(this.staff).then(res=>{
        console.log(res);
        this.openSnackBar('Staff created sucessfully','undo');
        this.resetPage();
      })
    }
    else{
      this.openSnackBar('Enter email and password to create','retry')
    }
  }
  openSnackBar(message:string,action:string){
    this._snackBar.open(message,action,{
      duration:2000,
      horizontalPosition:'center',
      verticalPosition:'bottom'
    })
  }
  resetPage(){
    this.staff = {
      email: '',
      password: ''
    }
  }
}
