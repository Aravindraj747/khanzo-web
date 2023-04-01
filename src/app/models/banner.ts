import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Banner{
    email: string;
    imageUrl: string;
    id:string;
    uploadDate:Timestamp;
    phoneNumber:string;
    address:string;
}