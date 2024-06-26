import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Staff } from 'src/app/models/staff';
import { AuthenticationServiceService } from 'src/app/Services/authentication-service.service';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-staff-creation',
  templateUrl: './staff-creation.component.html',
  styleUrls: ['./staff-creation.component.css']
})
export class StaffCreationComponent implements OnInit {


  spinnerActive: boolean = false;
  staff: Staff = {
    email: '',
    password: '',
    name: '',
    creationDate: Timestamp.now(),
    role: ''
  }

  roles: string[] = ['WITHDRAW_MANAGEMENT', 'YOUTUBE_VIDEOS_MANAGEMENT', 'DAILY_TASK_MANAGEMENT', 'SHOP_MANAGEMENT', 'ADS_MANAGEMENT']
  staffArray: Staff[] = [];
  displayedColumns: string[] = ['Name','Email', 'Password', 'Role', 'CreationDate','Delete'];
  dataSource = new MatTableDataSource<Staff>(this.staffArray);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Staff>(this.staffArray);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getStaff().snapshotChanges().subscribe(res => {
      this.staffArray = [];
      res.forEach(doc => {
        this.staffArray.push(<Staff>doc.payload.doc.data());
      });
      this.dataSource.data = this.staffArray;
    });
  }
  constructor(private firestoreService: FirestoreServiceService,
    private authService: AuthenticationServiceService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    const staffsArray: Staff[] = []
    this.firestoreService.getStaff().ref.get().then(res => {
      res.forEach(function (doc) {
        staffsArray.push(<Staff>doc.data());
      });
    });
    this.staffArray = staffsArray;
    // console.log(this.staffArray);
  }
  submit() {
    this.spinnerActive = true;
    if (this.staff.email !== '' && this.staff.password !== ''){
    this.authService.register(this.staff.email, this.staff.password)
      .then(res => {
        this.firestoreService.createStaff(this.staff)
          .then(res => {
            // console.log("Agent Saved");
            this.openSnackBar("Agent Created Successfully", "Close");
            this.spinnerActive = false;
            this.resetPage();
          }, err => {
            this.openSnackBar("Error Occurred while saving agent", "Retry");
            this.spinnerActive = false;

          });
      }).catch(err => {
        // console.log(err);
        this.openSnackBar("Error Occurred while creating agent", "Retry");
        this.spinnerActive = false;
      });
    }
    // if (this.staff.email !== '' && this.staff.password !== '') {

    //   this.firestoreService.createStaff(this.staff).then(res => {
    //     console.log(res);
    //     this.openSnackBar('Staff created sucessfully', 'undo');
    //     this.resetPage();
    //   })
    // }
    else {
      this.openSnackBar('Enter email and password to create', 'retry')
      this.spinnerActive = false;
    }
  }
  delete(id: string, type: string) {
    // console.log(id,type);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        value: type, id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for (let i = 0; i < this.staffArray.length; i++) {
        if (this.staffArray[i].email === id) {
          console.log('deleting', this.staffArray[i].email);
          this.staffArray.splice(i, 1);
          break;
        }
      }
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }
  resetPage() {
    this.staff = {
      email: '',
      password: '',
      name: '',
      creationDate: Timestamp.now(),
      role: ''
    }
  }
}
