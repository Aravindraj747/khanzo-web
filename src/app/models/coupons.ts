import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Coupons{
    imageUrl: string;
    couponId:string;
    uploadDate:Timestamp;
}