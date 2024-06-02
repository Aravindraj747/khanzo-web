import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DailyTask, DailyTaskExportArray} from 'src/app/models/dailyTask';
import {FirestoreServiceService} from 'src/app/Services/firestore-service.service';
import {Timestamp} from '@angular/fire/firestore';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from '@angular/fire/storage';
import {DialogComponent} from 'src/app/Admin/dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import {MatTableDataSource} from '@angular/material/table';
import {Instagram} from 'src/app/models/instagram';
import {MatPaginator} from '@angular/material/paginator';
import {Youtube} from "../../models/youTube";
import {AddAdDialogComponent} from "../add-ad-dialog/add-ad-dialog.component";
import data from "../../../assets/district.json";
import {AdminServiceService} from "../../Services/Service/admin-service.service";

@Component({
  selector: 'app-staff-daily-task',
  templateUrl: './staff-daily-task.component.html',
  styleUrls: ['./staff-daily-task.component.css']
})
export class StaffDailyTaskComponent implements OnInit {

  category: any[] = ["Shorts", "Video"];
  language: any[] = ['English', 'Tamil', 'Kanada', 'Telugu', 'Hindi', 'Malayalam'];
  dailyTask: DailyTask = {
    videoUrl: "",
    imageUrl: "",
    channelUrl: "",
    startDate: Timestamp.now(),
    expiryDate: Timestamp.now(),
    couponId: "",
    taskId: "",
    category: "",
    language: "",
    fullVideoUrl: "",
    uploadDate: Timestamp.now(),
    state: '',
    districts: [],
    addedBy: ''
  }
  dailyTaskExportArray: DailyTaskExportArray[] = [];
  current = 0;
  fileName = 'dailyTask.xlsx';
  dailyTasks: DailyTask[] = [];
  imageFile: any = undefined;
  spinnerActive: boolean = false;
  states: any = []
  districts: any = []
  displayedColumns: string[] = ['Id', 'Category', 'UploadDate', 'StartDate', 'ExpiryDate', 'CouponId', 'Video', 'Image', 'Ad', 'Delete'];
  dataSource = new MatTableDataSource<DailyTask>(this.dailyTasks);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<DailyTask>(this.dailyTasks);
    this.dataSource.paginator = this.paginator;
    this.firestoreService.getDailyTask().snapshotChanges().subscribe(res => {
      this.dailyTasks = [];
      res.forEach(doc => {
        this.dailyTasks.push(<DailyTask>doc.payload.doc.data());
      });
      this.dataSource.data = this.dailyTasks;
    });
  }

  constructor(private firestoreService: FirestoreServiceService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog,
              private adminService: AdminServiceService) {
  }

  ngOnInit(): void {
    for (var state of data) {
      this.states.push(state.name);
    }
  }

  chooseImage(event: any) {
    this.imageFile = event.target.files[0];
  }

  submit() {
    this.dailyTask.uploadDate = Timestamp.now();
    this.dailyTask.taskId = Timestamp.now().seconds.toString();
    this.dailyTask.addedBy = this.adminService.getEmail();

    this.spinnerActive = true;

    const startDateString: string = String(this.dailyTask.startDate);
    const startDate = new Date(startDateString);
    this.dailyTask.startDate = Timestamp.fromDate(startDate);

    const expiryDateString: string = String(this.dailyTask.expiryDate);
    const expiryDate = new Date(expiryDateString);
    this.dailyTask.expiryDate = Timestamp.fromDate(expiryDate);

    if (this.dailyTask.videoUrl == '') {
      this.openSnackBar('Enter Video Url to Save', 'Retry');
      return
    } else if (this.dailyTask.imageUrl !== "") {
      if (this.dailyTask!.districts?.includes("ALL")) {
        this.dailyTask.districts = this.districts;
      }
      this.firestoreService.saveDailytask(this.dailyTask).then(res => {
        this.dailyTasks.push(this.dailyTask);
        this.openSnackBar('Daily task saved successfully', 'retry');
        this.resetDailyTask();
        return
      });
    } else if (this.imageFile !== undefined) {
      this.putStorageItem(this.imageFile);
    }
    this.spinnerActive = false;
  }

  putStorageItem(file: any) {
    const storage = getStorage();
    const storageRef = ref(storage, 'dailytaskImage/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        this.openSnackBar('Error occurred while saving images', 'Retry')
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.spinnerActive = false;
          this.dailyTask.imageUrl = downloadURL;

          if (this.dailyTask.imageUrl !== "") {
            if (this.dailyTask!.districts?.includes("ALL")) {
              this.dailyTask.districts = this.districts;
            }
            this.firestoreService.saveDailytask(this.dailyTask).then(res => {
              this.dailyTasks.push(this.dailyTask);

            });
            this.openSnackBar('DailyTask Saved', 'undo');
            this.resetDailyTask();
          } else {
            this.openSnackBar('Error occured while saving daily task', 'retry');
          }
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

          });
          return;
        });
      });
  }

  delete(id: string, type: string) {
    console.log(id, type);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        value: type, id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for (let i = 0; i < this.dailyTasks.length; i++) {
        if (this.dailyTasks[i].taskId === id) {

          this.dailyTasks.splice(i, 1);
          break;
        }
      }

    });
  }

  export() {
    this.dailyTasks.forEach(res => {
      const dailyTask: DailyTaskExportArray = {
        videoUrl: "",
        imageUrl: "",
        channelUrl: "",
        startDate: '',
        expiryDate: '',
        couponId: "",
        taskId: "",
        category: "",
        language: "",
        fullVideoUrl: "",
        uploadDate: '',
        state: '',
        districts: '',
        addedBy: ''
      }
      dailyTask.videoUrl = res.videoUrl;
      dailyTask.imageUrl = res.imageUrl;
      dailyTask.channelUrl = res.channelUrl;
      dailyTask.startDate = res.startDate.toDate().toString();
      dailyTask.expiryDate = res.expiryDate.toDate().toString();
      dailyTask.couponId = res.couponId;
      dailyTask.taskId = res.taskId;
      dailyTask.category = res.category;
      dailyTask.language = res.language;
      dailyTask.fullVideoUrl = res.fullVideoUrl;
      dailyTask.uploadDate = res.uploadDate.toDate().toString();
      dailyTask.state = res.state;
      dailyTask.districts = res.districts?.join(",")
      dailyTask.addedBy = res.addedBy;

      this.dailyTaskExportArray.push(dailyTask);
    });
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.dailyTaskExportArray;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'dailyTask.xlsx');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 2000,
    });
  }

  resetDailyTask() {
    this.dailyTask = {
      videoUrl: "",
      imageUrl: "",
      fullVideoUrl: "",
      channelUrl: "",
      startDate: Timestamp.now(),
      expiryDate: Timestamp.now(),
      couponId: "",
      taskId: "",
      language: '',
      category: "",
      uploadDate: Timestamp.now(),
      state: '',
      districts: [],
      addedBy: ''
    }
  }

  getdistrict(state: string, event: any) {
    if (!event.isUserInput) {
      return;
    }
    this.districts = [];
    for (var dist of data) {
      if (dist.name == state) {
        this.districts.push('ALL')
        for (let i: number = 0; i < dist.districts.length; i++) {
          this.districts.push(dist.districts[i])
        }
        console.log(this.districts);
      }
    }
  }

  addAd(data: DailyTask) {
    this.dialog.open(AddAdDialogComponent, {
      data: {
        collection: "dailyTasks",
        id: data.taskId,
        adIds: data.adIds,
        bannerId: data.bannerId
      }
    });
  }
}
