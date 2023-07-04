import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export interface User {
    name: string;
    email: string;
    phoneNumber: string;
    pinCode: string;
    address: string;
    joinedDate: Timestamp;
    level: string;
    amount:number;
    gender:string;
    availableCoupon:number;
    district:string;
    dob:Timestamp;
    expiryDate:Timestamp;
    language:string;
    paymentCompleted:boolean;
    referralCode:string;
    referredByCode:string;
    // accountNumber:string;
    // accountHolderName:string;
}