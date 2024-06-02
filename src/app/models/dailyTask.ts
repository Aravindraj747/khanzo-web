import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface DailyTask {
  videoUrl: string;
  imageUrl: string;
  startDate: Timestamp;
  expiryDate: Timestamp;
  couponId: string;
  taskId: string;
  uploadDate: Timestamp;
  category: string;
  language: string;
  channelUrl: string;
  fullVideoUrl: string;
  adIds?: string[];
  bannerId?: string;
  state: string;
  districts: string[];
  addedBy: string;
}

export interface DailyTaskExportArray {
  videoUrl: string;
  imageUrl: string;
  startDate: string;
  expiryDate: string;
  couponId: string;
  taskId: string;
  uploadDate: string;
  category: string;
  language: string;
  channelUrl: string;
  fullVideoUrl: string;
  adIds?: string[];
  bannerId?: string;
  state: string;
  districts: string;
  addedBy: string;
}
