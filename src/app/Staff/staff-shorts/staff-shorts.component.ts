import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { Shorts } from 'src/app/models/shorts';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';

@Component({
  selector: 'app-staff-shorts',
  templateUrl: './staff-shorts.component.html',
  styleUrls: ['./staff-shorts.component.css']
})
export class StaffShortsComponent implements OnInit {

  spinnerActive:boolean = false;
  shorts: Shorts = {
    shortsLink: '',
    shortsId: '',
    uploadDate:Timestamp.now()
  }
  shortsArrays: Shorts[] =[];
  constructor(private _snackBar: MatSnackBar, 
              private firestoreService: FirestoreServiceService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.shorts.uploadDate = Timestamp.now();
    const shortsArray: Shorts[] = []
    this.firestoreService.getShorts().ref.get().then(res => {
      res.forEach(function (doc) {
        shortsArray.push(<Shorts>doc.data());
      });
    });
    this.shortsArrays = shortsArray;
    console.log(this.shortsArrays);
  }

  submit() {
    console.log('in submit');
    this.spinnerActive = true;
    console.log(this.shorts.shortsLink);
    if (this.shorts.shortsLink == '') {
      console.log('paste link in required field');
      this.spinnerActive = false;
      this.openSnackBar('Paste link in required field', 'retry');
    }
    else {
      console.log('have link');
      this.shorts.shortsId = Timestamp.now().seconds.toString();
      this.firestoreService.saveShorts(this.shorts).then(res => {
        this.spinnerActive = false;
        this.shortsArrays.push(this.shorts);
        this.openSnackBar('Shorts saved successfully', 'undo');
        this.resetPage();
      });
    }
  }
  delete(id:string,type:string){
    console.log(id,type);
    return this.dialog.open(DialogComponent,{
      data:{
        // withdrawal:withdrawal,value
        value:type,id
      }
    })
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 2000,
    })
  }
  resetPage() {
    this.shorts = {
      shortsLink: '',
      shortsId: '',
      uploadDate:Timestamp.now()
    }
  }
}
