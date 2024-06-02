import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationServiceService } from 'src/app/Services/authentication-service.service';
import { AdminServiceService } from 'src/app/Services/Service/admin-service.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  isAdmin:boolean = false;
  //USER_MANAGEMENT, DAILY_TASK_MANAGEMENT(dailyTask, Ads), ADS_MANAGEMENT, YOUTUBE_VIDEO_MANAGEMENT(YoutubeVideo, Ads)

  rolePermissionMap = new Map<string, string[]>();
  //
  // {
  //   YOUTUBE_VIDEO_MANAGEMENT: ['YoutubeVideo', 'Ads'],
  //   ADS_MANAGEMENT: ['Ads'],
  //   DAILY_TASK_MANAGEMENT: ['Ads', 'DailyTask'],
  //   USER_MANAGEMENT: ['User']
  // }

  role: string | undefined;

  constructor(private adminService: AdminServiceService,
              private authService: AuthenticationServiceService,
              private route: Router) {
    this.rolePermissionMap.set('YOUTUBE_VIDEOS_MANAGEMENT', ['YoutubeVideo', 'Ads']);
    this.rolePermissionMap.set('ADS_MANAGEMENT', ['Ads']);
    this.rolePermissionMap.set('DAILY_TASK_MANAGEMENT', ['DailyTask', 'Ads']);
    this.rolePermissionMap.set('WITHDRAW_MANAGEMENT', ['Withdraw', 'User'])
    this.rolePermissionMap.set('SHOP_MANAGEMENT', ['Shop', 'ShopCategory'])
  }
  ngOnInit(): void {

    if(this.adminService.isAdmin == 'true'){
      this.isAdmin = true
      return;
    }
    this.role = this.adminService.getStaffRole()!;
    console.log("role", this.role);
  }

  hasPermission(section: string): boolean {
    return this.isAdmin || this.rolePermissionMap.get(this.role!)!.includes(section);
  }

  logout(){
    this.authService.logout().then(()=>{
      return this.route.navigate(['/adminLogin']);
    });
  }
}
