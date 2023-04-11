import { Component,EventEmitter,Inject , OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Withdrawal } from 'src/app/models/withdrawal';
import { StaffYoutubeComponent } from 'src/app/Staff/staff-youtube/staff-youtube.component';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import { Timestamp } from '@angular/fire/firestore';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  withdrawal:Withdrawal;
  value:string = '';
  id:string = '';
  utr:string='';
  reason:string= '';
  @Output() deleted = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<boolean>();
  
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
  async getDetails(email: string) {
    await this.firestoreService.getUserDetails(email);
  }
// For Withdrawal
  accept(val:string){
    console.log('val',val);
    console.log(this.withdrawal);
    this.saveDetails(this.withdrawal,val);
  }

  saveDetails(withdrawal:Withdrawal,val:string){
    if(val == 'accept'){
      let data = {
        'status': 'SUCCESS',
        'completedDate': Timestamp.now(),
        'utr':this.utr,
        'reason':this.reason
      }
      this.updated.emit(true);
      this.firestoreService.updateWithdrawal(withdrawal.withdrawalId,data).then(res=>{
        this.openSnackBar('Withdrawal updated','undo');
      }).then(err=>{
        this.openSnackBar('Withdrawal Updated','retry');
      })
    }
    else if(val == 'reject'){
      let data = {
        'status': 'REJECT',
        'completedDate': Timestamp.now()
      }
      this.updated.emit(true);
      this.firestoreService.updateWithdrawal(withdrawal.withdrawalId,data).then(res=>{
        this.openSnackBar('Withdrawal updated','undo');
      }).then(err=>{
        this.openSnackBar('Withdrawal Updated','retry');
      })
    }
  }
// delete videos
  delete(){
      console.log('id',this.id);
      this.firestoreService.delete(this.id,this.value);
      this.openSnackBar('Deleted Successfully','Unod');
      this.deleted.emit(true);
  }
  openSnackBar(message:string,action:string){
    this._snackBar.open(message, action, {
      duration:2000,
      horizontalPosition:'center',
      verticalPosition:'bottom'
    })
  }
}
