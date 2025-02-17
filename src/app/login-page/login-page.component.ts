import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  showPassword: boolean = false;
  loginData = {
      username: '',
      password: ''
    };
    
    constructor(private adminservice: AdminService, private router: Router) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.loginData.username && this.loginData.password) {
      this.adminservice.login(this.loginData).subscribe(
        response => {
          console.log('Login response:', response);

          if (!this.adminservice.isAdmin()) {
            alert('Access denied: Only admins are allowed.');
            this.adminservice.logout();
            return;
          }

          this.router.navigate(['/admin-page']);  // Ensure this route exists
        },
        error => {
          alert('Login failed: Username or password is incorrect.');
        }
      );
    } else {
      alert('Please enter both username and password.');
    }
  }
  
}
