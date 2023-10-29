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
    category:string;
    district:string;
}

export interface OfflineShopExportArray{
    imageUrl: string;
    name: string;
    address: string;
    openingTime: string;
    closingTime: string;
    phoneNumber: string;
    id: string;
    uploadDate:string;
    availability:string;
    state:string;
    category:string;
    district:string;
}