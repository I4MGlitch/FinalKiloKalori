import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  constructor() { }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const dropdowns = document.querySelectorAll(".nav-item.dropdown > a");
    if (window.innerWidth < 992) {
      dropdowns.forEach((dropdown: any) => {
        dropdown.style.pointerEvents = "auto"; // Aktifkan klik di mobile
      });
    } else {
      dropdowns.forEach((dropdown: any) => {
        dropdown.style.pointerEvents = "none"; // Nonaktifkan klik di desktop
      });
    }
  }
}
