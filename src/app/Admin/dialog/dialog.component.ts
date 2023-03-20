import { Component,Inject , OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Withdrawal } from 'src/app/models/withdrawal';
import { StaffYoutubeComponent } from 'src/app/Staff/staff-youtube/staff-youtube.component';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  withdrawal:Withdrawal;
  value:string = '';
  id:string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private _snackBar: MatSnackBar,
              private firestoreService: FirestoreServiceService) {
    this.id = data.id;
    this.value = data.value;
    console.log(this.id,this.value);
    this.withdrawal = data['withdrawal'];
   }

  ngOnInit(): void {
  }

  accept(val:string){
    console.log(val)
  }

  delete(){
      this.firestoreService.delete(this.id,this.value);
      this.openSnackBar('Deleted Successfully','Unod');
      // return this.id,this.value
  }
  openSnackBar(message:string,action:string){
    this._snackBar.open(message, action, {
      duration:2000,
      horizontalPosition:'center',
      verticalPosition:'bottom'
    })
  }
}
