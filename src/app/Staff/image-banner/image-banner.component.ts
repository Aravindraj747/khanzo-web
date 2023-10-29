import { Component, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { Banner, BannerExportArray } from 'src/app/models/banner';
import { Report } from 'src/app/models/report';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-image-banner',
  templateUrl: './image-banner.component.html',
  styleUrls: ['./image-banner.component.css']
})
export class ImageBannerComponent implements OnInit {

  banner: Banner = {
    email: '',
    address: '',
    phoneNumber: '',
    uploadDate: Timestamp.now(),
    id: '',
    imageUrl: '',
  }
  bannerExportedArray:BannerExportArray[]= [];
  bannerArray: Banner[] = [];
  thumbImageFile: any = undefined;
  spinnerActive: boolean = false;
  fileName: string = 'imagebanner.xlsx';
  displayedColumns: string[] = ['Id', 'Address', 'Email', 'uploadDate','PhoneNumber','Image','Delete'];
  dataSource = new MatTableDataSource<Banner>(this.bannerArray);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Banner>(this.bannerArray);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getBanner().snapshotChanges().subscribe(res => {
      this.bannerArray = [];
      res.forEach(doc => {
        this.bannerArray.push(<Banner>doc.payload.doc.data());
      });
      this.dataSource.data = this.bannerArray;
    });
  }

  constructor(private firestoreService: FirestoreServiceService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    // this.banner.uploadDate = Timestamp.now();
    // const youTubeArray: Banner[] = [];
    // this.firestoreService.getBanner().snapshotChanges().subscribe(res => {
    //   res.forEach(doc => {
    //     youTubeArray.push(<Banner>doc.payload.doc.data());
    //   })
    // });
    // this.firestoreService.getBanner().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     youTubeArray.push(<Banner>doc.data());
    //   });
    // });
    // this.bannerArray = youTubeArray;
  }
  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }
  submit() {
    this.spinnerActive = true;
    if (this.thumbImageFile == undefined && this.banner.imageUrl == '') {
      this.openSnackBar('Choose one option for upload image', 'retry');
      this.spinnerActive = false
    }
    this.banner.id = Timestamp.now().seconds.toString();
    console.log(this.banner.id);
    if (this.banner.imageUrl !== '') {
      // download and push to storage and save link in database
      this.firestoreService.saveBanner(this.banner).then(res => {
        console.log("youtube directlink saved");
        this.bannerArray.push(this.banner);
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
  export() {
    this.bannerArray.forEach(res=>{
      const banner: BannerExportArray = {
        email: '',
        address: '',
        phoneNumber: '',
        uploadDate: '',
        id: '',
        imageUrl: '',
      }
      banner.email = res.email;
      banner.address = res.address;
      banner.phoneNumber = res.phoneNumber;
      banner.uploadDate = res.uploadDate.toDate().toString();
      banner.id = res.id;
      banner.imageUrl = res.imageUrl;
    });
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.bannerExportedArray;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'imagebanner.xlsx');
  }
  delete(id: string, type: string) {
    // console.log(id,type);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        value: type, id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for (let i = 0; i < this.bannerArray.length; i++) {
        if (this.bannerArray[i].id === id) {
          this.bannerArray.splice(i, 1);
          break;
        }
      }

    });

  }
  putStorageItem(file: any) {
    const storage = getStorage();
    const storageRef = ref(storage, 'Imagebanner/' + file.name);
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
          this.banner.imageUrl = downloadURL;
          if (this.banner.imageUrl !== "") {
            this.firestoreService.saveBanner(this.banner).then(res => {
              this.bannerArray.push(this.banner);
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
    this.banner = {
      email: "",
      imageUrl: "",
      phoneNumber: "",
      address: "",
      id: "",
      uploadDate: Timestamp.now()
    }
  }
}
