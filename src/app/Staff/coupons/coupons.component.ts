import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { Coupons } from 'src/app/models/coupons';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {

  spinnerActive:boolean = false;
  imageFile: any = undefined;
  coupons: Coupons = {
    imageUrl: '',
    couponId: '',
    uploadDate:Timestamp.now()
  }
  fileName:string = 'coupons.xlsx';
  couponArray: Coupons[] =[];
  constructor(private _snackBar: MatSnackBar,
              private firestoreService: FirestoreServiceService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.coupons.uploadDate = Timestamp.now();
    const couponArrays: Coupons[] =[];
    this.firestoreService.getCoupons().snapshotChanges().subscribe(res => {
      res.forEach(doc => {
        couponArrays.push(<Coupons>doc.payload.doc.data());
      })
    });
    // this.firestoreService.getCoupons().ref.get().then(res=>{
    //   res.forEach(function (doc){
    //     couponArrays.push(<Coupons>doc.data());
    //   });
    // });
    this.couponArray = couponArrays;
    console.log(this.couponArray);
  }

  chooseImage(event: any) {
    this.imageFile = event.target.files[0];
  }
  submit() {
    // this.coupons.couponId = Timestamp.now().seconds.toString();
    console.log(this.coupons.couponId);
    this.spinnerActive = true;
    if(this.coupons.imageUrl == '' && this.imageFile == undefined){
      this.openSnackBar('Choose any on option to save','retry');
      // this.spinnerActive = false;
    }
    if (this.coupons.imageUrl !== "") {
      this.firestoreService.saveCoupons(this.coupons).then(res => {
        console.log("Coupon saved as image URL");
        this.spinnerActive = false;
        this.openSnackBar('Coupon saved successfully', 'retry');
        this.resetPage();
      });
    }
    else if (this.imageFile !== undefined) {
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
        console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.coupons.imageUrl = downloadURL;
          console.log(this.coupons.imageUrl);
          console.log('after:', this.coupons);
          if (this.coupons.imageUrl !== "") {
            this.firestoreService.saveCoupons(this.coupons).then(res => {
              console.log('Coupon saved as imageFile')
            });
            this.openSnackBar('DailyTask Saved', 'undo');
            this.spinnerActive = false;
            this.resetPage();
          }
          else {
            this.openSnackBar('Error occured while saving Coupon', 'retry');
            this.spinnerActive = false;
          }
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
          });
          return;
        });
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
  delete(id:string,type:string){
    // console.log(id,type);
     const dialogRef = this.dialog.open(DialogComponent,{
      data:{
        value:type,id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for(let i = 0;i<this.couponArray.length;i++){
        if(this.couponArray[i].couponId === id){
          console.log('deleting',this.couponArray[i].couponId);
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
      uploadDate:Timestamp.now()
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
