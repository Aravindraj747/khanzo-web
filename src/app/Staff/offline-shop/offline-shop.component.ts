import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import { OfflineShop } from 'src/app/models/offline';
import * as XLSX from 'xlsx';
import data from '../../../assets/district.json';
import { StaffServiceService } from 'src/app/Services/staff-service.service';

@Component({
  selector: 'app-offline-shop',
  templateUrl: './offline-shop.component.html',
  styleUrls: ['./offline-shop.component.css']
})
export class OfflineShopComponent implements OnInit {

  offline: OfflineShop = {
    name: '',
    imageUrl: '',
    address: '',
    openingTime: Timestamp.now(),
    closingTime: Timestamp.now(),
    phoneNumber: '',
    availability: '',
    id: '',
    state: '',
    district: '',
    uploadDate: Timestamp.now(),

  }
  states: any = []
  districts: any = []
  countries = {};
  fileName: string = 'offlineShop.xlsx';
  offlineShops: OfflineShop[] = [];
  spinnerActive: boolean = false;
  imageFile: any = undefined;
  constructor(private _snackBar: MatSnackBar,
    private firestoreService: FirestoreServiceService,
    private dialog: MatDialog,
    private service: StaffServiceService) { }

  ngOnInit(): void {
    for (var state of data) {
      this.states.push(state.name);
    }
    this.service.getCountries().subscribe(
      data => this.countries = data
    );
    this.offline.uploadDate = Timestamp.now();
    const offlineshop: OfflineShop[] = [];
    this.firestoreService.getOfflineShop().snapshotChanges().subscribe(res => {
      res.forEach(doc => {
        offlineshop.push(<OfflineShop>doc.payload.doc.data());
      })
    });
    // this.firestoreService.getOfflineShop().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     offlineshop.push(<OfflineShop>doc.data());
    //   });
    // });
    this.offlineShops = offlineshop;
    console.log(this.offlineShops);
  }
  chooseImage(event: any) {
    this.imageFile = event.target.files[0];
  }
  getdistrict(state: string) {
    this.districts = [];
    for (var dist of data) {
      if (dist.name == state) {
        for (let i: number = 0; i < dist.districts.length; i++) {
          this.districts.push(dist.districts[i])
        }
      }
    }
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
  submit() {
    this.offline.availability = 'OFFLINE';
    const startDateString: string = String(this.offline.openingTime);
    const startDate = new Date(startDateString);
    this.offline.openingTime = Timestamp.fromDate(startDate);

    const expiryDateString: string = String(this.offline.closingTime);
    const expiryDate = new Date(expiryDateString);
    this.offline.closingTime = Timestamp.fromDate(expiryDate);

    this.offline.uploadDate = Timestamp.now();
    this.offline.id = Timestamp.now().seconds.toString();
    this.spinnerActive = true;
    if (this.imageFile == undefined && this.offline.imageUrl == '') {
      this.openSnackBar('Choose one option for upload image', 'retry');
      this.spinnerActive = false
    }
    if (this.offline.imageUrl !== '') {
      // download and push to storage and save link in database
      this.firestoreService.saveOfflineshop(this.offline).then(res => {
        console.log("youtube directlink saved");
        this.offlineShops.push(this.offline);
        this.openSnackBar("Link Saved Successfully", "Close");
        this.resetPage()
        this.spinnerActive = false;
      });
    }
    else if (this.imageFile !== undefined) {
      this.putStorageItem(this.imageFile);
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
          this.offline.imageUrl = downloadURL;
          if (this.offline.imageUrl !== "") {
            this.firestoreService.saveOfflineshop(this.offline).then(res => {
              this.offlineShops.push(this.offline);
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
  delete(id: string, type: string) {
    // console.log(id,type);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        value: type, id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for (let i = 0; i < this.offlineShops.length; i++) {
        if (this.offlineShops[i].id === id) {
          console.log('deleting', this.offlineShops[i].id);
          this.offlineShops.splice(i, 1);
          break;
        }
      }
    });
  }
  resetPage() {
    this.offline = {
      name: '',
      imageUrl: '',
      address: '',
      openingTime: Timestamp.now(),
      closingTime: Timestamp.now(),
      phoneNumber: '',
      id: '',
      state: '',
      district: '',
      availability: '',
      uploadDate: Timestamp.now(),
    }
  }
}
