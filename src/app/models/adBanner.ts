import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface AdBanner {
  videoUrl: string;
  imageUrl: string;
  id: string;
  uploadDate: Timestamp;
  state: string;
  districts: string[];
  views: number;
  addedBy: string;
}

export interface AdBannerExportData {
  videoUrl: string;
  imageUrl: string;
  id: string;
  uploadDate: string;
  state: string;
  district: string;
  views: number;
  addedBy: string;
}
