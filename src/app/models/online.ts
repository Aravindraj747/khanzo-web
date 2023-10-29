import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface OnlineShop{
    imageUrl: string;
    name: string;
    buyLink: string;
    id: string;
    uploadDate:Timestamp;
    availability:string;
    websiteName:string;
    category:string;
}

export interface OnlineShopExportArray{
    imageUrl: string;
    name: string;
    buyLink: string;
    id: string;
    uploadDate:string;
    availability:string;
    websiteName:string;
    category:string;
}