import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { Reels } from 'src/app/models/reels';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';

@Component({
  selector: 'app-staff-reels',
  templateUrl: './staff-reels.component.html',
  styleUrls: ['./staff-reels.component.css']
})
export class StaffReelsComponent implements OnInit {

  reel: Reels = {
    videoUrl: "",
    reelsId:"",
    uploadDate:Timestamp.now()
  }
  reels: string = '';
  spinnerActive:boolean = false;
  reelsArray: Reels[] =[];
  constructor(private _snackBar: MatSnackBar,
              private firestoreService: FirestoreServiceService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.reel.uploadDate = Timestamp.now();
    const reelArray: Reels[] =[];
    this.firestoreService.getReels().ref.get().then(res=>{
      res.forEach(function (doc){
        reelArray.push(<Reels>doc.data());
      });
    });
    this.reelsArray = reelArray;
    console.log(this.reelsArray);
  }

  submit() {
    this.spinnerActive = true;
    if (this.reels !== '') {
      this.spinnerActive = false;
    } else {
      this.spinnerActive = false;
      this.openSnackBar('Paste the link to Save', 'retry');
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
  resetPage(){
    this.reel = {
      videoUrl: '',
      reelsId:'',
      uploadDate:Timestamp.now()
    }
  }
}
