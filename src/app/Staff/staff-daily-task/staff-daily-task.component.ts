import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DailyTask } from 'src/app/models/dailyTask';
import { FirestoreServiceService } from 'src/app/Services/firestore-service.service';
import { Timestamp } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { DialogComponent } from 'src/app/Admin/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-staff-daily-task',
  templateUrl: './staff-daily-task.component.html',
  styleUrls: ['./staff-daily-task.component.css']
})
export class StaffDailyTaskComponent implements OnInit {

  category: any[] = ["Shorts", "Video"];
  dailyTask: DailyTask = {
    videoUrl: "",
    imageUrl: "",
    startDate:Timestamp.now(),
    expiryDate: Timestamp.now(),
    couponId: "",
    taskId: "",
    category:"",
    uploadDate:Timestamp.now()
  }
  current = 0;
  dailyTasks: DailyTask[] =[];
  imageFile: any = undefined;
  spinnerActive: boolean = false;
  constructor(private firestoreService: FirestoreServiceService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    const dailyTaskArray: DailyTask[] = []
    this.firestoreService.getDailyTask().ref.get().then(res => {
      res.forEach(function (doc) {
        dailyTaskArray.push(<DailyTask>doc.data());
      });
    });
    this.dailyTasks = dailyTaskArray;
    console.log(this.dailyTasks);
  }

  chooseImage(event: any) {
    this.imageFile = event.target.files[0];
  }
  submit() {
    this.dailyTask.uploadDate = Timestamp.now();
    this.dailyTask.taskId = Timestamp.now().seconds.toString();
    
    this.spinnerActive = true;

    const startDateString: string = String(this.dailyTask.startDate);
    const startDate = new Date(startDateString);
    this.dailyTask.startDate = Timestamp.fromDate(startDate);

    const expiryDateString: string = String(this.dailyTask.expiryDate);
    const expiryDate = new Date(expiryDateString);
    this.dailyTask.expiryDate = Timestamp.fromDate(expiryDate);

    if(this.dailyTask.videoUrl == ''){
      this.openSnackBar('Enter Video Url to Save','Retry');
      return
    }
    else if (this.dailyTask.imageUrl !== "") {
      this.firestoreService.saveDailytask(this.dailyTask).then(res => {
        this.dailyTasks.push(this.dailyTask);
        console.log("Daily task saved as image URL");
        this.openSnackBar('Daily task saved successfully', 'retry');
        this.resetDailyTask();
        return
      });
    }
    else if (this.imageFile !== undefined) {
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
        console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.spinnerActive = false;
          this.dailyTask.imageUrl = downloadURL;
          console.log(this.dailyTask.imageUrl);
          console.log('after:', this.dailyTask);
          if (this.dailyTask.imageUrl !== "") {
            this.firestoreService.saveDailytask(this.dailyTask).then(res => {
              this.dailyTasks.push(this.dailyTask);
              console.log('Daily task saved as imageFile')
            });
            this.openSnackBar('DailyTask Saved', 'undo');
            this.resetDailyTask();
          }
          else {
            this.openSnackBar('Error occured while saving daily task', 'retry');
          }
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
          });
          return;
        });
      });
  }
  delete(id:string,type:string){
    console.log(id,type);
    return this.dialog.open(DialogComponent,{
      data:{
        value:type,id
      }
    })
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
      startDate:Timestamp.now(),
      expiryDate: Timestamp.now(),
      couponId: "",
      taskId: "",
      category:"",
      uploadDate:Timestamp.now()
    }
  }

}
