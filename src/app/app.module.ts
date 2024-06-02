import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './Admin/admin-login/admin-login.component';
import { AdminHomeComponent } from './Admin/admin-home/admin-home.component';
import { SideNavComponent } from './Admin/side-nav/side-nav.component';
import { StaffYoutubeComponent } from './Staff/staff-youtube/staff-youtube.component';
import { StaffDailyTaskComponent } from './Staff/staff-daily-task/staff-daily-task.component';

// MatMlodule
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';

// FireBase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

//
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StaffInstagramComponent } from './Staff/staff-instagram/staff-instagram.component';
import { StaffShortsComponent } from './Staff/staff-shorts/staff-shorts.component';
import { StaffReelsComponent } from './Staff/staff-reels/staff-reels.component';
import { StaffAdbannerComponent } from './Staff/staff-adbanner/staff-adbanner.component';
import { UserComponent } from './Admin/user/user.component';
import { CouponsComponent } from './Staff/coupons/coupons.component';
import { StaffCreationComponent } from './Admin/staff-creation/staff-creation.component';
import { DialogComponent } from './Admin/dialog/dialog.component';
import { FacebookComponent } from './Staff/facebook/facebook.component';
import { TermsandConditionComponent } from './Staff/termsand-condition/termsand-condition.component';
import { ImageBannerComponent } from './Staff/image-banner/image-banner.component';
import { MusicComponent } from './Staff/music/music.component';
import { AdminauthguardGuard } from './AuthGuard/adminauthguard.guard';
import { StaffauthguardGuard } from './AuthGuard/staffauthguard.guard';
import { KidsComponent } from './Staff/kids/kids.component';
import { PrivacyComponent } from './Staff/privacy/privacy.component';
import { OnlineShopComponent } from './Staff/online-shop/online-shop.component';
import { OfflineShopComponent } from './Staff/offline-shop/offline-shop.component';
import { ReportComponent } from './Staff/report/report.component';
import { LandingComponent } from './Staff/landing/landing.component';
import { ContactComponent } from './Staff/contact/contact.component';
import { CancelComponent } from './Staff/cancel/cancel.component';
import { DashboardComponent } from './Staff/dashboard/dashboard.component';
import {MatMenuModule} from "@angular/material/menu";
import { HomeAdComponent } from './Staff/home-ad/home-ad.component';
import { AddAdDialogComponent } from './Staff/add-ad-dialog/add-ad-dialog.component';
import { WithdrawComponent } from './Staff/withdraw/withdraw.component';
import { ShopCategoryComponent } from './Staff/shop-category/shop-category.component';
import { OtherAdsComponent } from './Staff/other-ads/other-ads.component';
import { EditShopCategoryDailogComponent } from './Staff/edit-shop-category-dailog/edit-shop-category-dailog.component';
import { ShippingPolicyComponent } from './Staff/shipping-policy/shipping-policy.component';
import { InstructionsComponent } from './Staff/instructions/instructions.component';
// import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    AdminHomeComponent,
    SideNavComponent,
    StaffYoutubeComponent,
    StaffDailyTaskComponent,
    StaffInstagramComponent,
    StaffShortsComponent,
    StaffReelsComponent,
    StaffAdbannerComponent,
    UserComponent,
    CouponsComponent,
    StaffCreationComponent,
    DialogComponent,
    FacebookComponent,
    TermsandConditionComponent,
    ImageBannerComponent,
    MusicComponent,
    KidsComponent,
    PrivacyComponent,
    OnlineShopComponent,
    OfflineShopComponent,
    ReportComponent,
    LandingComponent,
    ContactComponent,
    CancelComponent,
    DashboardComponent,
    HomeAdComponent,
    AddAdDialogComponent,
    WithdrawComponent,
    ShopCategoryComponent,
    OtherAdsComponent,
    EditShopCategoryDailogComponent,
    ShippingPolicyComponent,
    InstructionsComponent
  ],
  entryComponents: [DialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    AngularFireModule,
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatMenuModule
  ],
  providers: [
    AdminauthguardGuard,
    StaffauthguardGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
