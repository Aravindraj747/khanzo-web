import { Component, OnInit } from '@angular/core';
import { AuthenticationServiceService } from 'src/app/Services/authentication-service.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  isAdmin:boolean = false;
  constructor(private authService: AuthenticationServiceService) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin;
    console.log(this.isAdmin);
    // this.isAdmin = true;
  }

}
