import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kilo-kalori';
  
  showHeaderFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // List of routes where header/footer should be hidden
      const hiddenRoutes = ['/admin-page', '/login-page'];

      this.showHeaderFooter = !hiddenRoutes.includes(this.router.url);
    });
  }
}
