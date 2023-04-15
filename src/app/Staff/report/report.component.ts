import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import { Report } from 'src/app/models/report';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  reportArrays: Report[] = [];
  fileName: string = 'report.xlsx';
  displayedColumns: string[] = ['User Id', 'Message', 'Subject', 'ReportedDate'];
  dataSource = new MatTableDataSource<Report>(this.reportArrays);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Report>(this.reportArrays);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getReport().snapshotChanges().subscribe(res => {
      this.reportArrays = [];
      res.forEach(doc => {
        this.reportArrays.push(<Report>doc.payload.doc.data());
      });
      this.dataSource.data = this.reportArrays;
    });
  }
  constructor(private firestoreService: FirestoreServiceService) { }

  ngOnInit(): void {
    // const reportArray: Report[] = [];
    // this.firestoreService.getReport().snapshotChanges().subscribe(res => {
    //   res.forEach(doc => {
    //     reportArray.push(<Report>doc.payload.doc.data());
    //   })
    // });
    // this.firestoreService.getReport().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     reportArray.push(<Report>doc.data());
    //   });
    // });
    // this.reportArrays = reportArray;
  }
  export() {
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.reportArrays;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'report.xlsx');
  }
}
