import {Component, OnInit, ViewChild} from '@angular/core';
import {Banner, BannerExportArray} from "../../models/banner";
import {Timestamp} from "@angular/fire/firestore";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {FirestoreServiceService} from "../../Services/firestore-service.service";
import {MatDialog} from "@angular/material/dialog";
import XLSX from "xlsx";
import {DialogComponent} from "../../Admin/dialog/dialog.component";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "@angular/fire/storage";
import {MatSnackBar} from "@angular/material/snack-bar";
import data from "../../../assets/district.json";
import {Admin} from "../../models/admin";
import {AdminServiceService} from "../../Services/Service/admin-service.service";
import {CustomAdBanner} from "../../models/CustomAdBanner";

@Component({
  selector: 'app-home-ad',
  templateUrl: './home-ad.component.html',
  styleUrls: ['./home-ad.component.css']
})
export class HomeAdComponent implements OnInit {

  banner: Banner = {
    email: '',
    address: '',
    phoneNumber: '',
    uploadDate: Timestamp.now(),
    id: '',
    imageUrl: '',
    link: '',
    state: '',
    districts: [],
    adType: '',
    addedBy: ''
  }

  bannerExportedArray: BannerExportArray[] = [];
  bannerArray: Banner[] = [];
  thumbImageFile: any = undefined;
  spinnerActive: boolean = false;
  fileName: string = 'homead.xlsx';
  districts: any = []
  states: any = []
  displayedColumns: string[] = ['Id', 'Link', 'uploadDate', 'Image', 'ADType', 'Delete'];
  dataSource = new MatTableDataSource<Banner>(this.bannerArray);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private firestoreService: FirestoreServiceService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog,
              private adminService: AdminServiceService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Banner>(this.bannerArray);
    this.dataSource.paginator = this.paginator;
    for (var state of data) {
      this.states.push(state.name);
    }
    this.firestoreService.getBanner("homeAds").snapshotChanges().subscribe(res => {
      this.bannerArray = [];
      res.forEach(doc => {
        this.bannerArray.push(<Banner>doc.payload.doc.data());
      });
      this.dataSource.data = this.bannerArray;
    });
  }

  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }

  submit() {
    this.banner.addedBy = this.adminService.getEmail();
    if (this.banner!.districts?.includes("ALL")) {
      this.banner.districts = this.districts;
    }
    console.log(this.banner.districts);
    this.spinnerActive = true;
    if (this.thumbImageFile == undefined && this.banner.imageUrl == '') {
      this.openSnackBar('Choose one option for upload image', 'retry');
      this.spinnerActive = false
    }
    this.banner.id = Timestamp.now().seconds.toString();
    console.log(this.banner.id);
    if (this.banner.imageUrl !== '') {
      // download and push to storage and save link in database
      this.firestoreService.saveBanner(this.banner, "homeAds").then(res => {
        console.log("youtube directlink saved");
        this.banner.districts = this.districts;
        this.bannerArray.push(this.banner);
        this.openSnackBar("Link Saved Successfully", "Close");
        this.resetPage()
        this.spinnerActive = false;
      });
    } else if (this.thumbImageFile !== undefined) {
      // push to storage and save link in database
      this.putStorageItem(this.thumbImageFile);
    }
  }

  export() {
    this.bannerArray.forEach(res => {
      const banner: BannerExportArray = {
        email: '',
        address: '',
        phoneNumber: '',
        uploadDate: '',
        id: '',
        imageUrl: '',
        link: '',
        state: '',
        districts: '',
        addedBy: ''
      }
      banner.email = res.email;
      banner.address = res.address;
      banner.phoneNumber = res.phoneNumber;
      banner.uploadDate = res.uploadDate.toDate().toString();
      banner.id = res.id;
      banner.imageUrl = res.imageUrl;
      banner.addedBy = res.addedBy;
      if (banner.districts !== undefined)
        banner.districts = res.districts?.join(",")
      banner.adType = res.adType;
      this.bannerExportedArray.push(banner)
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
            this.firestoreService.saveBanner(this.banner, "homeAds").then(res => {
              this.bannerArray.push(this.banner);
              this.openSnackBar("Link Saved Successfully", "close");
              this.spinnerActive = false;
              this.resetPage();
            });
          } else {
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
      uploadDate: Timestamp.now(),
      link: '',
      state: '',
      districts: [],
      adType: '',
      addedBy: ''
    }
  }

  getdistrict(state: string, event: any) {
    if (!event.isUserInput) {
      return;
    }
    this.districts = [];
    for (var dist of data) {
      if (dist.name == state) {
        this.districts.push('ALL')
        for (let i: number = 0; i < dist.districts.length; i++) {
          this.districts.push(dist.districts[i])
        }

        console.log(this.districts);
      }
    }
  }

  protected readonly event = event;
}
