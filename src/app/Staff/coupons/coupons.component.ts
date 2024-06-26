import {Component, OnInit, ViewChild} from '@angular/core';
import {Timestamp} from '@angular/fire/firestore';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from '@angular/fire/storage';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {DialogComponent} from 'src/app/Admin/dialog/dialog.component';
import {Coupons, CouponsExportArray} from 'src/app/models/coupons';
import {FirestoreServiceService} from 'src/app/Services/firestore-service.service';
import * as XLSX from 'xlsx';
import {D} from "@angular/cdk/keycodes";
import {AdminServiceService} from "../../Services/Service/admin-service.service";

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {

  spinnerActive: boolean = false;
  imageFile: any = undefined;
  coupons: Coupons = {
    imageUrl: '',
    couponId: '',
    couponCode: '',
    availability: '',
    uploadDate: Timestamp.now(),
    addedBy: ''
  }
  couponsExportedArray: CouponsExportArray[] = [];
  availability: any[] = ['ONLINE', 'OFFLINE'];
  fileName: string = 'coupons.xlsx';
  couponArray: Coupons[] = [];
  displayedColumns: string[] = ['Id', 'uploadDate', 'ShopName', 'Availability', 'PhoneNumber', 'ProductName', 'Image', 'Delete'];
  dataSource = new MatTableDataSource<Coupons>(this.couponArray);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Coupons>(this.couponArray);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getCoupons().snapshotChanges().subscribe(res => {
      this.couponArray = [];
      res.forEach(doc => {
        this.couponArray.push(<Coupons>doc.payload.doc.data());
      });
      this.dataSource.data = this.couponArray;
    });
  }

  constructor(private _snackBar: MatSnackBar,
              private firestoreService: FirestoreServiceService,
              private dialog: MatDialog,
              private adminService: AdminServiceService) {
  }

  ngOnInit(): void {
    // this.coupons.uploadDate = Timestamp.now();
    // const couponArrays: Coupons[] =[];
    // this.firestoreService.getCoupons().snapshotChanges().subscribe(res => {
    //   res.forEach(doc => {
    //     couponArrays.push(<Coupons>doc.payload.doc.data());
    //   })
    // });
    // this.firestoreService.getCoupons().ref.get().then(res=>{
    //   res.forEach(function (doc){
    //     couponArrays.push(<Coupons>doc.data());
    //   });
    // });
    // this.couponArray = couponArrays;
  }

  chooseImage(event: any) {
    this.imageFile = event.target.files[0];
  }

  submit() {
    this.coupons.addedBy = this.adminService.getEmail();
    this.coupons.couponId = Timestamp.now().seconds.toString();
    this.spinnerActive = true;
    if (this.coupons.imageUrl == '' && this.imageFile == undefined) {
      this.openSnackBar('Choose any on option to save', 'retry');
      // this.spinnerActive = false;
    }
    if (this.coupons.imageUrl !== "") {
      const expiryDateString: string = String(this.coupons.expiryDate);
      const expiryDate = new Date(expiryDateString);
      this.coupons.expiryDate = Timestamp.fromDate(expiryDate);
      this.firestoreService.saveCoupons(this.coupons).then(res => {
        this.spinnerActive = false;
        this.openSnackBar('Coupon saved successfully', 'retry');
        this.resetPage();
      });
    } else if (this.imageFile !== undefined) {
      this.putStorageItem(this.imageFile);
    }
  }

  putStorageItem(file: any) {
    const storage = getStorage();
    const storageRef = ref(storage, 'coupon/' + file.name);
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
          this.coupons.imageUrl = downloadURL;
          if (this.coupons.imageUrl !== "") {
            const expiryDateString: string = String(this.coupons.expiryDate);
            const expiryDate = new Date(expiryDateString);
            this.coupons.expiryDate = Timestamp.fromDate(expiryDate);
            this.firestoreService.saveCoupons(this.coupons).then(res => {
            });
            this.openSnackBar('DailyTask Saved', 'undo');
            this.spinnerActive = false;
            this.resetPage();
          } else {
            this.openSnackBar('Error occured while saving Coupon', 'retry');
            this.spinnerActive = false;
          }
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          });
          return;
        });
      });
  }

  export() {
    this.couponArray.forEach(res => {
      const carray: CouponsExportArray = {
        imageUrl: '',
        couponId: '',
        couponCode: '',
        availability: '',
        uploadDate: '',
        productName: '',
        productLink: '',
        expiryDate: '',
        discount: '',
        addedBy: ''
      }
      carray.imageUrl = res.imageUrl;
      carray.couponCode = res.couponCode;
      carray.couponId = res.couponId;
      carray.uploadDate = res.uploadDate.toDate().toString();
      carray.availability = res.availability;
      carray.productName = res.productName;
      carray.productLink = res.productLink;
      carray.expiryDate = res.expiryDate?.toDate().toString();
      carray.discount = res.discount;
      carray.addedBy = res.addedBy;
      this.couponsExportedArray.push(carray);
    });
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.couponsExportedArray;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'couponsExcel.xlsx');
  }

  delete(id: string, type: string) {
    // console.log(id,type);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        value: type, id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for (let i = 0; i < this.couponArray.length; i++) {
        if (this.couponArray[i].couponId === id) {
          this.couponArray.splice(i, 1);
          break;
        }
      }

    });

  }

  resetPage() {
    this.coupons = {
      imageUrl: '',
      couponId: '',
      couponCode: '',
      availability: '',
      uploadDate: Timestamp.now(),
      mapUrl: '',
      productName: '',
      phoneNumber: '',
      addedBy: ''
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }
}
