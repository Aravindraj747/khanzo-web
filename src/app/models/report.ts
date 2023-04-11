import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Report{
    message: string;
    subject: string;
    userId: string;
    reportedDate:Timestamp;
}