import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timestamp } from 'rxjs';
import { Facebook } from 'src/app/models/facebook';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.css']
})
export class FacebookComponent implements OnInit {

  facebook: Facebook={
    videoUrl:'',
    facebookId:'',
    uploadDate:Timestamp.now()
  }
  spinnerActive:boolean = false;
  faceBookArray: Facebook[] =[];
  constructor(private firestoreService: FirestoreServiceService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.facebook.uploadDate = Timestamp.now();
    const facebookArray: Facebook[] = []
    this.firestoreService.getInstagramVideo().ref.get().then(res => {
      res.forEach(function (doc) {
        facebookArray.push(<Facebook>doc.data());
      });
    });
    this.faceBookArray = facebookArray;
    console.log(this.faceBookArray);
  }
  submit(){
    this.spinnerActive = true;
    this.facebook.facebookId = Timestamp.now().seconds.toString();
    if(this.facebook.videoUrl !== ''){
      this.firestoreService.saveFacebook(this.facebook).then(res=>{
        this.spinnerActive = false
        this.faceBookArray.push(this.facebook);
        this.openSnackBar('Paste link to save','retry');
        this.resetPage();
      });
      return
    }
    else{
      this.spinnerActive = false;
      this.openSnackBar('Paste link to save','retry');
    }
  }
  delete(id:string,type:string){

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 2000,
    });
  }

  resetPage(){
    this.facebook = {
      videoUrl: '',
      uploadDate: Timestamp.now(),
      facebookId:''
    }
  }
}
