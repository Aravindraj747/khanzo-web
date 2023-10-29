import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Coupons{
    imageUrl: string;
    couponCode:string;
    uploadDate:Timestamp;
    couponId:string;
    availability:string;
}

export interface CouponsExportArray{
    imageUrl: string;
    couponCode:string;
    uploadDate:string;
    couponId:string;
    availability:string;
}