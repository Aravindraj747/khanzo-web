import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Youtube {
  videoUrl: string;
  imageUrl: string;
  category: string;
  uploadDate: Timestamp;
  language: string;
  id: string;
  state: string;
  districts: string[];
  bannerId?: string;
  adIds?: string[];
  fullVideoUrl?: string;
  channelUrl?: string;
  addedBy: string;
}

export interface YoutubeExportData {
  videoUrl: string;
  imageUrl: string;
  category: string;
  uploadDate: string;
  language: string;
  id: string;
  state: string;
  district: string;
  bannerId?: string;
  adIds?: string[];
  fullVideoUrl?: string;
  channelUrl?: string;
  addedBy: string;
}
