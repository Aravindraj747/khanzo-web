import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    uploadDate:'',
  }
  spinnerActive:boolean = false;
  faceBookArray: Facebook[] =[];
  constructor(private firestoreService: FirestoreServiceService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.facebook.uploadDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
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

  }
  delete(id:string,type:string){

  }
}
