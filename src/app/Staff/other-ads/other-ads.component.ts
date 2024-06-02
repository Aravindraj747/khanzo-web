import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import data from "../../../assets/district.json";
import {FirestoreServiceService} from "../../Services/firestore-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "@angular/fire/storage";
import {Timestamp} from "@angular/fire/firestore";
import {DialogComponent} from "../../Admin/dialog/dialog.component";
import {AdminServiceService} from "../../Services/Service/admin-service.service";
import {CustomAdBanner, CustomAdExportArray} from "../../models/CustomAdBanner";

@Component({
  selector: 'app-other-ads',
  templateUrl: './other-ads.component.html',
  styleUrls: ['./other-ads.component.css']
})
export class OtherAdsComponent implements OnInit {

  bannerArray: CustomAdBanner[] = [];
  dataSource = new MatTableDataSource<CustomAdBanner>(this.bannerArray);
  thumbImageFile: any = undefined;
  spinnerActive: boolean = false;
  fileName: string = 'youtube.xlsx';
  districts: string[] = [];
  bannerExportArrays: CustomAdExportArray[] = [];
  states: any = [];

  banner: CustomAdBanner = {
    adType: "", addedBy: "", districts: [], id: "", imageUrl: "", link: "", states: [], uploadDate: Timestamp.now()

  }
  displayedColumns: string[] = ['Id', 'UploadDate', 'Type', 'Image', 'States', 'Districts', 'Link', 'Delete'];


  // selectedValue: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private firestoreService: FirestoreServiceService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog,
              private adminService: AdminServiceService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<CustomAdBanner>(this.bannerArray);
    this.dataSource.paginator = this.paginator;
    this.states.push('ALL');
    for (var state of data) {
      this.states.push(state.name);
    }
    this.firestoreService.getCustomBanner("ads").snapshotChanges().subscribe(res => {
      this.bannerArray = [];
      res.forEach(doc => {
        this.bannerArray.push(<CustomAdBanner>doc.payload.doc.data());
      });
      this.dataSource.data = this.bannerArray;
    });
  }

  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }

  submit() {
    this.banner.uploadDate = Timestamp.now();
    this.banner.addedBy = this.adminService.getEmail();
    // console.log(this.youtube);
    this.spinnerActive = true;
    if (this.thumbImageFile == undefined && this.banner.imageUrl == '') {
      this.openSnackBar('Choose one option for upload image', 'retry');
      this.spinnerActive = false
    }
    // console.log(this.youtube.imageUrl);
    // console.log(this.thumbImageFile);
    this.banner.id = Timestamp.now().seconds.toString();
    // this.youtube.uploadDate = Date();
    // console.log(this.youtube.id);
    if (this.banner.imageUrl !== '') {
      // download and push to storage and save link in database
      if (this.banner!.districts?.includes("ALL") || this.banner.states.includes('ALL')) {
        this.banner.districts = this.districts;
      }
      this.firestoreService.saveCustomBanner(this.banner, "ads").then(res => {
        this.bannerArray.push(this.banner);
        this.openSnackBar("Saved Successfully", "Close");
        this.resetPage();
        this.spinnerActive = false;
      });
    } else if (this.thumbImageFile !== undefined) {
      // push to storage and save link in database
      // console.log('before', this.youtube);
      this.putStorageItem(this.thumbImageFile);
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
          this.banner.imageUrl = downloadURL;
          // console.log('after:', this.youtube);
          if (this.banner.imageUrl !== "") {
            if (this.banner!.districts?.includes("ALL") || this.banner.states.includes('ALL')) {
              this.banner.districts = this.districts;
            }
            this.banner.states = this.states;
            this.firestoreService.saveCustomBanner(this.banner, "ads").then(res => {
              this.bannerArray.push(this.banner);
              // console.log("youtube link saved from storage");
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 2000,
    });
  }

  resetPage() {
    this.banner = {
      imageUrl: "",
      id: "",
      uploadDate: Timestamp.now(),
      link: '',
      states: [],
      districts: [],
      addedBy: '',
      adType: ''
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

      for (let i = 0; i < this.bannerArray.length; i++) {
        if (this.bannerArray[i].id === id) {
          this.bannerArray.splice(i, 1);
          this.dataSource.data = this.bannerArray;
          break;
        }
      }
    });
  }

  export() {
    this.bannerArray.forEach(res => {
      const bannerExportArray: CustomAdExportArray = {
        adType: "",
        link: "",
        imageUrl: '',
        uploadDate: '',
        id: '',
        states: '',
        districts: '',
        addedBy: ''
      }
      bannerExportArray.id = res.id;
      bannerExportArray.uploadDate = res.uploadDate.toDate().toString();
      bannerExportArray.imageUrl = res.imageUrl;
      bannerExportArray.states = res.states.join(',');
      bannerExportArray.districts = res.districts?.join(",")
      bannerExportArray.link = res.link;
      bannerExportArray.addedBy = res.addedBy;

      this.bannerExportArrays.push(bannerExportArray);
    })
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.bannerExportArrays;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'ads.xlsx');
  }

  stateChange(val: string[]) {
    this.districts = [];
    console.log(this.banner.states)
    if (val.includes('ALL')) {
      this.getAllDistrict();
      return;
    }
    for (var dist of data) {
      if (this.banner.states.includes(dist.name)) {
        for (let i: number = 0; i < dist.districts.length; i++) {
          this.districts.push(dist.districts[i])
        }
      }
    }
    console.log(this.districts);
  }

  getdistrict(state: string, event: any) {
    console.log("banner States", this.banner.states);
    // if (!event.isUserInput) {
    //   return;
    // }
    // this.districts = [];
    // this.districts.push('ALL')
    //
    // for (var mapData of data) {
    //   if (mapData.name == state) {
    //     for (let i: number = 0; i < mapData.districts.length; i++) {
    //       this.districts.push(mapData.districts[i])
    //     }
    //     console.log("districts", this.districts);
    //   }
    // }
  }

  getAllDistrict() {
    this.districts = [];
    for (var dist of data) {
      for (let i: number = 0; i < dist.districts.length; i++) {
        this.districts.push(dist.districts[i])
      }
    }
    console.log(this.districts);
  }
}
