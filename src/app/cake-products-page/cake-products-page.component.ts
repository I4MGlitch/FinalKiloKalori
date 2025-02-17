import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ImageService } from '../services/image.service';
import { WholecakeService } from '../services/wholecake.service';
import { BentocakeService } from '../services/bentocake.service';
import { CloudinaryService } from '../services/cloudinary.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebsiteService } from '../services/website.service';

@Component({
  selector: 'app-cake-products-page',
  templateUrl: './cake-products-page.component.html',
  styleUrls: ['./cake-products-page.component.css']
})
export class CakeProductsPageComponent {
  category: string | undefined;
  cakeId: string | undefined;
  theCakes: any[] = [];
  theCakesDetails: any[] = [];
  cakes: any[] = [];
  selectedImage: string = '';
  selectedFlavour: string = 'Vanilla';
  filteredCakes: any[] = [];
  uniqueFlavours: string[] = [];
  selectedSize: string = '';
  phone: string = '+6287839892718';
  notes: string = '';
  cakeImage: File | null = null;
  isLoading: boolean = false;
  website: any;

  constructor(
    private route: ActivatedRoute,
    private imageservice: ImageService,
    private wholecakeservice: WholecakeService,
    private bentocakeservice: BentocakeService,
    private cloudinaryservice: CloudinaryService,
    private http: HttpClient,
    private router: Router,
    private websiteservice: WebsiteService,
  ) { }

  ngOnInit(): void {    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    // Set default selected flavour to 'Vanilla'
    this.selectedFlavour = 'Vanilla';

    // Subscribe to route params
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.cakeId = params['id'];
      // Fetch images and filter cakes based on the default flavour
      this.fetchImages();
      this.fetchOppositeImages()
      this.fetchWebsite()
    });

  }

  fetchWebsite(): void {    
    this.websiteservice.getWebsiteData().subscribe(data => {
      this.website = data;
      console.log('Website:', this.website);
    });    
  }

  fetchImages(): void {
    if (this.category === 'Whole Cake') {
      this.imageservice.getAllWholeCake().subscribe(data => {
        this.theCakes = data;
        console.log('Whole Cakes:', this.theCakes);
      });
      this.wholecakeservice.getAllWholeCakes().subscribe(data => {
        this.theCakesDetails = data;
        this.filterUniqueFlavours();
        this.updateFilteredCakes();  // Make sure filtered cakes are updated after fetching data        
        console.log('Whole Cakes Details:', this.theCakesDetails);
        this.setSelectedImage();
      });
    } else if (this.category === 'Bento Cake') {
      this.imageservice.getAllBentoCake().subscribe(data => {
        this.theCakes = data;
        console.log('Bento Cakes:', this.theCakes);
        this.bentocakeservice.getAllBentoCakes().subscribe(data => {
          this.theCakesDetails = data;
          this.filterUniqueFlavours();
          this.updateFilteredCakes();  // Make sure filtered cakes are updated after fetching data          
          console.log('Bento Cake Details:', this.theCakesDetails);
          this.setSelectedImage();
        });
      });
    }
  }

  fetchOppositeImages(): void {
    if (this.category === 'Whole Cake') {
      this.imageservice.getAllBentoCake().subscribe(data => {
        this.cakes = data;
        console.log('Bento Cakes (Opposite Category):', this.cakes);
      });
    } else if (this.category === 'Bento Cake') {
      this.imageservice.getAllWholeCake().subscribe(data => {
        this.cakes = data;
        console.log('Whole Cakes (Opposite Category):', this.cakes);
      });
    }
  }

  setSelectedImage(): void {
    if (this.theCakes.length > 0) {
      // Find the index of the cake that matches the route parameter.
      // Convert both values to strings to avoid type mismatches.
      const index = this.theCakes.findIndex(cake => String(cake._id) === String(this.cakeId));
      
      if (index !== -1) {
        // Remove the selected cake from its current position…
        const selectedCake = this.theCakes.splice(index, 1)[0];
        // …and insert it at the beginning of the array.
        this.theCakes.unshift(selectedCake);
        // Set the selected image to this cake's image.
        this.selectedImage = selectedCake.imageUrl;
      } else {
        // If no match is found, use the first cake's image as a fallback.
        this.selectedImage = this.theCakes[0].imageUrl;
      }
    }
  }

  onFlavorChange(event: any): void {
    this.selectedFlavour = event.target.value;
    this.updateFilteredCakes();  // Reapply the filtering when flavor changes
  }

  filterUniqueFlavours(): void {
    const flavours = this.theCakesDetails.map(cake => cake.flavor);  // Use `flavor` here, consistent with your cake data
    this.uniqueFlavours = [...new Set(flavours)];
  }

  updateFilteredCakes(): void {
    this.filteredCakes = this.theCakesDetails.filter(cake => cake.flavor === this.selectedFlavour);  // Use `flavor` consistently here
  }

  filterCakes(flavour: string): void {
    this.selectedFlavour = flavour;
    this.updateFilteredCakes();  // Apply filter immediately on selection
  }

  reloadPage(event: Event) {
    event.preventDefault();  // Prevent Angular’s default navigation
    window.location.href = (event.target as HTMLAnchorElement).href; // Force full reload
  }

  setModalImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  onImageChange(event: any): void {
    this.cakeImage = event.target.files[0];
  }

  onSubmit() {
    if (!this.phone || !this.selectedFlavour || !this.selectedSize) {
      alert('Please fill out all required fields.');
      return;
    }

    this.isLoading = true;

    if (this.cakeImage) {
      // Upload image if it exists
      this.cloudinaryservice.uploadImage(this.cakeImage).subscribe(async (uploadedImage) => {
        const imageUrl = uploadedImage.secure_url;
        this.processOrder(imageUrl);
      });
    } else {
      // Proceed without image
      this.processOrder('');
    }
  }

  processOrder(imageUrl: string) {
    let shortUrl = imageUrl || 'No Image Provided';

    if (imageUrl) {
      const headers = new HttpHeaders({
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer YEuOSH0v3tP7U1cskCAWTtgn07HJT62pUqd5tX79leVQ9eVatJcDqJNqVFSt" // Replace with a valid API Key
      });

      this.http.post<any>('https://api.tinyurl.com/create',
        { url: imageUrl, domain: "tinyurl.com" },
        { headers } // Pass headers properly
      ).toPromise()
        .then(response => {
          shortUrl = response.data.tiny_url;
        })
        .catch(error => {
          console.log('Skipping URL shortening due to error:', error);
        })
        .finally(() => {
          this.sendWhatsappMessage(shortUrl);
        });
    } else {
      this.sendWhatsappMessage(shortUrl);
    }
  }

  sendWhatsappMessage(shortUrl: string) {
    const message = `Halo, Saya Mau Order Kue.%0A%0A*Cake Details:*%0A- Size: ${this.selectedSize}%0A- Flavour: ${this.selectedFlavour}%0A- Notes: ${this.notes}%0A%0AFoto Referensi:%0A${shortUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(this.phone)}&text=${message}`;

    window.open(whatsappUrl, '_blank');
    this.isLoading = false;
  }

  isChatOpen = false;
  whatsappNumber = '1234567890'; // Change with your actual WhatsApp number

  toggleChat() {
    this.whatsappNumber = this.website.whatsapp;
    this.isChatOpen = !this.isChatOpen;
    document.body.classList.toggle('chatbox-open', this.isChatOpen);
  }

}
