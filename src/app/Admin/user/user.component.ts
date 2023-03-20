import { Component, OnInit } from '@angular/core';
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
  constructor(private firestroreService: FirestoreServiceService) { }

  ngOnInit(): void {
    const agentsArray: User[] = []
    this.firestroreService.getUser().ref.get().then(res => {
      res.forEach(function (doc) {
        agentsArray.push(<User>doc.data());
      });
    });
    this.users = agentsArray;
    console.log(this.users);
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
