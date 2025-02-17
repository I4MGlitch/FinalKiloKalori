import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../services/article.service';
import { WebsiteService } from '../services/website.service';

@Component({
  selector: 'app-article-details-page',
  templateUrl: './article-details-page.component.html',
  styleUrls: ['./article-details-page.component.css']
})
export class ArticleDetailsPageComponent { 
  articleId: string | undefined;  
  article: any;
  website: any;

  constructor(
    private route: ActivatedRoute,
    private articleservice: ArticleService,
    private websiteservice: WebsiteService,    
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.articleId = params['id'];
      if (this.articleId) {
        this.fetchArticleDetails(this.articleId);
      }
    });
    this.fetchWebsite()
  }
  
  fetchWebsite(): void {    
    this.websiteservice.getWebsiteData().subscribe(data => {
      this.website = data;
      console.log('Website:', this.website);
    });    
  }

  fetchArticleDetails(id: string): void {
    this.articleservice.getArticleById(id).subscribe(
      (data) => {     
          if (data && data.description) {
          let parsedDescription;
          try {
            parsedDescription = JSON.parse(data.description);
            if (!Array.isArray(parsedDescription)) {
              throw new Error("Invalid format");
            }
          } catch (e) {
            parsedDescription = data.description;
          }
  
          this.article = { ...data, description: parsedDescription };
        }
      },      
    );
  }
  
  
  isChatOpen = false;
  whatsappNumber = '1234567890'; // Change with your actual WhatsApp number

  toggleChat() {
    this.whatsappNumber = this.website.whatsapp
    this.isChatOpen = !this.isChatOpen;
    document.body.classList.toggle('chatbox-open', this.isChatOpen);
  }

}
