import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';
import { ImageService } from '../services/image.service';
import { WholecakeService } from '../services/wholecake.service';
import { BentocakeService } from '../services/bentocake.service';
import { DonutService } from '../services/donut.service';
import { TiramisuService } from '../services/tiramisu.service';
import { ArticleService } from '../services/article.service';
import { WebsiteService } from '../services/website.service';
import { forkJoin } from 'rxjs';

declare var bootstrap: any;
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
  wholeCakes: any[] = [];
  bentoCakes: any[] = [];
  donut: any[] = [];
  tiramisu: any[] = [];
  article: any[] = [];
  website: any = {};
  cakeVariants: any[] = [];
  dessertVariants: any[] = [];

  filteredWholeCake: any[] = [];
  filteredBentoCake: any[] = [];
  filteredTiramisu: any[] = [];
  filteredDonuts: any[] = [];
  filteredCakeVariants: any[] = [];
  filteredDessertVariants: any[] = [];
  filteredArticles: any[] = []; // Store filtered articles
  searchQuery: string = ''; // Search input value
  title: string = '';
  description: string = '';
  descriptionArray: string[] = [];
  flavour: string = '';
  size: string = '';
  price: string = '';
  showSize: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  selectedCategory: string | null = null;
  isUploading: boolean = false;

  constructor(
    private adminservice: AdminService,
    private router: Router,
    private imageservice: ImageService,
    private wholecakeservice: WholecakeService,
    private bentocakeservice: BentocakeService,
    private donutservice: DonutService,
    private tiramisuservice: TiramisuService,
    private articleservice: ArticleService,
    private websiteservice: WebsiteService
  ) { }

  ngOnInit() {
    if (!this.adminservice.isAdmin()) {
      this.router.navigate(['/login-page']); // Redirect to login if not admin
    }
    this.fetchDatas();
    forkJoin({
      wholeCakes: this.wholecakeservice.getAllWholeCakes(),
      bentoCakes: this.bentocakeservice.getAllBentoCakes()
    }).subscribe(({ wholeCakes, bentoCakes }) => {
      this.cakeVariants = [
        ...wholeCakes.map((cake: any) => ({ ...cake, category: 'Whole Cake' })),
        ...bentoCakes.map((cake: any) => ({ ...cake, category: 'Bento Cake' }))
      ];
      this.filteredCakeVariants = this.cakeVariants
      console.log('Cake Variants:', this.cakeVariants);
    });

    // Fetch dessert variants
    forkJoin({
      donut: this.donutservice.getAllDonuts(),
      tiramisu: this.tiramisuservice.getAllTiramisu()
    }).subscribe(({ donut, tiramisu }) => {
      this.dessertVariants = [
        ...donut.map((dessert: any) => ({ ...dessert, category: 'Donut' })),
        ...tiramisu.map((dessert: any) => ({ ...dessert, category: 'Tiramisu' }))
      ];
      this.filteredDessertVariants = this.dessertVariants
      console.log('Dessert Variants:', this.dessertVariants);
    });
  }

  closeOffcanvas() {
    // Tutup offcanvas secara manual
    const offcanvasElement = document.getElementById('sidebarOffcanvas');
    if (offcanvasElement) {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    }
    // Scroll ke paling atas halaman
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  fetchDatas(): void {
    this.imageservice.getAllWholeCake().subscribe(data => {
      this.wholeCakes = data;
      this.filteredWholeCake = this.wholeCakes;
      console.log('Whole Cakes:', this.wholeCakes);
    });
    this.imageservice.getAllBentoCake().subscribe(data => {
      this.bentoCakes = data;
      this.filteredBentoCake = this.bentoCakes;
      console.log('Bento Cakes:', this.bentoCakes);
    });
    this.imageservice.getAllDonut().subscribe(data => {
      this.donut = data;
      this.filteredDonuts = this.donut;
      console.log('Donut:', this.donut);
    });
    this.imageservice.getAllTiramisu().subscribe(data => {
      this.tiramisu = data;
      this.filteredTiramisu = this.tiramisu;
      console.log('Tiramisu:', this.bentoCakes);
    });
    this.articleservice.getEveryArticles().subscribe(response => {
      this.article = response.articles.map((article: { description: string; }) => {
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
      console.log("Articles:", this.article);
      this.filteredArticles = this.article
    }, error => {
      console.error("Error loading articles:", error);
    });
    this.websiteservice.getWebsiteData().subscribe(data => {
      this.website = data;
      console.log('Website:', this.website);
    });
  }

  onCategoryChange() {
    this.showSize = this.selectedCategory === 'Whole Cake' || this.selectedCategory === 'Bento Cake';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      // Preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview = null; // Reset if no file selected
    }
  }

  submitForm() {
    if (!this.selectedFile || !this.selectedCategory) {
      alert("Please select an image and a category before submitting.");
      return;
    }

    this.isUploading = true;

    this.imageservice.createImage(this.selectedFile, this.selectedCategory).subscribe(
      (response) => {
        console.log('Upload successful', response);
        alert('Image uploaded successfully!');

        // Ensure response contains necessary data
        if (!response || !response.data || !response.data._id || !response.data.imageUrl) {
          console.error("Invalid response from server:", response);
          alert("Upload completed, but response is invalid.");
          return;
        }

        this.isUploading = false;

        // Create new image object
        const newImage = {
          _id: response.data._id,
          name: response.data.name,
          imageUrl: response.data.imageUrl,
          category: this.selectedCategory,
        };

        // Add new image to the correct category array
        switch (this.selectedCategory) {
          case 'Whole Cake':
            this.filteredWholeCake = [...this.filteredWholeCake, newImage];
            break;
          case 'Bento Cake':
            this.filteredBentoCake = [...this.filteredBentoCake, newImage];
            break;
          case 'Donut':
            this.filteredDonuts = [...this.filteredDonuts, newImage];
            break;
          case 'Tiramisu':
            this.filteredTiramisu = [...this.filteredTiramisu, newImage];
            break;
          default:
            console.error('Unknown category:', this.selectedCategory);
        }

        this.isUploading = false;
        this.resetForm();
      },
      (error) => {
        console.error('Upload failed', error);
        alert('Failed to upload image');
        this.isUploading = false;
      }
    );
  }


  resetForm() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.selectedCategory = '';

    // Reset file input field
    const fileInput1 = document.getElementById('exampleInputFile1') as HTMLInputElement;
    if (fileInput1) {
      fileInput1.value = ''; // Clears the file input
    }
    const fileInput2 = document.getElementById('exampleInputFile2') as HTMLInputElement;
    if (fileInput2) {
      fileInput2.value = ''; // Clears the file input
    }
  }

  resetFormArticle() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.title = '';
    this.description= '';

    // Reset file input field
    const fileInput3 = document.getElementById('exampleInputFile3') as HTMLInputElement;
    if (fileInput3) {
      fileInput3.value = ''; // Clears the file input
    }    
  }

  resetFormVariants() {
    this.selectedFile = null;
    this.selectedCategory = null;
    this.imagePreview = null;
    this.flavour = '';
    this.size = '';
    this.price = '';

    // Reset file input field
    const fileInput3 = document.getElementById('exampleInputFile3') as HTMLInputElement;
    if (fileInput3) {
      fileInput3.value = ''; // Clears the file input
    }    
  }

  submitCake() {
    if (!this.selectedCategory || !this.flavour || !this.price || !this.size) {
      alert("Please fill in all required fields before submitting.");
      return;
    }

    this.isUploading = true;

    const cakeData = {
      flavor: this.flavour,
      price: this.price,
      size: this.size,
      category: this.selectedCategory,
    };

    let serviceCall;
    if (this.selectedCategory === 'Whole Cake') {
      serviceCall = this.wholecakeservice.createWholeCake(cakeData);
    } else if (this.selectedCategory === 'Bento Cake') {
      serviceCall = this.bentocakeservice.createBentoCake(cakeData);
    } else {
      alert("Invalid category for cake.");
      this.isUploading = false;
      return;
    }

    serviceCall.subscribe(
      (response: any) => {
        console.log(`${this.selectedCategory} created successfully`, response);
        alert(`${this.selectedCategory} added successfully!`);
        this.isUploading = false;

        // ✅ Update the list instantly
        const newCake = { ...response, category: this.selectedCategory };
        this.cakeVariants = [...this.cakeVariants, newCake];
        this.filteredCakeVariants = [...this.cakeVariants];

        this.resetFormVariants();
      },
      (error) => {
        console.error('Cake submission failed', error);
        alert('Failed to submit cake.');
        this.isUploading = false;
      }
    );
  }

  submitDessert() {
    if (!this.selectedCategory || !this.flavour || !this.price) {
      alert("Please fill in all required fields before submitting.");
      return;
    }

    this.isUploading = true;

    const dessertData = {
      name: this.flavour,
      price: this.price,
      category: this.selectedCategory,
    };

    let serviceCall;
    if (this.selectedCategory === 'Donut') {
      serviceCall = this.donutservice.createDonut(dessertData);
    } else if (this.selectedCategory === 'Tiramisu') {
      serviceCall = this.tiramisuservice.createTiramisu(dessertData);
    } else {
      alert("Invalid category for dessert.");
      this.isUploading = false;
      return;
    }

    serviceCall.subscribe(
      (response: any) => {
        console.log(`${this.selectedCategory} created successfully`, response);
        alert(`${this.selectedCategory} added successfully!`);
        this.isUploading = false;

        // ✅ Update the list instantly
        const newDessert = { ...response, category: this.selectedCategory };
        this.dessertVariants = [...this.dessertVariants, newDessert];
        this.filteredDessertVariants = [...this.dessertVariants];

        this.resetFormVariants();
      },
      (error) => {
        console.error('Dessert submission failed', error);
        alert('Failed to submit dessert.');
        this.isUploading = false;
      }
    );
  }

  updateDescription() {
    this.descriptionArray = this.description.split('\n').filter(para => para.trim() !== '');
  }

  removeParagraph(index: number) {
    this.descriptionArray.splice(index, 1);
  }

  submitArticle() {
    if (!this.selectedFile || !this.title || !this.description) {
      alert("Please fill in all fields and select an image.");
      return;
    }

    const descriptionArray = this.description
      .split(/\n+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const formData = new FormData();
    formData.append("title", this.title);
    formData.append("image", this.selectedFile);
    formData.append("description", JSON.stringify(descriptionArray));

    this.articleservice.createArticle(formData).subscribe(
      (response) => {
        console.log("Article uploaded successfully:", response);
        alert("Article uploaded successfully!");
        const newArticle = { ...response, category: this.selectedCategory };
        this.filteredArticles = [...this.filteredArticles, newArticle];
        this.resetFormArticle();
      },
      (error) => {
        console.error("Upload failed", error);
        alert("Failed to upload article");
      }
    );
  }

  searchWholeCake() {
    this.filteredWholeCake = this.wholeCakes
      .filter(wholeCakes => wholeCakes.category === 'Whole Cake')
      .filter(wholeCakes => wholeCakes.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  searchBentoCake() {
    this.filteredBentoCake = this.bentoCakes
      .filter(bentoCakes => bentoCakes.category === 'Bento Cake')
      .filter(bentoCakes => bentoCakes.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  searchTiramisu() {
    this.filteredTiramisu = this.tiramisu
      .filter(tiramisu => tiramisu.category === 'Tiramisu')
      .filter(tiramisu => tiramisu.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  searchDonuts() {
    this.filteredDonuts = this.donut
      .filter(donut => donut.category === 'Donut')
      .filter(donut => donut.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  searchVariants(): void {
    const query = this.searchQuery.toLowerCase();

    this.filteredCakeVariants = this.cakeVariants.filter(variant =>
      variant.flavor.toLowerCase().includes(query)
    );

    this.filteredDessertVariants = this.dessertVariants.filter(variant =>
      variant.name.toLowerCase().includes(query)
    );
  }

  searchArticles(): void {
    this.filteredArticles = this.article.filter(article =>
      article.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  deleteArticle(articleId: string): void {
    if (confirm('Are you sure you want to delete this article?')) {
      this.articleservice.deleteArticle(articleId).subscribe(
        () => {
          // Instantly update the list after deletion
          this.filteredArticles = this.filteredArticles.filter(article => article._id !== articleId);
          console.log(`Deleted article with ID: ${articleId}`);
        },
        (error) => {
          console.error('Error deleting article:', error);
        }
      );
    }
  }

  deleteVariant(variantId: string, category: string): void {
    if (confirm('Are you sure you want to delete this variant?')) {
      let deleteObservable;

      // Determine the correct service based on category
      switch (category) {
        case 'Whole Cake':
          deleteObservable = this.wholecakeservice.deleteWholeCake(variantId);
          break;
        case 'Bento Cake':
          deleteObservable = this.bentocakeservice.deleteBentoCake(variantId);
          break;
        case 'Donut':
          deleteObservable = this.donutservice.deleteDonut(variantId);
          break;
        case 'Tiramisu':
          deleteObservable = this.tiramisuservice.deleteTiramisu(variantId);
          break;
        default:
          console.error('Unknown category:', category);
          return;
      }

      // Perform delete operation
      deleteObservable.subscribe(
        () => {
          // Instantly update the list based on category
          if (category === 'Whole Cake' || category === 'Bento Cake') {
            this.filteredCakeVariants = this.filteredCakeVariants.filter(variant => variant._id !== variantId);
            this.cakeVariants = [...this.filteredCakeVariants]; // Force update
          } else {
            this.filteredDessertVariants = this.filteredDessertVariants.filter(variant => variant._id !== variantId);
            this.dessertVariants = [...this.filteredDessertVariants]; // Force update
          }

          console.log(`Deleted ${category} variant with ID: ${variantId}`);
        },
        (error) => {
          console.error(`Error deleting ${category} variant:`, error);
        }
      );
    }
  }


  deleteImage(imageId: string, category: string): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.imageservice.deleteImage(imageId).subscribe(
        () => {
          // Update the correct category after deletion
          switch (category) {
            case 'Whole Cake':
              this.filteredWholeCake = this.filteredWholeCake.filter(image => image._id !== imageId);
              break;
            case 'Bento Cake':
              this.filteredBentoCake = this.filteredBentoCake.filter(image => image._id !== imageId);
              break;
            case 'Donut':
              this.filteredDonuts = this.filteredDonuts.filter(image => image._id !== imageId);
              break;
            case 'Tiramisu':
              this.filteredTiramisu = this.filteredTiramisu.filter(image => image._id !== imageId);
              break;
            default:
              console.error('Unknown category:', category);
          }
          console.log(`Deleted ${category} image with ID: ${imageId}`);
        },
        (error) => {
          console.error(`Error deleting ${category} image:`, error);
        }
      );
    }
  }

  saveBiodata(field: string, value: string): void {
    const updatedData = { ...this.website, [field]: value };

    this.websiteservice.updateWebsiteData(updatedData).subscribe(
      (response) => {
        console.log('Website updated:', response);
        this.website = response; // Update local data
      },
      (error) => {
        console.error('Error updating website data:', error);
      }
    );
  }

  logout() {
    this.adminservice.logout();
    this.router.navigate(['/login-page']);
  }
}
