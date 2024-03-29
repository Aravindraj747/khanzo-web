import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { Instagram, InstagramExportArray } from 'src/app/models/instagram';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-staff-instagram',
  templateUrl: './staff-instagram.component.html',
  styleUrls: ['./staff-instagram.component.css']
})
export class StaffInstagramComponent implements OnInit {


  instagram: Instagram = {
    id:"",
    videoUrl:"",
    imageUrl:'',
    language:'',
    uploadDate:Timestamp.now()
  }
  instaExpotArrray: InstagramExportArray [] =[] ;
  language: any[] = ['English', 'Tamil', 'Kannada', 'Telugu', 'Hindi', 'Malayalam'];
  thumbImageFile: any = undefined;
  instaLink: string = '';
  errorMessage: string = '';
  jsonFile: string = '';
  fileName:string = 'instagram.xlsx';
  instaGramArray: Instagram[] = [];
  spinnerActive:boolean = false;
  displayedColumns: string[] = ['Id', 'UploadDate', 'Video', 'Image', 'Delete'];
  dataSource = new MatTableDataSource<Instagram>(this.instaGramArray);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    console.log('inv');
    this.dataSource = new MatTableDataSource<Instagram>(this.instaGramArray);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getInstagramVideo().snapshotChanges().subscribe(res => {
      this.instaGramArray = [];
      res.forEach(doc => {
        this.instaGramArray.push(<Instagram>doc.payload.doc.data());
      });
      this.dataSource.data = this.instaGramArray;
      console.log('data',this.dataSource.data);
    });
  }
  constructor(private _snackBar: MatSnackBar,
              private firestoreService: FirestoreServiceService,
              private http: HttpClient,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    // this.instagram.uploadDate = Timestamp.now();
    // const instagramArray: Instagram[] = [];
    // this.firestoreService.getInstagramVideo().snapshotChanges().subscribe(res => {
    //   res.forEach(doc => {
    //     instagramArray.push(<Instagram>doc.payload.doc.data());
    //   })
    // });
    // this.firestoreService.getInstagramVideo().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     instagramArray.push(<Instagram>doc.data());
    //   });
    // });
    // this.instaGramArray = instagramArray;
    console.log(this.instaGramArray);
  }

  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }
  delete(id:string,type:string){
    // console.log(id,type);
     const dialogRef = this.dialog.open(DialogComponent,{
      data:{
        value:type,id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for(let i = 0;i<this.instaGramArray.length;i++){
        if(this.instaGramArray[i].id === id){
          this.instaGramArray.splice(i, 1);
          break;
        }
      }
    
    });
  }
  submit() {
    this.instagram.id = Timestamp.now().seconds.toString();
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
  export() {
    this.instaGramArray.forEach(res=>{
      const insta: InstagramExportArray = {
        id:"",
        videoUrl:"",
        imageUrl:"",
        language:"",
        uploadDate:""
      }
      insta.id = res.id;
      insta.videoUrl = res.videoUrl;
      insta.imageUrl = res.imageUrl;
      insta.language = res.language;
      insta.uploadDate = res.uploadDate.toDate().toString();
      this.instaExpotArrray.push(insta);
    });
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.instaExpotArrray;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'instagram.xlsx');
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.spinnerActive = false;
          this.instagram.imageUrl = downloadURL;
          if (this.instagram.imageUrl !== "") {
            this.firestoreService.saveInstagram(this.instagram).then(res => {
              this.instaGramArray.push(this.instagram);
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
      id:"",
      imageUrl:'',
      videoUrl:"",
      language:'',
      uploadDate:Timestamp.now()
    }
  }
}
