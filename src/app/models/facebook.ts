import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Facebook{
    videoUrl: string;
    facebookId:string;
    uploadDate:Timestamp;
}