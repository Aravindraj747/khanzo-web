import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationServiceService } from 'src/app/Services/authentication-service.service';

@Component({
  selector: 'app-staff-login',
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent implements OnInit {

  spinnerActive:boolean = false;
  staffForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  constructor(private authService: AuthenticationServiceService,
    private _snackBar: MatSnackBar,
    private route: Router) { }

  ngOnInit(): void {
  }
  get email() {
    return this.staffForm.get('email');
  }

  get password() {
    return this.staffForm.get('password');
  }

  submit() {
    const { email, password } = this.staffForm.value;

    if (email == '') {
      this.openSnackBar('Enter the Email', 'undo')
      return
    }
    else if (password == '') {
      this.openSnackBar('Enter the password', 'undo')
      return
    }
    this.spinnerActive = true;
    console.log(email, password);
    this.authService.checkIfStaff(email!).subscribe(res => {
      // this.authService.isAdmin = 'true';
      console.log(res);
      if (res.docs.length > 0) {
        this.authService.login(email!, password!).then((res) => {
          console.log(res);
          this.spinnerActive = false;
          this.route.navigate(['staffYoutube']);
        }, err => {
          console.log('error', err);
          this.spinnerActive = false;
          this.openSnackBar('Invalid Email or password', 'Undo');
        });
        console.log(email, password);
      }
      else {
        this.spinnerActive = false;
        this.openSnackBar('Enter valid credential to login', 'Retry');
        return;
      }
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    })
  }
}
