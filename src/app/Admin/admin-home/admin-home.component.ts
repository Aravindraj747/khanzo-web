import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Withdrawal } from 'src/app/models/withdrawal';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  withdrawals: Withdrawal[] =[];

  constructor(private firestoreService: FirestoreServiceService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getWithdrawal();
  }

  getWithdrawal(){
    const withdrawalArray: Withdrawal[] = []
    this.firestoreService.getAllWithdrawal().ref.get().then(res => {
      console.log(res);
      res.forEach(function(doc) {
        withdrawalArray.push(<Withdrawal>doc.data());
      });
    });
    this.withdrawals = []
    this.withdrawals = withdrawalArray;
    console.log(this.withdrawals);
  }

  openDialog(value:string,withdrawal:Withdrawal){
    console.log(value);
    return this.dialog.open(DialogComponent,{
      data:{
        withdrawal:withdrawal,value
      }
    })
  }
}
