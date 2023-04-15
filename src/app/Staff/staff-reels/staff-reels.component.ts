import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { Reels } from 'src/app/models/reels';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-staff-reels',
  templateUrl: './staff-reels.component.html',
  styleUrls: ['./staff-reels.component.css']
})
export class StaffReelsComponent implements OnInit {

  reel: Reels = {
    videoUrl: "",
    id: "",
    imageUrl: '',
    uploadDate: Timestamp.now()
  }
  thumbImageFile: any = undefined;
  reels: string = '';
  spinnerActive: boolean = false;
  fileName: string = 'reels.xlsx';
  reelsArray: Reels[] = [];
  displayedColumns: string[] = ['Id', 'UploadDate', 'Video', 'Image', 'Delete'];
  dataSource = new MatTableDataSource<Reels>(this.reelsArray);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Reels>(this.reelsArray);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getReels().snapshotChanges().subscribe(res => {
      this.reelsArray = [];
      res.forEach(doc => {
        this.reelsArray.push(<Reels>doc.payload.doc.data());
      });
      this.dataSource.data = this.reelsArray;
    });
  }
  constructor(private _snackBar: MatSnackBar,
    private firestoreService: FirestoreServiceService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    // const reelArray: Reels[] = [];
    // this.firestoreService.getReels().snapshotChanges().subscribe(res => {
    //   res.forEach(doc => {
    //     reelArray.push(<Reels>doc.payload.doc.data());
    //   })
    // });
    // this.firestoreService.getReels().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     reelArray.push(<Reels>doc.data());
    //   });
    // });
    // this.reelsArray = reelArray;
    console.log(this.reelsArray);
  }
  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }
  submit() {
    this.reel.uploadDate = Timestamp.now();
    this.reel.id = Timestamp.now().seconds.toString();
    this.spinnerActive = true;
    if (this.reel.videoUrl !== '') {
      if (this.reel.imageUrl !== '') {
        this.firestoreService.saveReel(this.reel).then(res => {
          this.reelsArray.push(this.reel);
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
  } export() {
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.reelsArray;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'reels.xlsx');
  }
  delete(id: string, type: string) {
    // console.log(id,type);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        value: type, id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for (let i = 0; i < this.reelsArray.length; i++) {
        if (this.reelsArray[i].id === id) {
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.spinnerActive = false;
          this.reel.imageUrl = downloadURL;
          if (this.reel.imageUrl !== "") {
            this.firestoreService.saveReel(this.reel).then(res => {
              this.reelsArray.push(this.reel);
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
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 2000,
    })
  }
  resetPage() {
    this.reel = {
      videoUrl: '',
      id: '',
      imageUrl: '',
      uploadDate: Timestamp.now()
    }
  }
}
