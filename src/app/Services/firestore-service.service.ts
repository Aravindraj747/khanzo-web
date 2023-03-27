import { Injectable } from '@angular/core';
import { Youtube } from '../models/youTube';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { DailyTask } from '../models/dailyTask';
import { Shorts } from '../models/shorts';
import { AdBanner } from '../models/adBanner';
import { Coupons } from '../models/coupons';
import { Staff } from '../models/staff';
import { deleteDoc } from '@firebase/firestore';
import { doc } from 'firebase/firestore';
import { Instagram } from '../models/instagram';
import { Facebook } from '../models/facebook';
import { Reels } from '../models/reels';

@Injectable({
  providedIn: 'root'
})
export class FirestoreServiceService {

  constructor(private firestore: AngularFirestore) { }

  saveyoutube(youtube: Youtube) {
    console.log(youtube);
    return this.firestore.collection('youtube').doc(youtube.id).set(youtube);
  }

  saveDailytask(dailyTask: DailyTask) {
    return this.firestore.collection('dailyTasks').doc(dailyTask.taskId).set(dailyTask);
  }

  saveShorts(shorts: Shorts) {
    return this.firestore.collection('youtubeShorts').doc(shorts.shortsId).set(shorts);
  }

  saveReel(reel: Reels){
    return this.firestore.collection('reels').doc(reel.reelsId).set(reel);
  }
  saveAdbanner(adBanner: AdBanner) {
    console.log('saveBanner');
    return this.firestore.collection('adBanner').doc(adBanner.adBannerId).set(adBanner);
  }

  saveInstagram(instagram:Instagram){
    return this.firestore.collection('instagram').doc(instagram.instaId).set(instagram);
  }

  saveFacebook(faceBook:Facebook){
    return this.firestore.collection('facebook').doc(faceBook.facebookId).set(faceBook);
  }

  getUser() {
    return this.firestore.collection('user');
  }

  saveCoupons(coupons: Coupons) {
    return this.firestore.collection('coupons').doc(coupons.couponsId).set(coupons);
  }

  createStaff(staff:Staff){
    return this.firestore.collection('staff').doc(staff.email).set(staff);
  }
// Get
  getAllWithdrawal(){
    return this.firestore.collection('withdrawal');
  }

  getYoutube(){
    return this.firestore.collection('youtube');
  }

  getShorts(){
    return this.firestore.collection('youtubeShorts')
  }

  getDailyTask(){
    return this.firestore.collection('dailyTasks');
  }

  getInstagramVideo(){
    return this.firestore.collection('instagram');
  }

  getadBanner(){
    return this.firestore.collection('adBanner');
  }

  getCoupons(){
    return this.firestore.collection('coupons');
  }
  
  getReels(){
    return this.firestore.collection('reels');
  }

  // Delete
  delete(id:string,type:string){
    if(type == 'youtube'){
      this.firestore.collection('youtube').doc(id).delete();
      return;
    }
    else if(type == 'shorts'){
      this.firestore.collection('youtubeShorts').doc(id).delete();
      return;
    }
    else if(type == 'coupon'){
      this.firestore.collection('coupons').doc(id).delete();
      return;
    }
    else if(type == 'adbanner'){
      this.firestore.collection('adBanner').doc(id).delete();
      return;
    }
    else if(type == 'dailyTasks'){
      console.log('yup in fire');
      this.firestore.collection('dailyTasks').doc(id).delete();
      return;
    }
    else if(type == 'instagram'){
      this.firestore.collection('instagram').doc(id).delete();
      return;
    }
    else if(type == 'reels'){
      this.firestore.collection('reels').doc(id).delete();
      return;
    }
    else if(type == 'facebook'){
      this.firestore.collection('facebook').doc(id).delete();
      return
    }
  }

  updateWithdrawal(id:string,data:any){
    console.log(this.firestore.collection('withdrawal', ref => ref.where('withdrawalId', '==', id)));
    return this.firestore.collection('withdrawal').doc(id).update(data);
  }
  deleteShorts(id:string){
    this.firestore.collection('youtubeShorts').doc(id).delete();
  }

  deleteReels(id:string){
    this.firestore.collection('reels').doc(id).delete();
  }

  deleteCoupon(id:string){
    this.firestore.collection('coupons').doc(id).delete();
  }

  deleteInstagram(id:string){
    this.firestore.collection('instagram').doc(id).delete();
  }

  deleteDailytask(id:string){
    this.firestore.collection('dailyTasks').doc(id).delete();
  }

  deleteAdbanner(id:string){
    this.firestore.collection('adBanner').doc(id).delete();
  }
}
