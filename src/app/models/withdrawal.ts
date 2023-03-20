import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export interface Withdrawal {
    withdrawalAmount: number;
    userId: string;
    requestedDate: Timestamp;
    settlementDate: Timestamp;
    status: string;
    withdrawalId: string;
}