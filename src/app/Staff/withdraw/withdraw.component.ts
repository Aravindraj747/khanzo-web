import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Withdrawal, WithdrawalExportArray} from "../../models/withdrawal";
import {FirestoreServiceService} from "../../Services/firestore-service.service";
import {DialogComponent} from "../../Admin/dialog/dialog.component";
import {User} from "@angular/fire/auth";
import {MatDialog} from "@angular/material/dialog";
import {AdminServiceService} from "../../Services/Service/admin-service.service";

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  withdrawals: Withdrawal[] = [];
  spinnerActive: boolean = false;
  fileName: string = 'withdraw.xlsx';
  displayedColumns: string[] = [ 'WithdrawID','UserID', 'Amount', 'WithdrawalDate', 'AccountDetails', 'Status', 'Actions'];

  dataSource = new MatTableDataSource<Withdrawal>(this.withdrawals);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private firestoreService: FirestoreServiceService,
              private dialog: MatDialog,
              private adminService: AdminServiceService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Withdrawal>(this.withdrawals);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getAllWithdrawal().snapshotChanges().subscribe(res => {
      this.withdrawals = [];
      res.forEach(doc => {
        this.withdrawals.push(<Withdrawal>doc.payload.doc.data());
      });
      this.dataSource.data = this.withdrawals;
    });
  }

  export() {
    // console.log('in function');
    let exportArray: WithdrawalExportArray[] = [];
    this.withdrawals.forEach(res => {
      const withdrawalExportArray: WithdrawalExportArray = {
        userId: res.userId,
        requestedDate: res.requestedDate.toDate().toString(),
        completedDate: res.completedDate.toDate().toString(),
        accountNumber: res.accountNumber,
        status: res.status,
        withdrawalId: res.withdrawalId,
        upiId: res.upiId,
        ifscCode: res.ifscCode,
        amount: res.amount,
        serviceCharge: res.serviceCharge
      }

      exportArray.push(withdrawalExportArray);
    })
    const XLSX = require('xlsx')

    let binaryWS = XLSX.utils.json_to_sheet(exportArray);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'values')

    // export your excel
    XLSX.writeFile(wb, 'withdraw.xlsx');
  }

  openDialog(value: string, withdrawal: Withdrawal) {
    if (!this.adminService.getAdminLogin() && value !== 'details' && withdrawal.status !== 'PENDING') {
      console.log('Staff login')
      return
    }
    let id = withdrawal.withdrawalId;
    // console.log(value);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        withdrawal: withdrawal, value
      }
    })
    dialogRef.componentInstance.updated.subscribe(val => {
      const rejectedUser: User [] = [];
      for (let i = 0; i < this.withdrawals.length; i++) {
        if (this.withdrawals[i].withdrawalId === id) {
          if (value == 'accept') {
            this.withdrawals[i].status = 'SUCCESS';
          } else {
            this.withdrawals[i].status = 'REJECT';
            this.firestoreService.getrejectedUser(withdrawal.userId, withdrawal.amount);
          }
          break;
        }
      }
    });
  }
}
