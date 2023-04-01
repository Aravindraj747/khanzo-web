import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
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
    id:"",
    imageUrl:'',
    uploadDate:Timestamp.now()
  }
  thumbImageFile: any = undefined;
  reels: string = '';
  spinnerActive:boolean = false;
  reelsArray: Reels[] =[];
  constructor(private _snackBar: MatSnackBar,
              private firestoreService: FirestoreServiceService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    const reelArray: Reels[] =[];
    this.firestoreService.getReels().ref.get().then(res=>{
      res.forEach(function (doc){
        reelArray.push(<Reels>doc.data());
      });
    });
    this.reelsArray = reelArray;
    console.log(this.reelsArray);
  }
  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }
  submit() {
    this.reel.uploadDate = Timestamp.now();
    this.reel.id = Timestamp.now().seconds.toString();
    this.spinnerActive = true;
    if(this.reel.videoUrl !== ''){
      if(this.reel.imageUrl !== ''){
        this.firestoreService.saveReel(this.reel).then(res=>{
          this.reelsArray.push(this.reel);
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
  }
  delete(id:string,type:string){
    // console.log(id,type);
     const dialogRef = this.dialog.open(DialogComponent,{
      data:{
        value:type,id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for(let i = 0;i<this.reelsArray.length;i++){
        if(this.reelsArray[i].id === id){
          console.log('deleting',this.reelsArray[i].id);
          this.reelsArray.splice(i, 1);
          break;
        }
      }
    
    });
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
          this.reel.imageUrl = downloadURL;
          console.log('after:', this.reel);
          if (this.reel.imageUrl !== "") {
            this.firestoreService.saveReel(this.reel).then(res => {
              this.reelsArray.push(this.reel);
              console.log("Reel link saved from storage");
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
    })
  }
  resetPage(){
    this.reel = {
      videoUrl: '',
      id:'',
      imageUrl:'',
      uploadDate:Timestamp.now()
    }
  }
}
