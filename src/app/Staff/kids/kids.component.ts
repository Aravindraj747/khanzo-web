import { Component, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { Kids } from 'src/app/models/kids';
import { Report } from 'src/app/models/report';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.css']
})
export class KidsComponent implements OnInit {
  kid: Kids = {
    videoUrl: '',
    imageUrl: '',
    uploadDate: Timestamp.now(),
    language: '',
    category: '',
    id: '',
  }
  fileName: string = 'kid.xlsx';
  kidsArray: Kids[] = [];
  language: any[] = ['English', 'Tamil', 'Kanada', 'Telugu', 'Hindi', 'Malayalam'];
  category: any[] = ["Rymes", "Cartoons",];
  thumbImageFile: any = undefined;
  spinnerActive: boolean = false;
  displayedColumns: string[] = ['Id', 'UploadDate','Category','Language','Image', 'Video','Delete'];
  dataSource = new MatTableDataSource<Kids>(this.kidsArray);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Kids>(this.kidsArray);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getKids().snapshotChanges().subscribe(res => {
      this.kidsArray = [];
      res.forEach(doc => {
        this.kidsArray.push(<Kids>doc.payload.doc.data());
      });
      this.dataSource.data = this.kidsArray;
    });
  }
  constructor(private firestoreService: FirestoreServiceService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    // this.kid.uploadDate = Timestamp.now();
    // console.log(this.kid.uploadDate);
    // const kidsArray: Kids[] = [];
    // this.firestoreService.getKids().snapshotChanges().subscribe(res => {
    //   res.forEach(doc => {
    //     kidsArray.push(<Kids>doc.payload.doc.data());
    //   })
    // });
    // this.firestoreService.getKids().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     kidsArray.push(<Kids>doc.data());
    //   });
    // });
    // this.kidsArray = kidsArray;
  }
  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }
  submit() {
    this.spinnerActive = true;
    if (this.thumbImageFile == undefined && this.kid.imageUrl == '') {
      this.openSnackBar('Choose one option for upload image', 'retry');
      this.spinnerActive = false
    }
    this.kid.id = Timestamp.now().seconds.toString();
    // this.kid.uploadDate = Date();
    if (this.kid.imageUrl !== '') {
      // download and push to storage and save link in database
      this.firestoreService.saveKids(this.kid).then(res => {
        this.kidsArray.push(this.kid);
        this.openSnackBar("Link Saved Successfully", "Close");
        this.resetPage()
        this.spinnerActive = false;
      });
    }
    else if (this.thumbImageFile !== undefined) {
      // push to storage and save link in database
      this.putStorageItem(this.thumbImageFile);
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

      for (let i = 0; i < this.kidsArray.length; i++) {
        if (this.kidsArray[i].id === id) {
          this.kidsArray.splice(i, 1);
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
          this.kid.imageUrl = downloadURL;
          if (this.kid.imageUrl !== "") {
            this.firestoreService.saveKids(this.kid).then(res => {
              this.kidsArray.push(this.kid);
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
  export() {
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.kidsArray;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'kid.xlsx');
  }
  resetPage() {
    this.kid = {
      videoUrl: "",
      imageUrl: "",
      category: "",
      language: "",
      id: "",
      uploadDate: Timestamp.now()
    }
  }
}
