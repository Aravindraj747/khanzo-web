import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Staff{
    email: string;
    password: string;
    name:string;
    creationDate: Timestamp;
    role: string;
}
