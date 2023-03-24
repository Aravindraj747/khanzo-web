import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { Instagram } from 'src/app/models/instagram';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';

@Component({
  selector: 'app-staff-instagram',
  templateUrl: './staff-instagram.component.html',
  styleUrls: ['./staff-instagram.component.css']
})
export class StaffInstagramComponent implements OnInit {


  instagram: Instagram = {
    instaId:"",
    videoUrl:"",
    uploadDate:Timestamp.now()
  }
  instaLink: string = '';
  errorMessage: string = '';
  jsonFile: string = '';
  instaGramArray: Instagram[] = [];
  spinnerActive:boolean = false;
  constructor(private _snackBar: MatSnackBar,
              private firestoreService: FirestoreServiceService,
              private http: HttpClient,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.instagram.uploadDate = Timestamp.now();
    const instagramArray: Instagram[] = []
    this.firestoreService.getInstagramVideo().ref.get().then(res => {
      res.forEach(function (doc) {
        instagramArray.push(<Instagram>doc.data());
      });
    });
    this.instaGramArray = instagramArray;
    console.log(this.instaGramArray);
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
  submit() {
    this.instagram.instaId = Timestamp.now().seconds.toString();
    console.log(this.instaLink);
    this.spinnerActive = true;
    if(this.instagram.videoUrl !== ''){
      this.firestoreService.saveInstagram(this.instagram).then(res=>{
        this.instaGramArray.push(this.instagram);
        this.spinnerActive = false;
        this.openSnackBar('Saved Successfully','undo');
        this.resetPage();
      });
      return
    }
    else{
      this.spinnerActive = false;
      this.openSnackBar('Enter link to save','retry');
      return
    }
    // if (this.instaLink !== '') {
    //   console.log(this.instaLink);
    //   const url = this.instaLink + '/?__a=1&__d=1'
    //   console.log(this.instaLink)
    //   const headers = new HttpHeaders({
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    //     "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization"
    //   })
    //   this.http.get<any>(url, { headers: headers }).subscribe(data => {
    //     console.log(data);
    //   });
    // }
    // else {
    //   this.spinnerActive = false;
    //   this.openSnackBar('Enter Instagram Link', 'retry');
    // }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
  resetPage(){
    this.instagram = {
      instaId:"",
      videoUrl:"",
      uploadDate:Timestamp.now()
    }
  }
}
