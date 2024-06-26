import {formatDate} from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Firestore, Timestamp} from '@angular/fire/firestore';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from '@angular/fire/storage';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {DialogComponent} from 'src/app/Admin/dialog/dialog.component';
import {Shorts, ShortsExportArray} from 'src/app/models/shorts';
import {FirestoreServiceService} from 'src/app/Services/firestore-service.service';
import * as XLSX from 'xlsx';
import {AdminServiceService} from "../../Services/Service/admin-service.service";

@Component({
  selector: 'app-staff-shorts',
  templateUrl: './staff-shorts.component.html',
  styleUrls: ['./staff-shorts.component.css']
})
export class StaffShortsComponent implements OnInit {

  language: any[] = ['English', 'Tamil', 'Kanada', 'Telugu', 'Hindi', 'Malayalam'];
  spinnerActive: boolean = false;
  shorts: Shorts = {
    videoUrl: '',
    id: '',
    language: '',
    imageUrl: '',
    uploadDate: Timestamp.now(),
    addedBy: ''
  }
  shortExportArray: ShortsExportArray[] = [];
  fileName: string = 'shorts.xlsx';
  thumbImageFile: any = undefined;
  shortsArrays: Shorts[] = [];

  dataSource = new MatTableDataSource<Shorts>(this.shortsArrays);
  displayedColumns: string[] = ['Id', 'uploadDate', 'Language', 'Video', 'Image', 'Delete'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Shorts>(this.shortsArrays);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getShorts().snapshotChanges().subscribe(res => {
      this.shortsArrays = [];
      res.forEach(doc => {
        this.shortsArrays.push(<Shorts>doc.payload.doc.data());
      });
      this.dataSource.data = this.shortsArrays;
    });
  }

  constructor(private _snackBar: MatSnackBar,
              private firestoreService: FirestoreServiceService,
              private dialog: MatDialog,
              private adminService: AdminServiceService) {
  }

  ngOnInit(): void {
    // this.shorts.uploadDate = Timestamp.now();
    // const shortsArray: Shorts[] = [];
    // this.firestoreService.getShorts().snapshotChanges().subscribe(res => {
    //   res.forEach(doc => {
    //     shortsArray.push(<Shorts>doc.payload.doc.data());
    //   })
    // });
    // this.firestoreService.getShorts().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     shortsArray.push(<Shorts>doc.data());
    //   });
    // });
    // this.shortsArrays = shortsArray;
    // console.log(this.shortsArrays);
  }

  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }

  submit() {
    this.shorts.uploadDate = Timestamp.now();
    this.shorts.id = Timestamp.now().seconds.toString();
    this.shorts.addedBy = this.adminService.getEmail();
    this.spinnerActive = true;
    if (this.shorts.videoUrl !== '') {
      if (this.shorts.imageUrl !== '') {
        this.firestoreService.saveShorts(this.shorts).then(res => {
          this.shortsArrays.push(this.shorts);
          this.spinnerActive = false;
          this.openSnackBar('Saved Successfully', 'undo');
          this.resetPage();
        });
        return
      } else if (this.thumbImageFile !== undefined) {
        this.putStorageItem(this.thumbImageFile);
      }
    } else {
      this.spinnerActive = false;
      this.openSnackBar('Enter link to save', 'retry');
      return
    }
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
        // console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.spinnerActive = false;
          this.shorts.imageUrl = downloadURL;
          // console.log('after:', this.shorts);
          if (this.shorts.imageUrl !== "") {
            this.firestoreService.saveShorts(this.shorts).then(res => {
              this.shortsArrays.push(this.shorts);
              // console.log("Shorts link saved from storage");
              this.openSnackBar("Link Saved Successfully", "close");
              this.spinnerActive = false;
              this.resetPage();
            });
          } else {
            this.openSnackBar('Error occured', 'retry');
            this.spinnerActive = false;
          }
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('File available at', downloadURL);
          });
        });
      });
  }

  delete(id: string, type: string) {
    // console.log(id,type);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        value: type, id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for (let i = 0; i < this.shortsArrays.length; i++) {
        if (this.shortsArrays[i].id === id) {
          // console.log('deleting', this.shortsArrays[i].id);
          this.shortsArrays.splice(i, 1);
          break;
        }
      }

    });
  }

  export() {
    this.shortsArrays.forEach(res => {
      const short: ShortsExportArray = {
        videoUrl: '',
        id: '',
        language: '',
        imageUrl: '',
        uploadDate: '',
        addedBy: ''
      }
      short.videoUrl = res.videoUrl;
      short.id = res.id;
      short.language = res.language;
      short.imageUrl = res.imageUrl;
      short.uploadDate = res.uploadDate.toDate().toString();
      short.addedBy = res.addedBy;
      this.shortExportArray.push(short);
    });
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.shortExportArray;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'shorts.xlsx');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 2000,
    })
  }

  resetPage() {
    this.shorts = {
      videoUrl: '',
      language: '',
      id: '',
      imageUrl: '',
      uploadDate: Timestamp.now(),
      addedBy: ''
    }
  }
}
