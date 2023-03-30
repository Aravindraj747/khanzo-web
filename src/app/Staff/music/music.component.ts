import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { Music } from 'src/app/models/music';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {

  music: Music = {
    videoUrl:'',
    imageUrl:'',
    uploadDate:Timestamp.now(),
    language:'',
    category:'',
    id:'',
  }
  musicArray: Music[] = [];
  category: any[] = ["Entertainment", "Education", "Comdey", "News", "Trailers", "Movies", "Cinema"];
  thumbImageFile: any = undefined;
  spinnerActive: boolean = false;

  constructor(private firestoreService: FirestoreServiceService,
              private _snackBar: MatSnackBar,
              private dialog:MatDialog) {
  }

  ngOnInit(): void {
    this.music.uploadDate = Timestamp.now();
    console.log(this.music.uploadDate);
    const youTubeArray: Music[] = []
    this.firestoreService.getMusic().ref.get().then(res => {
      res.forEach(function (doc) {
        youTubeArray.push(<Music>doc.data());
      });
    });
    this.musicArray = youTubeArray;
    console.log(this.musicArray);
  }
  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }
  submit() {
    console.log('yub');
    this.spinnerActive = true;
    if(this.thumbImageFile == undefined && this.music.imageUrl == ''){
      this.openSnackBar('Choose one option for upload image','retry');
      this.spinnerActive = false
    }
    console.log(this.music.imageUrl);
    console.log(this.thumbImageFile);
    this.music.id = Timestamp.now().seconds.toString();
    // this.music.uploadDate = Date();
    console.log(this.music.id);
    if (this.music.imageUrl !== '') {
      // download and push to storage and save link in database
      this.firestoreService.saveMusic(this.music).then(res => {
        console.log("music directlink saved");
        this.musicArray.push(this.music);
        this.openSnackBar("Link Saved Successfully", "Close");
        this.resetPage()
        this.spinnerActive = false;
      });
    }
    else if (this.thumbImageFile !== undefined) {
      // push to storage and save link in database
      console.log('before', this.music);
      this.putStorageItem(this.thumbImageFile);
    }
  }

  delete(id:string,type:string){
    console.log(id,type);
    return this.dialog.open(DialogComponent,{
      data:{
        value:type,id
      }
    })
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
          this.music.imageUrl = downloadURL;
          console.log('after:', this.music);
          if (this.music.imageUrl !== "") {
            this.firestoreService.saveMusic(this.music).then(res => {
              this.musicArray.push(this.music);
              console.log("music link saved from storage");
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
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 2000,
    });
  }

  resetPage() {
    this.music = {
      videoUrl: "",
      imageUrl: "",
      category: "",
      language: "",
      id: "",
      uploadDate:Timestamp.now()
    }
  }
}
