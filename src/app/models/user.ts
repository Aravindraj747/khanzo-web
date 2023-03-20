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
}