import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './Admin/admin-login/admin-login.component';
import { StaffLoginComponent } from './Staff/staff-login/staff-login.component';
import { AdminHomeComponent } from './Admin/admin-home/admin-home.component';
import { SideNavComponent } from './Admin/side-nav/side-nav.component';
import { StaffSideNavComponent } from './Staff/staff-side-nav/staff-side-nav.component';
import { StaffYoutubeComponent } from './Staff/staff-youtube/staff-youtube.component';
import { StaffHomeComponent } from './Staff/staff-home/staff-home.component';
import { StaffDailyTaskComponent } from './Staff/staff-daily-task/staff-daily-task.component';

// MatMlodule
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';

// FireBase
import {AngularFireModule} from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage} from '@angular/fire/storage';
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
// import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    StaffLoginComponent,
    AdminHomeComponent,
    SideNavComponent,
    StaffSideNavComponent,
    StaffHomeComponent,
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
    MusicComponent
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
    HttpClientModule
  ],
  providers: [
    AdminauthguardGuard,
    StaffauthguardGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
