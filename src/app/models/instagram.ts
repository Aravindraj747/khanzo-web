import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Instagram{
    videoUrl: string;
    instaId:string;
    uploadDate:Timestamp;
}