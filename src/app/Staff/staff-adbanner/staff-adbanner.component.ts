import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { AdBanner } from 'src/app/models/adBanner';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import { StaffServiceService } from 'src/app/Services/staff-service.service';
import data from '../../../assets/district.json';

enum type {
  imageURL = 'image',
  videoURL = 'video'
}
@Component({
  selector: 'app-staff-adbanner',
  templateUrl: './staff-adbanner.component.html',
  styleUrls: ['./staff-adbanner.component.css']
})
export class StaffAdbannerComponent implements OnInit {

  adBanner: AdBanner = {
    imageUrl: '',
    videoUrl: '',
    adBannerId: '',
    uploadDate:Timestamp.now(),
    state:'',
    district:''
  }
  states:any = []
  districts:any = []
  countries = {};
  length = 0;
  state:string = '';
  adbannerArray: AdBanner[] =[];
  spinnerActive:boolean = false;
  ImageFile: any = undefined;
  VideoFile: any = undefined;
  files: [any, type][] = []
  constructor(private _snackBar: MatSnackBar,
              private firestoreService: FirestoreServiceService,
              private dialog: MatDialog,
              private service: StaffServiceService) { 
              }

  ngOnInit(): void {
    for(var state of data){
      this.states.push(state.name);
    }
    return
    this.service.getCountries().subscribe(
      data =>this.countries = data
    );
    console.log(this.countries);
    this.adBanner.uploadDate = Timestamp.now();
    const adBannerArray:AdBanner[] = [];
    this.firestoreService.getadBanner().ref.get().then(res => {
      res.forEach(function (doc) {
        adBannerArray.push(<AdBanner>doc.data());
      });
    });
    this.adbannerArray = adBannerArray;
  }
  chooseImage(event: any) {
    this.ImageFile = event.target.files[0];
  }
  chooseVideo(event: any) {
    this.VideoFile = event.target.files[0];
  }
  getdistrict(state:string){
    console.log(state)
    for(var dist of data){
      if(dist.name == state){
        for(let i:number = 0;i<dist.districts.length;i++){
          this.districts.push(dist.districts[i])
        }
      }
    }
  }

  submit() {
    this.spinnerActive = true;
    this.length = 0;
    this.adBanner.adBannerId = Timestamp.now().seconds.toString();
    console.log(this.adBanner);
    return
    this.files = [];
    if ((this.ImageFile !== undefined) && (this.VideoFile !== undefined)){
      this.files.push([this.ImageFile, type.imageURL]);
      this.files.push([this.VideoFile, type.videoURL]);
      console.log(this.files);
    }
    else{
      this.spinnerActive = false;
      this.openSnackBar('Upload ImageFile or VideoFile to continue', 'retry');
    }
    Promise.all(
      this.files.map((item) => this.putStorageItem(item[0], item[1]))
    )
  }
  putStorageItem(file: any, type: type) {
    const storage = getStorage();
    const storageRef = ref(storage, 'adBanner/' + file.name);
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
          this.length += 1
          if (type == 'image') {
            this.adBanner.imageUrl = downloadURL;
            console.log('image:', downloadURL)
          }
          else if (type == 'video') {
            this.adBanner.videoUrl = downloadURL;
            console.log('video:', downloadURL)
          }
          if (this.length == this.files.length) {
            console.log('in saving');
            this.firestoreService.saveAdbanner(this.adBanner).then(res => {
              this.adbannerArray.push(this.adBanner);
              console.log('it returned');
              this.spinnerActive = false;
              this.resetPage();
              this.openSnackBar('Saved Successfully', 'undo');
            })
          }
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
          });
        });
      });
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
  resetPage() {
    this.adBanner = {
      videoUrl: '',
      imageUrl: '',
      adBannerId: '',
      uploadDate:Timestamp.now(),
      state:'',
      district:''
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 2000,
    });
  }
}