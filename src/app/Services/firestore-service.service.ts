import { Injectable } from '@angular/core';
import { Youtube } from '../models/youTube';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { DailyTask } from '../models/dailyTask';
import { Shorts } from '../models/shorts';
import { AdBanner } from '../models/adBanner';
import { Coupons } from '../models/coupons';
import { Staff } from '../models/staff';
import { Instagram } from '../models/instagram';
import { Facebook } from '../models/facebook';
import { Reels } from '../models/reels';
import { Banner } from '../models/banner';
import {orderBy} from 'firebase/firestore';
import { increment } from '@angular/fire/firestore';
import { User } from '../models/user';
import { OnlineShop } from '../models/online';
import { OfflineShop } from '../models/offline';
import { Withdrawal } from '../models/withdrawal';
import { Report } from '../models/report';
import { Kids } from '../models/kids';
import { Music } from '../models/music';

@Injectable({
  providedIn: 'root'
})
export class FirestoreServiceService {

  constructor(private firestore: AngularFirestore) { }

  // Save method
  saveYoutube(youtube: Youtube) {
    console.log(youtube);
    return this.firestore.collection('youtube').doc(youtube.id).set(youtube);
  }
  saveOnlineshop(onlineShop: OnlineShop) {
    return this.firestore.collection('onlineShop').doc(onlineShop.id).set(onlineShop);
  }
  saveOfflineshop(offlineShop: OfflineShop) {
    return this.firestore.collection('offlineShop').doc(offlineShop.id).set(offlineShop);
  }
  saveKids(kid: Kids) {
    return this.firestore.collection('childVideos').doc(kid.id).set(kid);
  }
  saveBanner(banner: Banner) {
    return this.firestore.collection('imageBanner').doc(banner.id).set(banner);
  }
  saveMusic(music: Music) {
    return this.firestore.collection('music').doc(music.id).set(music);
  }

  saveDailytask(dailyTask: DailyTask) {
    return this.firestore.collection('dailyTasks').doc(dailyTask.taskId).set(dailyTask);
  }

  saveShorts(shorts: Shorts) {
    return this.firestore.collection('youtubeShorts').doc(shorts.id).set(shorts);
  }

  saveReel(reel: Reels) {
    return this.firestore.collection('reels').doc(reel.id).set(reel);
  }
  saveAdbanner(adBanner: AdBanner) {
    return this.firestore.collection('videoAdBanner').doc(adBanner.id).set(adBanner);
  }

  saveInstagram(instagram: Instagram) {
    return this.firestore.collection('instagram').doc(instagram.id).set(instagram);
  }

  saveFacebook(faceBook: Facebook) {
    return this.firestore.collection('facebook').doc(faceBook.id).set(faceBook);
  }
  saveCoupons(coupons: Coupons) {
    return this.firestore.collection('coupons').doc(coupons.couponId).set(coupons);
  }
  // staff creation
  createStaff(staff: Staff) {
    return this.firestore.collection('staff').doc(staff.email).set(staff);
  }

  // Get method
  getUser() {
    // return this.firestore.collection('user');
    return this.firestore.collection<User>('user', ref => ref.orderBy('joinedDate','desc'));
  }
  getUserDetails(email: string) {
    return this.firestore.collection('admin').doc<User>(email).get();
  }
  getStaff() {
    return this.firestore.collection('staff');
  }
  getAllWithdrawal() {
    // return this.firestore.collection('withdrawal');
    return this.firestore.collection<Withdrawal>('withdrawal', ref => ref.orderBy('requestedDate','desc'));
  }
  getOnlineshops() {
    // return this.firestore.collection('onlineShop');
    return this.firestore.collection<OnlineShop>('onlineShop', ref => ref.orderBy('uploadDate','desc'));
  }
  getOfflineShop() {
    return this.firestore.collection<OfflineShop>('offlineShop',ref => ref.orderBy('uploadDate','desc'));
  }
  getYoutube() {
    // return this.firestore.collection('youtube').orderBy("uplodedDate","desc");
    return this.firestore.collection<Youtube>('youtube',ref => ref.orderBy("uploadDate", "desc"));
  }
  getFacebook() {
    // return this.firestore.collection('facebook');
    return this.firestore.collection<Facebook>('facebook', ref => ref.orderBy('uploadDate', "desc"));
  }
  getReport() {
    // return this.firestore.collection('report');
    return this.firestore.collection<Report>('report', ref => ref.orderBy('reportedDate', "desc"));
  }
  getKids() {
    // return this.firestore.collection('childVideos');
    return this.firestore.collection<Kids>('childVideos', ref => ref.orderBy('uploadDate', "desc"));
  }
  getBanner() {
    // return this.firestore.collection('imageBanner');
    return this.firestore.collection<Banner>('imageBanner', ref => ref.orderBy('uploadDate', "desc"));
  }
  getMusic() {
    // return this.firestore.collection('music');
    return this.firestore.collection<Music>('music', ref => ref.orderBy('uploadDate', "desc"));
  }

  getShorts() {
    // return this.firestore.collection('youtubeShorts');
    return this.firestore.collection<Shorts>('youtubeShorts', ref => ref.orderBy('uploadDate', "desc"));
  }

  getDailyTask() {
    // return this.firestore.collection('dailyTasks');
    return this.firestore.collection<DailyTask>('dailyTasks', ref => ref.orderBy('uploadDate', "desc"));
  }

  getInstagramVideo() {
    // return this.firestore.collection('instagram');
    return this.firestore.collection<Instagram>('instagram', ref => ref.orderBy('uploadDate', "desc"));
  }

  getadBanner() {
    // return this.firestore.collection('videoAdBanner');
    return this.firestore.collection<AdBanner>('videoAdBanner', ref => ref.orderBy('uploadDate', "desc"));
  }

  getCoupons() {
    // return this.firestore.collection('coupons');
    return this.firestore.collection<Coupons>('coupons', ref => ref.orderBy('uploadDate', "desc"));
  }

  getReels() {
    // return this.firestore.collection('reels');
    return this.firestore.collection<Reels>('reels', ref => ref.orderBy('uploadDate', "desc"));
  }
  getrejectedUser(id: string, amt: number) {
    return this.firestore.collection('user')
      .doc(id).update({ 'amount': increment(amt) });
  }

  // Delete method
  delete(id: string, type: string) {
    if (type == 'youtube') {
      return this.firestore.collection('youtube').doc(id).delete();
    }
    else if (type == 'online') {
      return this.firestore.collection('onlineShop').doc(id).delete();
    }
    else if (type == 'offline') {
      return this.firestore.collection('offlineShop').doc(id).delete();
    }
    else if (type == 'shorts') {
      return this.firestore.collection('youtubeShorts').doc(id).delete();
    }
    else if (type == 'coupon') {
      return this.firestore.collection('coupons').doc(id).delete();
    }
    else if (type == 'adbanner') {
      return this.firestore.collection('videoAdBanner').doc(id).delete();
    }
    else if (type == 'imageBanner') {
      return this.firestore.collection('imageBanner').doc(id).delete();
    }
    else if (type == 'dailyTasks') {
      console.log('yup in fire');
      return this.firestore.collection('dailyTasks').doc(id).delete();
    }
    else if (type == 'instagram') {
      return this.firestore.collection('instagram').doc(id).delete();
    }
    else if (type == 'reels') {
      return this.firestore.collection('reels').doc(id).delete();
    }
    else if (type == 'faceBook') {
      return this.firestore.collection('facebook').doc(id).delete();
    }
    else if (type == 'music') {
      return this.firestore.collection('music').doc(id).delete();
    }
    else if (type == 'kid') {
      return this.firestore.collection('childVideos').doc(id).delete();
    }
    else if (type == 'staff') {
      console.log('id', id);
      return this.firestore.collection('staff').doc(id).delete();
    }
    return 'No'
  }

  // Update method
  updateWithdrawal(id: string, data: any) {
    console.log(this.firestore.collection('withdrawal', ref => ref.where('withdrawalId', '==', id)));
    return this.firestore.collection('withdrawal').doc(id).update(data);
  }
  updateUser(id: string, data: any) {
    console.log('rejectedUser', this.firestore.collection('user').doc(id).get());
    return this.firestore.collection('user').doc(id).update(data);
  }

  // Delete method
  deleteShorts(id: string) {
    this.firestore.collection('youtubeShorts').doc(id).delete();
  }

  deleteReels(id: string) {
    this.firestore.collection('reels').doc(id).delete();
  }

  deleteCoupon(id: string) {
    this.firestore.collection('coupons').doc(id).delete();
  }

  deleteInstagram(id: string) {
    this.firestore.collection('instagram').doc(id).delete();
  }

  deleteDailytask(id: string) {
    this.firestore.collection('dailyTasks').doc(id).delete();
  }

  deleteAdbanner(id: string) {
    this.firestore.collection('adBanner').doc(id).delete();
  }

  // Rejectcall
  getrejectUser(id: string) {
    return this.firestore.collection('user', ref => ref.where('userId', '==', id)).get();
  }
}
