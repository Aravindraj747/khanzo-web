import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Youtube, YoutubeExportData} from '../../models/youTube';
import {FirestoreServiceService} from 'src/app/Services/firestore-service.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from '@angular/fire/storage';
import {Timestamp} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from 'src/app/Admin/dialog/dialog.component';
import * as XLSX from 'xlsx';
import {MatSort} from '@angular/material/sort';
import data from "../../../assets/district.json";
import {AddAdDialogComponent} from "../add-ad-dialog/add-ad-dialog.component";
import {AdminServiceService} from "../../Services/Service/admin-service.service";

@Component({
  selector: 'app-staff-youtube',
  templateUrl: './staff-youtube.component.html',
  styleUrls: ['./staff-youtube.component.css']
})
export class StaffYoutubeComponent implements OnInit {

  youtubeArray: Youtube[] = [];
  dataSource = new MatTableDataSource<Youtube>(this.youtubeArray);

  // category: any[] =["Entertainment","Cooking","Unboxing","MovieReview","Gaming","Comedy","Travel","FoodReview","CinemaTalks","Trailer","Motivation","News","Live","BusinessTalks"]
  category: any[] = ["Trending", "Entertainment", "MovieReview", "CinemaTalks", "Unboxing", "PersonalCare", "LifeStyle", "FoodVlog", "TravelVlog", "Games", "Education", "Cooking", "News"]
  // category: any[] = ["Trending Videos", "Entertainment","Cooking","Education", "Comedy", "News", "Trailers", "Movies", "Cinema","Live","Business talks","Motivation","Cinema talks","Food review",
  //                     "Travel","Gaming","Movie review","Unboxing"];
  language: any[] = ['English', 'Tamil', 'Kannada', 'Telugu', 'Hindi', 'Malayalam'];
  displayedColumns: string[] = ['Id', 'Category', 'Language', 'UploadDate', 'Video', 'Image', 'Ad', 'Delete'];

  youtube: Youtube = {
    videoUrl: "",
    imageUrl: "",
    category: "",
    language: "",
    id: "",
    uploadDate: Timestamp.now(),
    state: '',
    districts: [],
    addedBy: ''
  }
  youTubeExport: YoutubeExportData[] = [];
  thumbImageFile: any = undefined;
  spinnerActive: boolean = false;
  fileName: string = 'youtube.xlsx';
  districts: string[] = [];
  states: any = [];
  // selectedValue: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Youtube>(this.youtubeArray);
    this.dataSource.paginator = this.paginator;
    for (var state of data) {
      this.states.push(state.name);
    }
    this.firestoreService.getYoutube().snapshotChanges().subscribe(res => {
      this.youtubeArray = [];
      res.forEach(doc => {
        this.youtubeArray.push(<Youtube>doc.payload.doc.data());
      });
      this.dataSource.data = this.youtubeArray;
    });
  }

  constructor(private firestoreService: FirestoreServiceService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog,
              private adminService: AdminServiceService) {
  }

  ngOnInit(): void {
    // console.log(this.youtube.uploadDate);
  }

  chooseThumb(event: any) {
    this.thumbImageFile = event.target.files[0];
  }

  submit() {
    this.youtube.uploadDate = Timestamp.now();
    this.youtube.addedBy = this.adminService.getEmail();
      // console.log(this.youtube);
      this.spinnerActive = true;
    if (this.thumbImageFile == undefined && this.youtube.imageUrl == '') {
      this.openSnackBar('Choose one option for upload image', 'retry');
      this.spinnerActive = false
    }
    // console.log(this.youtube.imageUrl);
    // console.log(this.thumbImageFile);
    this.youtube.id = Timestamp.now().seconds.toString();
    // this.youtube.uploadDate = Date();
    // console.log(this.youtube.id);
    if (this.youtube.imageUrl !== '') {
      // download and push to storage and save link in database
      if (this.youtube!.districts?.includes("ALL")) {
        this.youtube.districts = this.districts;
      }
      this.firestoreService.saveYoutube(this.youtube).then(res => {
        // console.log("youtube directlink saved");
        this.youtubeArray.push(this.youtube);
        this.openSnackBar("Link Saved Successfully", "Close");
        this.resetPage()
        this.spinnerActive = false;
      });
    } else if (this.thumbImageFile !== undefined) {
      // push to storage and save link in database
      // console.log('before', this.youtube);
      this.putStorageItem(this.thumbImageFile);
    }
  }

  delete(id: string, type: string) {
    // console.log(id,type);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        value: type, id
      }
    });
    dialogRef.componentInstance.deleted.subscribe(val => {

      for (let i = 0; i < this.youtubeArray.length; i++) {
        if (this.youtubeArray[i].id === id) {
          this.youtubeArray.splice(i, 1);
          this.dataSource.data = this.youtubeArray;
          break;
        }
      }
    });
  }

  export() {
    this.youtubeArray.forEach(res => {
      const youArray: YoutubeExportData = {
        videoUrl: '',
        imageUrl: '',
        category: '',
        uploadDate: '',
        language: '',
        id: '',
        state: '',
        district: '',
        addedBy: ''
      }
      youArray.category = res.category;
      youArray.id = res.id;
      youArray.imageUrl = res.imageUrl;
      youArray.language = res.language;
      youArray.uploadDate = res.uploadDate.toDate().toString();
      youArray.videoUrl = res.videoUrl;
      youArray.addedBy = res.addedBy;
      if (res.districts !== undefined)
        youArray.district = res.districts?.join(",")
      youArray.state = res.state;
      this.youTubeExport.push(youArray);
    })
    const XLSX = require('xlsx')

    // array of objects to save in Excel
    let binary_univers = this.youTubeExport;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new()

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')

    // export your excel
    XLSX.writeFile(wb, 'youtube.xlsx');
  }

  putStorageItem(file: any) {
    const storage = getStorage();
    const storageRef = ref(storage, 'youtubethumbNail/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        this.openSnackBar('Error occurred while saving images', 'Retry')
        // console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.spinnerActive = false;
          this.youtube.imageUrl = downloadURL;
          // console.log('after:', this.youtube);
          if (this.youtube.imageUrl !== "") {
            if (this.youtube!.districts?.includes("ALL")) {
              this.youtube.districts = this.districts;
            }
            this.firestoreService.saveYoutube(this.youtube).then(res => {
              this.youtubeArray.push(this.youtube);
              // console.log("youtube link saved from storage");
              this.openSnackBar("Link Saved Successfully", "close");
              this.spinnerActive = false;
              this.resetPage();
            });
          } else {
            this.openSnackBar('Error occured', 'retry');
            this.spinnerActive = false;
          }
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('File available at', downloadURL);
          });
        });
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: 2000,
    });
  }

  getdistrict(state: string, event: any) {
    if (!event.isUserInput) {
      return;
    }
    this.districts = [];
    this.districts.push('ALL')
    for (var dist of data) {
      if (dist.name == state) {
        for (let i: number = 0; i < dist.districts.length; i++) {
          this.districts.push(dist.districts[i])
        }
        console.log(this.districts);
      }
    }
  }

  resetPage() {
    this.youtube = {
      videoUrl: "",
      imageUrl: "",
      category: "",
      language: "",
      id: "",
      uploadDate: Timestamp.now(),
      state: '',
      districts: [],
      addedBy: ''
    }
  }

  addAd(youtube: Youtube) {
    this.dialog.open(AddAdDialogComponent, {
      data: {
        id: youtube.id,
        adIds: youtube.adIds,
        collection: "youtube",
        bannerId: youtube.bannerId
      }
    });
  }
}
