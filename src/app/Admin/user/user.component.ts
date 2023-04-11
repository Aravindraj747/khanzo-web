import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: User[] = [];
  fileName = 'UserExcel.xlsx';

  displayedColumns: string[] = ['Email', 'PhoneNumber', 'JoinedDate','Address','Level'];
  dataSource = new MatTableDataSource<User>(this.users);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.dataSource.paginator = this.paginator;
    this.firestroreService.getUser().snapshotChanges().subscribe(res => {
      this.users = [];
      res.forEach(doc => {
        this.users.push(<User>doc.payload.doc.data());
      });
      this.dataSource.data = this.users;
    });
  }
  constructor(private firestroreService: FirestoreServiceService) { }

  ngOnInit(): void {
    const usersArray: User[] = [];
    this.firestroreService.getUser().snapshotChanges().subscribe(res => {
      res.forEach(doc => {
        usersArray.push(<User>doc.payload.doc.data());
      })
    });
    // this.firestroreService.getUser().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     usersArray.push(<User>doc.data());
    //   });
    // });
    this.users = usersArray;
    console.log(this.users);
  }

  // export() {
  //   console.log('in function');
  //   let element = document.getElementById('excel-table');
  //   let user:User[] =[]
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(user);

  //   /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   /* save to file */
  //   XLSX.writeFile(wb, this.fileName);
  // }
  export() {
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.users;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'Binaire.xlsx');
  }
}
