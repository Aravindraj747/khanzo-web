import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface AdBanner{
    videoUrl: string;
    imageUrl: string;
    id:string;
    uploadDate:Timestamp;
    state:string;
    district:string;
    views:number;
}

export interface AdBannerExportData{
    videoUrl: string;
    imageUrl: string;
    id:string;
    uploadDate:string;
    state:string;
    district:string;
    views:number;
}