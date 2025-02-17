import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../services/image.service';
import { DonutService } from '../services/donut.service';
import { TiramisuService } from '../services/tiramisu.service';
import { CloudinaryService } from '../services/cloudinary.service';
import { HttpClient } from '@angular/common/http';
import { WebsiteService } from '../services/website.service';

@Component({
  selector: 'app-dessert-products-page',
  templateUrl: './dessert-products-page.component.html',
  styleUrls: ['./dessert-products-page.component.css']
})
export class DessertProductsPageComponent {
  category: string | undefined;
  theCakes: any[] = [];
  theCakesDetails: any[] = [];
  cakes: any[] = [];
  desc: any; 
  selectedFlavors: string[] = [];
  selectedImage: string = '';
  selectedSize: string = '';
  phone: string = '+6287839892718';  
  isLoading: boolean = false;
  website: any;

  constructor(
    private route: ActivatedRoute,
    private imageservice: ImageService,
    private donutservice: DonutService,
    private tiramisuservice: TiramisuService    ,
    private cloudinaryservice: CloudinaryService,
    private http: HttpClient,
    private websiteservice: WebsiteService
  ) { }

  ngOnInit(): void {
    // Subscribe to route params
    this.route.params.subscribe(params => {
      this.category = params['category'];
      // Fetch images and filter cakes based on the default flavour
      this.fetchImages();
    });

    this.fetchOppositeImages()
    this.fetchWebsite()
  }

  fetchWebsite(): void {    
    this.websiteservice.getWebsiteData().subscribe(data => {
      this.website = data;
      console.log('Website:', this.website);
    });    
  }

  fetchImages(): void {
    if (this.category === 'Donut') {
      this.imageservice.getAllDonut().subscribe(data => {
        this.theCakes = data;
        console.log('Donut:', this.theCakes);
        this.desc = 'Our donuts are crafted to perfection—light, fluffy, and irresistibly sweet. Made fresh daily, they come in a variety of flavors. Each bite delivers the perfect balance of softness and sweetness, making them the ultimate treat. Whether enjoyed with coffee or as an afternoon snack, they bring joy to any moment. Indulge in our handcrafted donuts and experience pure happiness in every bite.'
      });
  
      this.donutservice.getAllDonuts().subscribe(data => {
        this.theCakesDetails = data.map((cake: any) => ({
          ...cake,
          selected: true // Mark all as selected
        }));
        this.updateSelectedFlavors(); // Update the selected flavors array
        console.log('Donut Details:', this.theCakesDetails);
      });
  
    } else if (this.category === 'Tiramisu') {
      this.imageservice.getAllTiramisu().subscribe(data => {
        this.theCakes = data;
        console.log('Tiramisu:', this.theCakes);
        this.desc = 'Tiramisu is a timeless dessert that blends rich espresso-soaked layers with smooth cream. Its delicate balance of sweetness and bold coffee flavors creates a luxurious experience in every bite. Topped with a dusting of cocoa, it melts effortlessly on the tongue, leaving a velvety finish. Perfect for special occasions or a simple indulgence, this classic treat never fails to impress. Savor the elegance of our tiramisu and let each bite transport you to pure bliss.'
      });
  
      this.tiramisuservice.getAllTiramisu().subscribe(data => {
        this.theCakesDetails = data.map((cake: any) => ({
          ...cake,
          selected: true // Mark all as selected
        }));
        this.updateSelectedFlavors(); // Update the selected flavors array
        console.log('Tiramisu Details:', this.theCakesDetails);
      });
    }
  }
  
  updateSelectedFlavors(): void {
    this.selectedFlavors = this.theCakesDetails
      .filter(cake => cake.selected)
      .map(cake => cake.name);
  
    console.log("Selected Flavors:", this.selectedFlavors);
  } 

  fetchOppositeImages(): void {
    if (this.category === 'Donut') {
      this.imageservice.getAllBentoCake().subscribe(data => {
        this.cakes = data;
        console.log('Bento Cakes (Opposite Category):', this.cakes);
      });
    } else if (this.category === 'Tiramisu') {
      this.imageservice.getAllWholeCake().subscribe(data => {
        this.cakes = data;
        console.log('Whole Cakes (Opposite Category):', this.cakes);
      });
    }
  }
 
  setModalImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  onSubmit() {
    if (!this.phone || !this.selectedFlavors) {
      alert('Please fill out all required fields.');
      return;
    }
  
    this.isLoading = true;
    this.sendWhatsappMessage();
  }
  
  sendWhatsappMessage() {
    const message = `Halo, Saya Mau Order Dessert.%0A%0A*${this.category} Details:%0A- Flavour: ${this.selectedFlavors}`;
  
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(this.phone)}&text=${message}`;
  
    window.open(whatsappUrl, '_blank');
    this.isLoading = false;
  }
  
  isChatOpen = false;
  whatsappNumber = '1234567890'; // Change with your actual WhatsApp number

  toggleChat() {
    this.whatsappNumber = this.website.whatsapp
    this.isChatOpen = !this.isChatOpen;
    document.body.classList.toggle('chatbox-open', this.isChatOpen);
  }

}
