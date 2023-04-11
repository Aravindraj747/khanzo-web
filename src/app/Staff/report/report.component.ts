import { Component, OnInit } from '@angular/core';
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
  constructor(private firestoreService: FirestoreServiceService) { }

  ngOnInit(): void {
    const reportArray: Report[] = [];
    this.firestoreService.getReport().snapshotChanges().subscribe(res => {
      res.forEach(doc => {
        reportArray.push(<Report>doc.payload.doc.data());
      })
    });
    // this.firestoreService.getReport().ref.get().then(res => {
    //   res.forEach(function (doc) {
    //     reportArray.push(<Report>doc.data());
    //   });
    // });
    this.reportArrays = reportArray;
    console.log(this.reportArrays);
  }
  export() {
    console.log('in function');
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
