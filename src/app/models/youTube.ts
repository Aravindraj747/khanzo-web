import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Youtube{
    videoUrl: string;
    imageUrl: string;
    category: string;
    uploadDate:Timestamp;
    language: string;
    id:string;
}