import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Shorts{
    videoUrl: string;
    imageUrl:string;
    uploadDate:Timestamp;
    id:string;
    language:string;
}

export interface ShortsExportArray{
    videoUrl: string;
    imageUrl:string;
    uploadDate:string;
    id:string;
    language:string;
}