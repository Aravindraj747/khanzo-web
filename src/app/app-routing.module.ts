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
import { MusicComponent } from './Staff/music/music.component';
import { StaffAdbannerComponent } from './Staff/staff-adbanner/staff-adbanner.component';
import { StaffDailyTaskComponent } from './Staff/staff-daily-task/staff-daily-task.component';
import { StaffHomeComponent } from './Staff/staff-home/staff-home.component';
import { StaffInstagramComponent } from './Staff/staff-instagram/staff-instagram.component';
import { StaffLoginComponent } from './Staff/staff-login/staff-login.component';
import { StaffReelsComponent } from './Staff/staff-reels/staff-reels.component';
import { StaffShortsComponent } from './Staff/staff-shorts/staff-shorts.component';
import { StaffSideNavComponent } from './Staff/staff-side-nav/staff-side-nav.component';
import { StaffYoutubeComponent } from './Staff/staff-youtube/staff-youtube.component';
import { TermsandConditionComponent } from './Staff/termsand-condition/termsand-condition.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AdminLoginComponent
  },
  // Staff Components
  {path:'staffLogin',component:StaffLoginComponent},
  {path:'adminLogin',component:AdminLoginComponent},
  {path:'staffSideNav',component:StaffSideNavComponent},
  {path:'staffHome',component:StaffHomeComponent},
  {path:'youtube',component:StaffYoutubeComponent ,canActivate:[StaffauthguardGuard]},
  {path:'dailyTask',component:StaffDailyTaskComponent ,canActivate:[StaffauthguardGuard]},
  {path:'instagram',component:StaffInstagramComponent ,canActivate:[StaffauthguardGuard]},
  {path:'shorts',component:StaffShortsComponent ,canActivate:[StaffauthguardGuard]},
  {path:'reels',component:StaffReelsComponent ,canActivate:[StaffauthguardGuard]},
  {path:'adbanner',component:StaffAdbannerComponent ,canActivate:[StaffauthguardGuard]},
  {path:'coupons',component:CouponsComponent ,canActivate:[StaffauthguardGuard]},
  {path:'faceBook',component:FacebookComponent ,canActivate:[StaffauthguardGuard]},
  {path:'music',component:MusicComponent ,canActivate:[StaffauthguardGuard]},
  {path:'terms',component:TermsandConditionComponent ,canActivate:[StaffauthguardGuard]},
  {path:'imageBanner',component:ImageBannerComponent ,canActivate:[StaffauthguardGuard]},
  // Admin Components
  {path:'adminHome',component:AdminHomeComponent ,canActivate:[AdminauthguardGuard]},
  {path:'adminSideNav',component:SideNavComponent},
  {path:'user',component:UserComponent  ,canActivate:[AdminauthguardGuard]},
  {path:'staffCreation',component:StaffCreationComponent  ,canActivate:[AdminauthguardGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
