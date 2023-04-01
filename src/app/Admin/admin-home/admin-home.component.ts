import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
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
    let id = withdrawal.withdrawalId;
    console.log(value);
    const dialogRef = this.dialog.open(DialogComponent,{
      data:{
        withdrawal:withdrawal,value
      }
    })
      dialogRef.componentInstance.updated.subscribe(val => {
        const rejectedUser: User []= [];
        for(let i = 0;i<this.withdrawals.length;i++){
          if(this.withdrawals[i].withdrawalId === id){
            if (value == 'accept'){
              this.withdrawals[i].status = 'SUCCESS';
            }else{
              this.withdrawals[i].status = 'REJECT';
              this.firestoreService.getrejectedUser(withdrawal.userId,withdrawal.amount);
              // this.firestoreService.getUser().ref.get().then(res=>{
              //   res.forEach(function (doc) {
              //     userArray.push(<User>doc.data());
              //   });
              //   for(let i = 0;i<userArray.length;i++){
              //     if(userArray[i].email === withdrawal.userId){
              //       console.log(userArray);
              //       let amt = userArray[i].amount + withdrawal.amount;
              //       let data = {
              //         'amount': amt
              //       }
              //       this.firestoreService.updateUser(withdrawal.userId,data).then(res=>{
              //         return;
              //       })
              //       break;
              //     }
              //   }
              // })
            }
            break;
          }
        }
      });
    }
  }