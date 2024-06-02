import {Component, OnInit, ViewChild} from '@angular/core';
import {ShopCategory} from "../../models/shopCategory";
import {MatTableDataSource} from "@angular/material/table";
import {OnlineShop} from "../../models/online";
import {MatPaginator} from "@angular/material/paginator";
import {FirestoreServiceService} from "../../Services/firestore-service.service";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "@angular/fire/storage";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Timestamp} from "@angular/fire/firestore";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../Admin/dialog/dialog.component";
import {AdminServiceService} from "../../Services/Service/admin-service.service";
import {AddAdDialogComponent} from "../add-ad-dialog/add-ad-dialog.component";
import {EditShopCategoryDailogComponent} from "../edit-shop-category-dailog/edit-shop-category-dailog.component";

@Component({
  selector: 'app-shop-category',
  templateUrl: './shop-category.component.html',
  styleUrls: ['./shop-category.component.css']
})
export class ShopCategoryComponent implements OnInit {

  spinnerActive: boolean = false;
  shopCategories: ShopCategory[] = [];
  thumbImageFile: any = undefined;
  displayedColumns: string[] = ['Id', 'Title', 'Category', 'Availability', 'Image', 'Action', 'Delete'];
  dataSource = new MatTableDataSource<ShopCategory>(this.shopCategories);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  shopCategory: ShopCategory = {
    title: '',
    category: '',
    id: '',
    imageUrl: '',
    availability: '',
    addedBy: ''
  };

  constructor(private fireStoreService: FirestoreServiceService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog,
              private adminService: AdminServiceService) {
  }

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource<ShopCategory>(this.shopCategories);
    this.dataSource.paginator = this.paginator;
    this.fireStoreService.getShopCategories().subscribe(res => {
      this.shopCategories = [];
      res.forEach(doc => {
        this.shopCategories.push(<ShopCategory>doc.data());
      });
      this.dataSource.data = this.shopCategories;
    });
  }

  ngOnInit(): void {
    // console.log(this.youtube.uploadDate);
  }

  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
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
          this.shopCategory.imageUrl = downloadURL;
          if (this.shopCategory.imageUrl !== "") {
            this.fireStoreService.saveShopCategory(this.shopCategory).then(res => {
              this.shopCategories.push(this.shopCategory);
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
        this.shopCategories = this.shopCategories.filter(item => item.id != id);
        this.dataSource.data = this.shopCategories;
      }
    );
  }

  edit(data: ShopCategory) {
    console.log(data);
    this.dialog.open(EditShopCategoryDailogComponent, {
      data: {
        shopCategory: data
      }
    });
  }

  submit() {
    this.shopCategory.id = Timestamp.now().seconds.toString();
    this.shopCategory.addedBy = this.adminService.getEmail();
    this.spinnerActive = true;
    if (this.thumbImageFile == undefined && this.shopCategory.imageUrl == '') {
      this.openSnackBar('Choose one option for upload image', 'retry');
      this.spinnerActive = false
    }
    if (this.shopCategory.imageUrl !== '') {
      // download and push to storage and save link in database
      this.fireStoreService.saveShopCategory(this.shopCategory).then(res => {
        this.shopCategories.push(this.shopCategory);
        this.dataSource.data = this.shopCategories;
        console.log(this.shopCategories);
        this.openSnackBar("Saved Successfully", "Close");
        this.resetPage()
        this.spinnerActive = false;
      });
    } else if (this.thumbImageFile !== undefined) {
      this.putStorageItem(this.thumbImageFile);
    }
  }

  resetPage() {
    this.shopCategory = {
      title: '',
      category: '',
      id: '',
      imageUrl: '',
      availability: '',
      addedBy: ''
    };
  }
}
