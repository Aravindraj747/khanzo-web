import {Component, OnInit, ViewChild} from '@angular/core';
import {Timestamp} from '@angular/fire/firestore';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from '@angular/fire/storage';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {DialogComponent} from 'src/app/Admin/dialog/dialog.component';
import {FirestoreServiceService} from 'src/app/Services/firestore-service.service';
import {OnlineShop, OnlineShopExportArray} from 'src/app/models/online';
import * as XLSX from 'xlsx';
import {of} from "rxjs";
import {ShopCategory} from "../../models/shopCategory";
import {Admin} from "../../models/admin";
import {AdminServiceService} from "../../Services/Service/admin-service.service";

@Component({
  selector: 'app-online-shop',
  templateUrl: './online-shop.component.html',
  styleUrls: ['./online-shop.component.css']
})
export class OnlineShopComponent implements OnInit {

  onlineShop: OnlineShop = {
    name: '',
    availability: '',
    websiteName: '',
    uploadDate: Timestamp.now(),
    buyLink: '',
    id: '',
    imageUrl: '',
    category: '',
    price: '',
    rating: '',
    addedBy: ''
  }
  onlineShopExportedArray: OnlineShopExportArray[] = [];
  category: ShopCategory[] = [];
  fileName: string = 'onlineShop.xlsx';
  onlineShops: OnlineShop[] = [];
  thumbImageFile: any = undefined;
  spinnerActive: boolean = false;

  displayedColumns: string[] = ['Id', 'Name', 'UploadDate', 'WebsiteName', 'BuyLink', 'Image', 'Delete'];
  dataSource = new MatTableDataSource<OnlineShop>(this.onlineShops);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<OnlineShop>(this.onlineShops);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getOnlineshops().snapshotChanges().subscribe(res => {
      this.onlineShops = [];
      res.forEach(doc => {
        this.onlineShops.push(<OnlineShop>doc.payload.doc.data());
      });
      this.dataSource.data = this.onlineShops;
      console.log(this.dataSource.data);
    });
    this.firestoreService.getShopCategoriesByAvailability('ONLINE').subscribe(res => {
      this.category = [];
      res.forEach(doc => {
        this.category.push(<ShopCategory>doc.data());
      });
    });
  }

  constructor(private firestoreService: FirestoreServiceService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog,
              private adminService: AdminServiceService) {
  }

  ngOnInit(): void {
    // this.onlineShop.uploadDate = Timestamp.now();
    // console.log(this.onlineShop.uploadDate);
    // const onlineshops: OnlineShop[] = [];
    // this.firestoreService.getOnlineshops().snapshotChanges().subscribe(res => {
    //   res.forEach(doc => {
    //     onlineshops.push(<OnlineShop>doc.payload.doc.data());
    //   })
    // });
    // this.firestoreService.getOnlineshops().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     onlineshops.push(<OnlineShop>doc.data());
    //   });
    // });
    // this.onlineShops = onlineshops;
  }

  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }

  submit() {
    this.onlineShop.addedBy = this.adminService.getEmail();
    // if (this.onlineShop.category == "Grocery") {
    //   this.onlineShop.category = "Grocery"
    // } else if (this.onlineShop.category == "Mobiles") {
    //   this.onlineShop.category = "mobiles"
    // } else if (this.onlineShop.category == "Fashion") {
    //   this.onlineShop.category = "fashion"
    // } else if (this.onlineShop.category == "Electronics") {
    //   this.onlineShop.category = "electronics"
    // } else if (this.onlineShop.category == "Home") {
    //   this.onlineShop.category = "home"
    // } else if (this.onlineShop.category == "Personal Care") {
    //   this.onlineShop.category = "personalcare"
    // } else if (this.onlineShop.category == "Appliances") {
    //   this.onlineShop.category = "appliances"
    // } else if (this.onlineShop.category == "Toys & Baby") {
    //   this.onlineShop.category = "toys"
    // } else if (this.onlineShop.category == "Furniture") {
    //   this.onlineShop.category = "furniture"
    // } else if (this.onlineShop.category == "Fight & Hotels") {
    //   this.onlineShop.category = "flights"
    // } else if (this.onlineShop.category == "Sports") {
    //   this.onlineShop.category = "sports"
    // } else if (this.onlineShop.category == "Nutrition & more") {
    //   this.onlineShop.category = "nutrition"
    // } else if (this.onlineShop.category == "Bikes & Cars") {
    //   this.onlineShop.category = "bikes"
    // } else if (this.onlineShop.category == "Medicines") {
    //   this.onlineShop.category = "medicines"
    // }
    this.onlineShop.availability = 'ONLINE';
    this.onlineShop.uploadDate = Timestamp.now();
    this.onlineShop.id = Timestamp.now().seconds.toString();
    this.spinnerActive = true;
    if (this.thumbImageFile == undefined && this.onlineShop.imageUrl == '') {
      this.openSnackBar('Choose one option for upload image', 'retry');
      this.spinnerActive = false
    }
    if (this.onlineShop.imageUrl !== '') {
      // download and push to storage and save link in database
      this.firestoreService.saveOnlineshop(this.onlineShop).then(res => {
        this.onlineShops.push(this.onlineShop);
        this.openSnackBar("Link Saved Successfully", "Close");
        this.resetPage()
        this.spinnerActive = false;
      });
    } else if (this.thumbImageFile !== undefined) {
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.spinnerActive = false;
          this.onlineShop.imageUrl = downloadURL;
          if (this.onlineShop.imageUrl !== "") {
            this.firestoreService.saveOnlineshop(this.onlineShop).then(res => {
              this.onlineShops.push(this.onlineShop);
              this.openSnackBar("Link Saved Successfully", "close");
              this.spinnerActive = false;
              this.resetPage();
            });
          } else {
            this.openSnackBar('Error occured', 'retry');
            this.spinnerActive = false;
          }
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          });
        });
      });
  }

  export() {
    this.onlineShops.forEach(res => {
      const online: OnlineShopExportArray = {
        name: '',
        availability: '',
        websiteName: '',
        uploadDate: '',
        buyLink: '',
        id: '',
        imageUrl: '',
        category: '',
        rating: '',
        price: '',
        addedBy: ''
      }
      online.name = res.name;
      online.availability = res.availability;
      online.websiteName = res.websiteName;
      online.uploadDate = res.uploadDate.toDate().toString();
      online.buyLink = res.buyLink;
      online.id = res.id;
      online.imageUrl = res.imageUrl;
      online.category = res.category;
      online.rating = res.rating;
      online.price = res.price;
      online.addedBy = res.addedBy;
      this.onlineShopExportedArray.push(online);
    });
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.onlineShopExportedArray;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'onlineShops.xlsx');
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

      for (let i = 0; i < this.onlineShops.length; i++) {
        if (this.onlineShops[i].id === id) {
          this.onlineShops.splice(i, 1);
          break;
        }
      }
    });
  }

  resetPage() {
    this.onlineShop = {
      name: '',
      availability: '',
      websiteName: '',
      uploadDate: Timestamp.now(),
      buyLink: '',
      id: '',
      imageUrl: '',
      category: '',
      price: '',
      rating: '',
      addedBy: ''
    }
  }

  protected readonly of = of;
}
