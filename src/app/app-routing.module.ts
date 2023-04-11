import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './Admin/admin-home/admin-home.component';
import { AdminLoginComponent } from './Admin/admin-login/admin-login.component';
import { SideNavComponent } from './Admin/side-nav/side-nav.component';
import { StaffCreationComponent } from './Admin/staff-creation/staff-creation.component';
import { UserComponent } from './Admin/user/user.component';
import { AdminauthguardGuard } from './AuthGuard/adminauthguard.guard';
import { StaffauthguardGuard } from './AuthGuard/staffauthguard.guard';
import { CouponsComponent } from './Staff/coupons/coupons.component';
import { FacebookComponent } from './Staff/facebook/facebook.component';
import { ImageBannerComponent } from './Staff/image-banner/image-banner.component';
import { KidsComponent } from './Staff/kids/kids.component';
import { MusicComponent } from './Staff/music/music.component';
import { PrivacyComponent } from './Staff/privacy/privacy.component';
import { StaffAdbannerComponent } from './Staff/staff-adbanner/staff-adbanner.component';
import { StaffDailyTaskComponent } from './Staff/staff-daily-task/staff-daily-task.component';
import { StaffInstagramComponent } from './Staff/staff-instagram/staff-instagram.component';
import { StaffReelsComponent } from './Staff/staff-reels/staff-reels.component';
import { StaffShortsComponent } from './Staff/staff-shorts/staff-shorts.component';
import { StaffYoutubeComponent } from './Staff/staff-youtube/staff-youtube.component';
import { TermsandConditionComponent } from './Staff/termsand-condition/termsand-condition.component';
import { ReportComponent } from './Staff/report/report.component';
import { OnlineShopComponent } from './Staff/online-shop/online-shop.component';
import { OfflineShopComponent } from './Staff/offline-shop/offline-shop.component';
import { LandingComponent } from './Staff/landing/landing.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent
  },
  // Staff Components
  { path: 'youtube', component: StaffYoutubeComponent, canActivate: [StaffauthguardGuard] },
  { path: 'dailyTask', component: StaffDailyTaskComponent, canActivate: [StaffauthguardGuard] },
  { path: 'instagram', component: StaffInstagramComponent, canActivate: [StaffauthguardGuard] },
  { path: 'shorts', component: StaffShortsComponent, canActivate: [StaffauthguardGuard] },
  { path: 'reels', component: StaffReelsComponent, canActivate: [StaffauthguardGuard] },
  { path: 'adbanner', component: StaffAdbannerComponent, canActivate: [StaffauthguardGuard] },
  { path: 'coupons', component: CouponsComponent, canActivate: [StaffauthguardGuard] },
  { path: 'faceBook', component: FacebookComponent, canActivate: [StaffauthguardGuard] },
  { path: 'music', component: MusicComponent, canActivate: [StaffauthguardGuard] },
  { path: 'terms', component: TermsandConditionComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'imageBanner', component: ImageBannerComponent, canActivate: [StaffauthguardGuard] },
  { path: 'kids', component: KidsComponent, canActivate: [StaffauthguardGuard] },
  { path: 'privacy-policy', component: PrivacyComponent },
  { path: 'adminLogin', component: AdminLoginComponent },
  { path: 'online', component: OnlineShopComponent, canActivate: [StaffauthguardGuard] },
  { path: 'offline', component: OfflineShopComponent, canActivate: [StaffauthguardGuard] },
  // Admin Components
  { path: 'adminHome', component: AdminHomeComponent, canActivate: [AdminauthguardGuard] },
  { path: 'report', component: ReportComponent, canActivate: [AdminauthguardGuard] },
  { path: 'adminSideNav', component: SideNavComponent, canActivate: [StaffauthguardGuard] },
  { path: 'user', component: UserComponent, canActivate: [AdminauthguardGuard] },
  { path: 'staffCreation', component: StaffCreationComponent, canActivate: [AdminauthguardGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
