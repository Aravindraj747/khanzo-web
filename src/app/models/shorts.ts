import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Shorts{
    shortsLink: string;
    imageUrl:string;
    uploadDate:Timestamp;
    shortsId:string;
}