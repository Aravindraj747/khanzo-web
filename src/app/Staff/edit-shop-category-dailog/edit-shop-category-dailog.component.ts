import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import {FirestoreServiceService} from "../../Services/firestore-service.service";
import {ShopCategoryComponent} from "../shop-category/shop-category.component";
import {ShopCategory} from "../../models/shopCategory";
import {MatSnackBar} from "@angular/material/snack-bar";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "@angular/fire/storage";

@Component({
  selector: 'app-edit-shop-category-dailog',
  templateUrl: './edit-shop-category-dailog.component.html',
  styleUrls: ['./edit-shop-category-dailog.component.css']
})
export class EditShopCategoryDailogComponent implements OnInit {

  shopCategory: ShopCategory;
  thumbImageFile: any = undefined;
  newImageURL: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private firestoreService: FirestoreServiceService,
              private snackBar: MatSnackBar) {
    this.shopCategory = data.shopCategory;
    this.newImageURL = this.shopCategory.imageUrl;
  }

  ngOnInit(): void {
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
          // this.spinnerActive = false;
          this.shopCategory.imageUrl = downloadURL;
          if (this.shopCategory.imageUrl !== "") {
            this.firestoreService.saveShopCategory(this.shopCategory).then(res => {
              this.openSnackBar("Link Saved Successfully", "close");
            });
          } else {
            this.openSnackBar('Error occurred', 'retry');
          }
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          });
        });
      });
  }

  onSubmit() {
    if (this.shopCategory.imageUrl !== this.newImageURL) {
      // download and push to storage and save link in database
      this.shopCategory.imageUrl = this.newImageURL;
      this.firestoreService.saveShopCategory(this.shopCategory).then(res => {
        this.openSnackBar("Link Saved Successfully", "Close");
      });
    } else if (this.thumbImageFile !== undefined) {
      this.putStorageItem(this.thumbImageFile);
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 2000,
    });
  }
}
