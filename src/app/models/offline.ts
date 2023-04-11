import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface OfflineShop{
    imageUrl: string;
    name: string;
    address: string;
    openingTime: Timestamp;
    closingTime: Timestamp;
    phoneNumber: string;
    id: string;
    uploadDate:Timestamp;
    availability:string;
    state:string;
    district:string;
}