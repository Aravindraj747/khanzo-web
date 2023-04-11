import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Youtube } from '../../models/youTube';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';
export interface Vegetable {
  name: string;
}

@Component({
  selector: 'app-staff-youtube',
  templateUrl: './staff-youtube.component.html',
  styleUrls: ['./staff-youtube.component.css']
})
export class StaffYoutubeComponent implements OnInit {

  youtubeArray: Youtube[] = [];
  dataSource = new MatTableDataSource<Youtube>(this.youtubeArray);

  category: any[] = ["Trending Videos", "Entertainment", "Education", "Comedy", "News", "Trailers", "Movies", "Cinema"];
  language: any[] = ['English', 'Tamil', 'Kanada', 'Telugu', 'Hindi', 'Malayalam'];
  displayedColumns: string[] = ['Id', 'Category', 'Language', 'UploadDate', 'Video', 'Image', 'Delete'];

  youtube: Youtube = {
    videoUrl: "",
    imageUrl: "",
    category: "",
    language: "",
    id: "",
    uploadDate: Timestamp.now()
  }
  thumbImageFile: any = undefined;
  spinnerActive: boolean = false;
  fileName: string = 'youtube.xlsx';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Youtube>(this.youtubeArray);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getYoutube().snapshotChanges().subscribe(res => {
      this.youtubeArray = [];
      res.forEach(doc => {
        this.youtubeArray.push(<Youtube>doc.payload.doc.data());
      });
      this.dataSource.data = this.youtubeArray;
    });
  }

  constructor(private firestoreService: FirestoreServiceService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    console.log(this.youtube.uploadDate);
  }
  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }
  submit() {
    this.youtube.uploadDate = Timestamp.now();
    console.log(this.youtube);
    this.spinnerActive = true;
    if (this.thumbImageFile == undefined && this.youtube.imageUrl == '') {
      this.openSnackBar('Choose one option for upload image', 'retry');
      this.spinnerActive = false
    }
    console.log(this.youtube.imageUrl);
    console.log(this.thumbImageFile);
    this.youtube.id = Timestamp.now().seconds.toString();
    // this.youtube.uploadDate = Date();
    console.log(this.youtube.id);
    if (this.youtube.imageUrl !== '') {
      // download and push to storage and save link in database
      this.firestoreService.saveYoutube(this.youtube).then(res => {
        console.log("youtube directlink saved");
        this.youtubeArray.push(this.youtube);
        this.openSnackBar("Link Saved Successfully", "Close");
        this.resetPage()
        this.spinnerActive = false;
      });
    }
    else if (this.thumbImageFile !== undefined) {
      // push to storage and save link in database
      console.log('before', this.youtube);
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

      for (let i = 0; i < this.youtubeArray.length; i++) {
        if (this.youtubeArray[i].id === id) {
          this.youtubeArray.splice(i, 1);
          this.dataSource.data = this.youtubeArray;
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
          this.youtube.imageUrl = downloadURL;
          console.log('after:', this.youtube);
          if (this.youtube.imageUrl !== "") {
            this.firestoreService.saveYoutube(this.youtube).then(res => {
              this.youtubeArray.push(this.youtube);
              console.log("youtube link saved from storage");
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
    this.youtube = {
      videoUrl: "",
      imageUrl: "",
      category: "",
      language: "",
      id: "",
      uploadDate: Timestamp.now()
    }
  }
}
