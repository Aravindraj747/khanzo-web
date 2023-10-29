import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User, UserExportData } from 'src/app/models/user';
// import {Userexport} from 'src/app/models/userExport';
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
  exportUser: UserExportData[] =[];
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
      // this.dataSource.data.forEach(element => {
      //   element.dob = element.dob.toDate.
      //   return;
      //   element.joinedDate.toDate();
      //   element.expiryDate.toDate();
      //   this.exportUser.push(element);
      //   return
      // });
      // console.log(this.exportUser);
    });
    // console.log(this.users);
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
    // console.log(this.users);
  }

  export() {
    this.users.forEach(res=>{
      const earray:UserExportData = {
        name: '',
        email: '',
        phoneNumber: '',
        pincode: '',
        address: '',
        joinedDate: '',
        level: '',
        amount:'',
        gender:'',
        availableCoupons:0,
        district:'',
        dob:'',
        expiryDate:'',
        language:'',
        paymentCompleted:'',
        referralCode:'',
        referredByCode:'',
      }
      earray.address = res.address;
      earray.amount = res.amount.toString();
      earray.availableCoupons = res.availableCoupons;
      earray.district = res.district;
      earray.joinedDate = res.joinedDate.toDate().toString();
      earray.expiryDate = res.expiryDate.toDate().toString();
      earray.dob = res.dob.toDate().toString();
      earray.phoneNumber = res.phoneNumber;
      earray.name = res.name;
      earray.email = res.email;
      earray.pincode = res.pincode;
      earray.level = res.level;
      earray.language = res.language;
      earray.referredByCode = res.referredByCode;
      earray.referralCode = res.referralCode;
      earray.gender = res.gender;
      earray.paymentCompleted = res.paymentCompleted.toString();
      earray.address = res.address;
      this.exportUser.push(earray);
    })

    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.exportUser;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'UserExcel.xlsx');
  }
}
