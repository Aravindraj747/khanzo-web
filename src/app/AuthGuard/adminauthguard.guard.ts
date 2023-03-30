import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminServiceService } from '../Services/Service/admin-service.service';

@Injectable({
  providedIn: 'root'
})
export class AdminauthguardGuard implements CanActivate {
  constructor(private adminService: AdminServiceService, private route: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.adminService.getAdminLogin() == 'true') {
      return true;
    }
    this.route.navigate(['adminLogin']);
    return false;
  }
}
