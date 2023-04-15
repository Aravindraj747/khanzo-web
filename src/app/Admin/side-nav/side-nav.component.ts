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
  constructor(private adminService: AdminServiceService,
              private authService: AuthenticationServiceService,
              private route: Router) { }
  ngOnInit(): void {
    if(this.adminService.isAdmin == 'true'){
      this.isAdmin = true
    }
    // console.log('sidenav',this.isAdmin);
  }

  logout(){
    this.authService.logout().then(()=>{
      return this.route.navigate(['/']);
    });
  }
}
