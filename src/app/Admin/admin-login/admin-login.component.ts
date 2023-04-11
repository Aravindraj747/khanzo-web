import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationServiceService } from 'src/app/Services/authentication-service.service';
import { AdminServiceService } from 'src/app/Services/Service/admin-service.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  spinnerActive: boolean = false;
  adminForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private _snackBar: MatSnackBar,
    private adminService: AdminServiceService,
    private authService: AuthenticationServiceService,
    private route: Router) { }

  ngOnInit(): void {
  }
  get email() {
    return this.adminForm.get('email');
  }

  get password() {
    return this.adminForm.get('password');
  }

  submit() {
    const { email, password } = this.adminForm.value;

    if (email == '') {
      this.openSnackBar('Enter the Email', 'undo')
    }
    else if (password == '') {
      this.openSnackBar('Enter the password', 'undo')
    }
    console.log(email, password);
    this.spinnerActive = true;
    this.adminService.checkIfAdmin(email!).subscribe(res => {
      console.log(res);
      if (res.docs.length > 0) {
        this.authService.login(email!, password!).then((res) => {
          console.log(res);
          this.getAdminDetails(email!);
          this.spinnerActive = false;
          this.adminService.isAdmin = 'true';
          this.route.navigate(['adminHome']);
        }, err => {
          console.log('error', err);
          this.openSnackBar('Invalid Email or password', 'Undo');
          this.spinnerActive = false;
        });
        console.log(email, password);
      }
      else {
        console.log('staff here')
        this.adminService.checkIfStaff(email!).subscribe(res=>{
          if (res.docs.length > 0) {
            this.authService.login(email!, password!).then((res) => {
              this.route.navigate(['youtube']);
              console.log('in login');
              this.adminService.isStaff = 'true';
              console.log(res);
              this.getStaffDetails(email!);
              this.spinnerActive = false;
            }, err => {
              console.log('error', err);
              this.openSnackBar('Invalid Email or password', 'Undo');
              this.spinnerActive = false;
            });
            console.log(email, password);
          }
          else{
            this.openSnackBar('Enter valid credential to login', 'Retry');
            this.spinnerActive = false;
            return;
          }
        });
      }
    });
  }
  async getAdminDetails(email: string) {
    await this.adminService.getAdmin(email);
  }
  async getStaffDetails(email: string) {
    await this.adminService.getStaff(email!);
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
