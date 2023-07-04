import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Facebook{
    videoUrl: string;
    imageUrl:string;
    id:string;
    uploadDate:Timestamp;
    language:string;
}