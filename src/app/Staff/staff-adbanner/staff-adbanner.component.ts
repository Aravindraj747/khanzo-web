import {Component, OnInit, ViewChild} from '@angular/core';
import {Timestamp} from '@angular/fire/firestore';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from '@angular/fire/storage';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogComponent} from 'src/app/Admin/dialog/dialog.component';
import {AdBanner, AdBannerExportData} from 'src/app/models/adBanner';
import {FirestoreServiceService} from 'src/app/Services/firestore-service.service';
import {StaffServiceService} from 'src/app/Services/staff-service.service';
import data from '../../../assets/district.json';
import * as XLSX from 'xlsx';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {AdminServiceService} from "../../Services/Service/admin-service.service";

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
    id: '',
    uploadDate: Timestamp.now(),
    state: '',
    districts: [],
    views: 0,
    addedBy: ''
  }
  exportAdBanner: AdBannerExportData[] = [];
  states: any = []
  districts: any = []
  countries = {};
  length = 0;
  state: string = '';
  fileName: string = 'adbanner.xlsx';
  adbannerArray: AdBanner[] = [];
  spinnerActive: boolean = false;
  ImageFile: any = undefined;
  VideoFile: any = undefined;
  files: [any, type][] = []
  displayedColumns: string[] = ['Id', 'UploadDate', 'Video', 'Image', 'Delete'];
  dataSource = new MatTableDataSource<AdBanner>(this.adbannerArray);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<AdBanner>(this.adbannerArray);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getadBanner().snapshotChanges().subscribe(res => {
      this.adbannerArray = [];
      res.forEach(doc => {
        this.adbannerArray.push(<AdBanner>doc.payload.doc.data());
      });
      this.dataSource.data = this.adbannerArray;
    });
  }

  constructor(private _snackBar: MatSnackBar,
              private firestoreService: FirestoreServiceService,
              private dialog: MatDialog,
              private service: StaffServiceService,
              private adminService: AdminServiceService) {
  }

  ngOnInit(): void {
    for (var state of data) {
      this.states.push(state.name);
    }
    this.service.getCountries().subscribe(
      data => this.countries = data
    );
    // console.log(this.countries);
    // this.adBanner.uploadDate = Timestamp.now();
    // const adBannerArray: AdBanner[] = [];
    // this.firestoreService.getadBanner().snapshotChanges().subscribe(res => {
    //   res.forEach(doc => {
    //     adBannerArray.push(<AdBanner>doc.payload.doc.data());
    //   })
    // });
    // this.firestoreService.getadBanner().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     adBannerArray.push(<AdBanner>doc.data());
    //   });
    // });
    // this.adbannerArray = adBannerArray;
  }

  chooseImage(event: any) {
    this.ImageFile = event.target.files[0];
  }

  chooseVideo(event: any) {
    this.VideoFile = event.target.files[0];
  }

  getdistrict(state: string, event: any) {
    if (!event.isUserInput) {
      return;
    }
    this.districts = [];
    this.districts.push('ALL')
    for (var dist of data) {
      if (dist.name == state) {
        for (let i: number = 0; i < dist.districts.length; i++) {
          this.districts.push(dist.districts[i])
        }
      }
    }
  }

  submit() {
    this.spinnerActive = true;
    this.adBanner.addedBy = this.adminService.getEmail();
    this.length = 0;
    this.adBanner.id = Timestamp.now().seconds.toString();
    this.files = [];
    if ((this.ImageFile !== undefined) && (this.VideoFile !== undefined)) {
      this.files.push([this.ImageFile, type.imageURL]);
      this.files.push([this.VideoFile, type.videoURL]);
    } else {
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.length += 1
          if (type == 'image') {
            this.adBanner.imageUrl = downloadURL;
          } else if (type == 'video') {
            this.adBanner.videoUrl = downloadURL;
          }
          if (this.length == this.files.length) {
            if (this.adBanner!.districts?.includes("ALL")) {
              this.adBanner.districts = this.districts;
            }
            this.firestoreService.saveAdbanner(this.adBanner).then(res => {
              this.adbannerArray.push(this.adBanner);
              this.spinnerActive = false;
              this.resetPage();
              this.openSnackBar('Saved Successfully', 'undo');
            })
          }
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          });
        });
      });
  }

  export() {
    this.adbannerArray.forEach(res => {
      const adBanner: AdBannerExportData = {
        imageUrl: '',
        videoUrl: '',
        id: '',
        uploadDate: '',
        state: '',
        district: '',
        views: 0,
        addedBy: ''
      }
      adBanner.imageUrl = res.imageUrl;
      adBanner.videoUrl = res.videoUrl;
      adBanner.id = res.id;
      adBanner.uploadDate = res.uploadDate.toDate().toString();
      adBanner.state = res.state;
      adBanner.district = res.districts!.join(",");
      adBanner.views = res.views;
      adBanner.addedBy = res.addedBy;
      this.exportAdBanner.push(adBanner);
    });
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.exportAdBanner;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'AdbannerExcel.xlsx');
  }

  delete(id: string, type: string) {
    console.log(id, type);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        value: type, id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for (let i = 0; i < this.adbannerArray.length; i++) {
        if (this.adbannerArray[i].id === id) {
          this.adbannerArray.splice(i, 1);
          break;
        }
      }

    });
  }

  resetPage() {
    this.adBanner = {
      videoUrl: '',
      imageUrl: '',
      id: '',
      uploadDate: Timestamp.now(),
      state: '',
      districts: [],
      views: 0,
      addedBy: ''
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
