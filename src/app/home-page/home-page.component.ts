import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImageService } from '../services/image.service';
import { ArticleService } from '../services/article.service';
import { WebsiteService } from '../services/website.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  private progressBarInterval: any;
  private carousel: any;
  private indicators: NodeListOf<HTMLElement> | null = null;
  private currentSlide: number = 0;
  private totalSlides: number = 3; // Jumlah total slide dalam carousel
  private intervalTime: number = 7000; // Waktu interval per slide (7 detik)

  website: any;
  wholeCakes: any[] = [];
  bentoCakes: any[] = [];
  articles: any[] = [];

  constructor(private imageservice: ImageService, private articleservice: ArticleService, private websiteservice: WebsiteService) {}

  ngOnInit(): void {
    this.initializeCarousel();   
    this.fetchDatas();
    this.fetchWebsite();
  }

  ngOnDestroy(): void {
    if (this.progressBarInterval) {
      clearInterval(this.progressBarInterval);
    }
  }

  fetchWebsite(): void {    
    this.websiteservice.getWebsiteData().subscribe(data => {
      this.website = data;
      console.log('Website:', this.website);
    });    
  }

  initializeCarousel(): void {
    this.carousel = document.querySelector('#carouselExampleCaptions');
    this.indicators = document.querySelectorAll('.carousel-indicators button');

    if (this.carousel) {
      this.carousel.addEventListener('slide.bs.carousel', (event: any) => {
        this.currentSlide = event.to;
        this.resetProgressBars();
        this.startProgressBar(this.currentSlide); // Reset dan mulai progress bar baru saat slide berpindah
      });
    }

    // Menambahkan event listener untuk tombol prev, next, dan indicator
    const prevButton = this.carousel?.querySelector('.carousel-control-prev');
    const nextButton = this.carousel?.querySelector('.carousel-control-next');
    
    prevButton?.addEventListener('click', () => this.handleSlideChange());
    nextButton?.addEventListener('click', () => this.handleSlideChange());
    this.indicators?.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.handleSlideChange());
    });

    // Mulai progress bar pada slide pertama
    this.startProgressBar(this.currentSlide);

    // Perpindahan otomatis slide setiap 7 detik
    setInterval(() => {
      this.moveToNextSlide();
    }, this.intervalTime);
  }

  handleSlideChange(): void {
    this.resetProgressBars(); // Reset progress bar ketika slide berubah
    this.startProgressBar(this.currentSlide); // Mulai ulang progress bar
  }

  startProgressBar(slideIndex: number): void {
    if (!this.indicators) return;

    let currentWidth = 0;
    const indicator = this.indicators[slideIndex];

    if (indicator) {
      indicator.style.setProperty('--progress-width', '0%');
    }

    // Hentikan interval progress bar yang sedang berjalan, dan mulai yang baru
    clearInterval(this.progressBarInterval);

    // Membuat interval untuk progress bar dimulai dari 0% setiap kali slide berubah
    this.progressBarInterval = setInterval(() => {
      if (currentWidth < 100) {
        currentWidth += 1;
        if (indicator) {
          indicator.style.setProperty('--progress-width', `${currentWidth}%`);
        }
      } else {
        // Hentikan interval setelah progress mencapai 100%
        clearInterval(this.progressBarInterval);
      }
    }, this.intervalTime / 100); // Progress bar tetap penuh dalam 7 detik
  }

  resetProgressBars(): void {
    // Pastikan interval progress bar dihentikan dan progress bar di-reset
    if (this.progressBarInterval) {
      clearInterval(this.progressBarInterval);
      this.progressBarInterval = null;
    }

    // Reset semua progress bar indicator ke 0%
    this.indicators?.forEach((indicator) => {
      indicator.style.setProperty('--progress-width', '0%');
    });
  }

  moveToNextSlide(): void {
    if (!this.carousel) return;

    let nextSlide = (this.currentSlide + 1) % this.totalSlides;
    (window as any).bootstrap.Carousel.getOrCreateInstance(this.carousel).to(nextSlide);
  }

  fetchDatas(): void {
    this.imageservice.getAllWholeCake().subscribe(data => {
      this.wholeCakes = data;
      console.log('Whole Cakes:', this.wholeCakes); // Log whole cakes data
    });

    this.imageservice.getAllBentoCake().subscribe(data => {
      this.bentoCakes = data;
      console.log('Bento Cakes:', this.bentoCakes); // Log bento cakes data
    });

    this.articleservice.getLatestThreeArticles().subscribe(data => {
      this.articles = data;
      console.log('Articles:', this.articles); // Log bento cakes data
    });
  }

  isChatOpen = false;
  whatsappNumber = '1234567890'; // Change with your actual WhatsApp number

  toggleChat() {
    this.whatsappNumber = this.website.whatsapp
    this.isChatOpen = !this.isChatOpen;
    document.body.classList.toggle('chatbox-open', this.isChatOpen);
  }


}
