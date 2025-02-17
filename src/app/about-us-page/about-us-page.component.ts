import { Component } from '@angular/core';
import { WebsiteService } from '../services/website.service';

@Component({
  selector: 'app-about-us-page',
  templateUrl: './about-us-page.component.html',
  styleUrls: ['./about-us-page.component.css']
})
export class AboutUsPageComponent {
  website: any;
  isChatOpen = false;
  whatsappNumber = '1234567890'; // Change with your actual WhatsApp number

  constructor(private websiteservice: WebsiteService){}
  
  ngOnInit(): void {
    this.fetchWebsite();
  }
  
  toggleChat() {
    this.whatsappNumber = this.website.whatsapp
    this.isChatOpen = !this.isChatOpen;
    document.body.classList.toggle('chatbox-open', this.isChatOpen);
  }

  fetchWebsite(): void {    
    this.websiteservice.getWebsiteData().subscribe(data => {
      this.website = data;
      console.log('Website:', this.website);
    });    
  }
}
