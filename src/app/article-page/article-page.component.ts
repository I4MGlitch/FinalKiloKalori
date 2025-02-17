import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../services/article.service';
import { WebsiteService } from '../services/website.service';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.css']
})
export class ArticlePageComponent implements OnInit {
  articles: any[] = [];
  currentPage = 1;
  totalPages = 0;
  pageSize = 6;
  website: any;

  constructor(private articleService: ArticleService, private websiteservice: WebsiteService) {}

  ngOnInit(): void {
    this.loadArticles(this.currentPage);
    this.fetchWebsite()
  }

  fetchWebsite(): void {    
    this.websiteservice.getWebsiteData().subscribe(data => {
      this.website = data;
      console.log('Website:', this.website);
    });    
  }

  loadArticles(page: number): void {
    this.articleService.getArticles(page, this.pageSize).subscribe(response => {
      this.articles = response.articles.map((article: { description: string; }) => {
        let parsedDescription;
        try {
          parsedDescription = JSON.parse(article.description);
          if (!Array.isArray(parsedDescription)) {
            throw new Error("Invalid format");
          }
        } catch (e) {
          parsedDescription = article.description;
        }
  
        return { ...article, description: parsedDescription };
      });
  
      this.totalPages = response.totalPages;
      console.log("Articles:", this.articles);
    }, error => {
      console.error("Error loading articles:", error);
    });
  }
    

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadArticles(newPage);
    }
  }

  isChatOpen = false;
  whatsappNumber = '1234567890'; // Change with your actual WhatsApp number

  toggleChat() {
    this.whatsappNumber = this.website.whatsapp
    this.isChatOpen = !this.isChatOpen;
    document.body.classList.toggle('chatbox-open', this.isChatOpen);
  }

}
