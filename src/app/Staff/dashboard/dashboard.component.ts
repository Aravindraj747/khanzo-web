import {Component, OnInit} from '@angular/core';
import {FirestoreServiceService} from "../../Services/firestore-service.service";
import {User} from "../../models/user";
import {Withdrawal} from "../../models/withdrawal";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  todayJoinedUser: number = 0;
  todayPaymentCompleted: number = 0;
  totalUsers: number = 0;
  totalPaymentCompleted: number = 0;

  withdrawalCompleted: number = 0
  withdrawalCompletedAmount: number = 0;
  withdrawalPending: number = 0
  withdrawalPendingAmount: number = 0

  constructor(private firestoreService: FirestoreServiceService) {
  }

  ngOnInit(): void {
    const usersArray: User[] = [];
    const withdrawalArray: Withdrawal[] = []
    this.firestoreService.getUser().snapshotChanges().subscribe(res => {
      res.forEach(doc => {
        usersArray.push(<User>doc.payload.doc.data());
      })
      this.totalUsers = usersArray.length;
      this.todayJoinedUser = usersArray.filter(user => {
        return user.joinedDate.toDate().getDate() === new Date().getDate()
          && user.joinedDate.toDate().getMonth() === new Date().getMonth()
          && user.joinedDate.toDate().getFullYear() === new Date().getFullYear()
      }).length;

      this.todayPaymentCompleted = usersArray.filter(user => {
        return user.joinedDate.toDate().getDate() === new Date().getDate()
          && user.joinedDate.toDate().getMonth() === new Date().getMonth()
          && user.joinedDate.toDate().getFullYear() === new Date().getFullYear()
          && user.paymentCompleted
      }).length;

      this.totalPaymentCompleted = usersArray.filter(user => {
        return user.paymentCompleted
      }).length;
    });

    this.firestoreService.getAllWithdrawal().get().subscribe(res => {
      res.forEach(doc => {
        withdrawalArray.push(<Withdrawal>doc.data());
      })

      console.log(withdrawalArray);
      this.withdrawalPending = withdrawalArray.filter(withdrawal => {
          return withdrawal.status === "PENDING"
      }).length;

      this.withdrawalPendingAmount = withdrawalArray.filter(withdrawal => {
        return withdrawal.status === "PENDING"
      }).flat().reduce((accumulator, withdraw) => {
        return accumulator + withdraw.amount - (withdraw.serviceCharge ? withdraw.serviceCharge: 0);
      }, 0);

      this.withdrawalCompleted = withdrawalArray.filter(withdrawal => {
          return withdrawal.status === "SUCCESS"
      }).length;

      this.withdrawalCompletedAmount = withdrawalArray.filter(withdrawal => {
          return withdrawal.status === "SUCCESS"
      }).flat().reduce((accumulator, withdraw) => {
        return accumulator + withdraw.amount - (withdraw.serviceCharge ? withdraw.serviceCharge: 0);
      }, 0);
    });
  }

}
