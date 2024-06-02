import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export interface Withdrawal {
    amount: number;
    userId: string;
    requestedDate: Timestamp;
    completedDate: Timestamp;
    accountNumber:string;  //show in table also
    status: string;
    withdrawalId: string;
    upiId:string;
    ifscCode:string;
    serviceCharge: number;
}

export interface WithdrawalExportArray {
    amount: number;
    userId: string;
    requestedDate: string;
    completedDate: string;
    accountNumber:string;  //show in table also
    status: string;
    withdrawalId: string;
    upiId:string;
    ifscCode:string;
    serviceCharge: number;
}
