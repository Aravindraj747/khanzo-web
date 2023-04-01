import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Shorts{
    videoUrl: string;
    imageUrl:string;
    uploadDate:Timestamp;
    id:string;
}