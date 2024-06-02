import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Youtube} from "../../models/youTube";
import {FirestoreServiceService} from "../../Services/firestore-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-ad-dialog',
  templateUrl: './add-ad-dialog.component.html',
  styleUrls: ['./add-ad-dialog.component.css']
})
export class AddAdDialogComponent implements OnInit {

  productForm: FormGroup;
  advIds: string[];
  bannerId: string;
  collection: string;
  id: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private firestoreService: FirestoreServiceService,
              private snackBar: MatSnackBar) {
    this.advIds = data.adIds;
    this.bannerId = data.bannerId;
    this.collection = data.collection;
    this.id = data.id;

    var sliderId: any = [];
    this.advIds?.forEach(id => {
      sliderId.push(this.fb.group({
        adId: id
      }));
    })
    this.productForm = this.fb.group({
      adIds: this.fb.array([...sliderId]) ,
    });
  }
  ngOnInit(): void {
  }
  adIds() : FormArray {
    return this.productForm.get("adIds") as FormArray
  }
  newAdID() {
    return this.fb.group({
      adId: ''
    })
  }
  addAdID() {
    this.adIds().push(this.newAdID());
  }

  removeAdID(i:number) {
    this.adIds().removeAt(i);
  }

  onSubmit() {
    var ids: number[] = [];
    this.productForm.value.adIds.forEach((data: any)=> {
      ids.push(data.adId);
    })
    console.log(ids);
    console.log(this.collection, this.id);
    this.firestoreService.updateVideo(this.collection,  this.id, {
      adIds: ids,
      bannerId: this.bannerId
    });
  }
}
