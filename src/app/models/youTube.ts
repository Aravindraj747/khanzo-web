import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Youtube{
    videoUrl: string;
    imageUrl: string;
    category: string;
    uploadDate:string;
    language: string;
    id:string;
}