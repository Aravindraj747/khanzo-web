import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export interface User {
    name: string;
    email: string;
    phoneNumber: string;
    pincode: string;
    address: string;
    joinedDate: Timestamp;
    level: string;
    amount:number;
    gender:string;
    availableCoupons:number;
    district:string;
    dob:Timestamp;
    expiryDate:Timestamp;
    language:string;
    paymentCompleted:boolean;
    referralCode:string;
    referredByCode:string;
}

export interface UserExportData{
    name: string;
    email: string;
    phoneNumber: string;
    pincode: string;
    address: string;
    joinedDate: string;
    level: string;
    amount:string;
    gender:string;
    availableCoupons:number;
    district:string;
    dob:string;
    expiryDate:string;
    language:string;
    paymentCompleted:string;
    referralCode:string;
    referredByCode:string;
}