import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Reels{
    videoUrl: string;
    reelsId:string;
    uploadDate:Timestamp;
}