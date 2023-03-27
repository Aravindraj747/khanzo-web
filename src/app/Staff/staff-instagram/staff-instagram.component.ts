import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
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
    imageUrl:'',
    uploadDate:Timestamp.now()
  }
  thumbImageFile: any = undefined;
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

  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
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
      if(this.instagram.imageUrl !== ''){
        this.firestoreService.saveInstagram(this.instagram).then(res=>{
          this.instaGramArray.push(this.instagram);
          this.spinnerActive = false;
          this.openSnackBar('Saved Successfully','undo');
          this.resetPage();
      });
      return
    }
    else if(this.thumbImageFile !==undefined){
      this.putStorageItem(this.thumbImageFile);
    }
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
  putStorageItem(file: any) {
    const storage = getStorage();
    const storageRef = ref(storage, 'youtubethumbNail/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        this.openSnackBar('Error occurred while saving images', 'Retry')
        console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.spinnerActive = false;
          this.instagram.imageUrl = downloadURL;
          console.log('after:', this.instagram);
          if (this.instagram.imageUrl !== "") {
            this.firestoreService.saveInstagram(this.instagram).then(res => {
              this.instaGramArray.push(this.instagram);
              console.log("instagram link saved from storage");
              this.openSnackBar("Link Saved Successfully", "close");
              this.spinnerActive = false;
              this.resetPage();
            });
          }
          else {
            this.openSnackBar('Error occured', 'retry');
            this.spinnerActive = false;
          }
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
          });
        });
      });
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
      imageUrl:'',
      videoUrl:"",
      uploadDate:Timestamp.now()
    }
  }
}
