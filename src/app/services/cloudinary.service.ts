// cloudinary.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dtebpcvwf/image/upload';
  private uploadPreset = 'Orders';  

  constructor(private http: HttpClient) {}

  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post(this.cloudinaryUrl, formData);
  }
}
