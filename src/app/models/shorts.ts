import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Shorts{
    shortsLink: string;
    uploadDate:Timestamp;
    shortsId:string;
}