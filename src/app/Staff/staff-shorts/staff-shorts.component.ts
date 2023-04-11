import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { Shorts } from 'src/app/models/shorts';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import * as XLSX from 'xlsx';
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
    language:'',
    imageUrl: '',
    uploadDate: Timestamp.now()
  }
  fileName: string = 'shorts.xlsx';
  thumbImageFile: any = undefined;
  shortsArrays: Shorts[] = [];
  constructor(private _snackBar: MatSnackBar,
    private firestoreService: FirestoreServiceService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.shorts.uploadDate = Timestamp.now();
    const shortsArray: Shorts[] = [];
    this.firestoreService.getShorts().snapshotChanges().subscribe(res => {
      res.forEach(doc => {
        shortsArray.push(<Shorts>doc.payload.doc.data());
      })
    });
    // this.firestoreService.getShorts().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     shortsArray.push(<Shorts>doc.data());
    //   });
    // });
    this.shortsArrays = shortsArray;
    console.log(this.shortsArrays);
  }
  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }
  submit() {
    this.shorts.uploadDate = Timestamp.now();
    this.shorts.id = Timestamp.now().seconds.toString();
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
          this.shorts.imageUrl = downloadURL;
          console.log('after:', this.shorts);
          if (this.shorts.imageUrl !== "") {
            this.firestoreService.saveShorts(this.shorts).then(res => {
              this.shortsArrays.push(this.shorts);
              console.log("Shorts link saved from storage");
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
          console.log('deleting', this.shortsArrays[i].id);
          this.shortsArrays.splice(i, 1);
          break;
        }
      }

    });
  }
  export() {
    console.log('in function');
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
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
      language:'',
      id: '',
      imageUrl: '',
      uploadDate: Timestamp.now()
    }
  }
}
