import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Facebook{
    videoUrl: string;
    imageUrl:string;
    facebookId:string;
    uploadDate:Timestamp;
}