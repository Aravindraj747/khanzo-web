import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { Facebook } from 'src/app/models/facebook';
import { Report } from 'src/app/models/report';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.css']
})
export class FacebookComponent implements OnInit {

  facebook: Facebook = {
    videoUrl: '',
    imageUrl: '',
    id: '',
    uploadDate: Timestamp.now()
  }
  fileName: string = 'facebook.xlsx';
  thumbImageFile: any = undefined;
  spinnerActive: boolean = false;
  faceBookArray: Facebook[] = [];
  displayedColumns: string[] = ['Id', 'uploadDate','Video','Delete'];
  dataSource = new MatTableDataSource<Facebook>(this.faceBookArray);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Facebook>(this.faceBookArray);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getFacebook().snapshotChanges().subscribe(res => {
      this.faceBookArray = [];
      res.forEach(doc => {
        this.faceBookArray.push(<Facebook>doc.payload.doc.data());
      });
      this.dataSource.data = this.faceBookArray;
    });
  }
  constructor(private firestoreService: FirestoreServiceService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    // this.facebook.uploadDate = Timestamp.now();
    // const facebookArray: Facebook[] = [];
    // this.firestoreService.getFacebook().snapshotChanges().subscribe(res => {
    //   res.forEach(doc => {
    //     facebookArray.push(<Facebook>doc.payload.doc.data());
    //   })
    // });
    // this.firestoreService.getFacebook().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     facebookArray.push(<Facebook>doc.data());
    //   });
    // });
    // this.faceBookArray = facebookArray;
    console.log(this.faceBookArray);
  }
  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }
  export() {
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.faceBookArray;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'facebook.xlsx');
  }
  submit() {
    this.facebook.uploadDate = Timestamp.now();
    this.facebook.id = Timestamp.now().seconds.toString();
    this.spinnerActive = true;
    if (this.facebook.videoUrl !== '') {
      if (this.facebook.imageUrl !== '') {
        this.firestoreService.saveFacebook(this.facebook).then(res => {
          this.faceBookArray.push(this.facebook);
          this.spinnerActive = false;
          this.openSnackBar('Saved Successfully', 'undo');
          this.resetPage();
        });
        return
      }
      else if (this.thumbImageFile !== undefined) {
        this.putStorageItem(this.thumbImageFile);
      }
    }
    else {
      this.spinnerActive = false;
      this.openSnackBar('Enter link to save', 'retry');
      return
    }
  }
  delete(id: string, type: string) {
    // console.log(id,type);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        value: type, id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for (let i = 0; i < this.faceBookArray.length; i++) {
        if (this.faceBookArray[i].id === id) {
          console.log('deleting', this.faceBookArray[i].id);
          this.faceBookArray.splice(i, 1);
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
          this.facebook.imageUrl = downloadURL;
          console.log('after:', this.facebook);
          if (this.facebook.imageUrl !== "") {
            this.firestoreService.saveFacebook(this.facebook).then(res => {
              this.faceBookArray.push(this.facebook);
              console.log("Facebook link saved from storage");
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
    this.facebook = {
      videoUrl: '',
      imageUrl: '',
      uploadDate: Timestamp.now(),
      id: ''
    }
  }
}
