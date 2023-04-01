import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface AdBanner{
    videoUrl: string;
    imageUrl: string;
    id:string;
    uploadDate:Timestamp;
    state:string;
    district:string;
}