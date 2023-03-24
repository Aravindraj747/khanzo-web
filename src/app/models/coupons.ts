import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Coupons{
    imageUrl: string;
    couponsId:string;
    uploadDate:Timestamp;
}