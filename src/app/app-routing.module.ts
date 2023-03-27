import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './Admin/admin-home/admin-home.component';
import { AdminLoginComponent } from './Admin/admin-login/admin-login.component';
import { SideNavComponent } from './Admin/side-nav/side-nav.component';
import { StaffCreationComponent } from './Admin/staff-creation/staff-creation.component';
import { UserComponent } from './Admin/user/user.component';
import { CouponsComponent } from './Staff/coupons/coupons.component';
import { FacebookComponent } from './Staff/facebook/facebook.component';
import { ImageBannerComponent } from './Staff/image-banner/image-banner.component';
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
  {path:'staffSideNav',component:StaffSideNavComponent},
  {path:'staffHome',component:StaffHomeComponent},
  {path:'youtube',component:StaffYoutubeComponent},
  {path:'dailyTask',component:StaffDailyTaskComponent},
  {path:'instagram',component:StaffInstagramComponent},
  {path:'shorts',component:StaffShortsComponent},
  {path:'reels',component:StaffReelsComponent},
  {path:'adbanner',component:StaffAdbannerComponent},
  {path:'coupons',component:CouponsComponent},
  {path:'faceBook',component:FacebookComponent},
  {path:'terms',component:TermsandConditionComponent},
  {path:'imageBanner',component:ImageBannerComponent},
  // Admin Components
  {path:'adminHome',component:AdminHomeComponent},
  {path:'adminSideNav',component:SideNavComponent},
  {path:'user',component:UserComponent},
  {path:'staffCreation',component:StaffCreationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
