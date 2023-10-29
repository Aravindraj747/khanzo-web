import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Reels{
    videoUrl: string;
    id:string;
    imageUrl:string;
    uploadDate:Timestamp;
}

export interface ReelsExportArray{
    videoUrl: string;
    id:string;
    imageUrl:string;
    uploadDate:string;
}