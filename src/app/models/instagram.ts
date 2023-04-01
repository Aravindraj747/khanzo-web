import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Instagram{
    videoUrl: string;
    id:string;
    imageUrl:string;
    uploadDate:Timestamp;
}