import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface DailyTask{
    videoUrl: string;
    imageUrl: string;
    startDate: Timestamp;
    expiryDate: Timestamp;
    couponId: string;
    taskId:string;
    uploadDate:Timestamp;
    category:string;
    language:string;
}