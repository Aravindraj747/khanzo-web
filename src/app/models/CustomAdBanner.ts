import {Timestamp} from "@angular/fire/firestore";

export interface CustomAdBanner {
  imageUrl: string;
  states: string[];
  districts: string[];
  adType: string;
  link: string;
  uploadDate: Timestamp;
  addedBy: string;
  id: string;
}

export interface CustomAdExportArray {
  imageUrl: string;
  states: string;
  districts: string;
  adType: string;
  link: string;
  uploadDate: string;
  addedBy: string;
  id: string;
}
