import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  //private baseUrl = 'http://localhost:5000'
  private baseUrl = 'https://kilokalori.vercel.app';

  constructor(private  http: HttpClient) {}
  
  getAllImages(): Observable<any> {
    const url = `${this.baseUrl}/images`;
    return this.http.get<any>(url);
  }
  
  getImageById(id: string): Observable<any> {
    const url = `${this.baseUrl}/images/${id}`;
    return this.http.get<any>(url);
  }
  
  createImage(file: File, category: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);

    return this.http.post<any>(`${this.baseUrl}/images`, formData);
  }
  
  deleteImage(id: string): Observable<any> {
    const url = `${this.baseUrl}/images/${id}`;
    return this.http.delete<any>(url);
  }
  
  getLatestThreeImages(): Observable<any> {
    const url = `${this.baseUrl}/latest`;
    return this.http.get<any>(url);
  }

  getAllWholeCake(): Observable<any> {
    const url = `${this.baseUrl}/images/latest/wholecake`;
    return this.http.get<any>(url);
  }

  getAllBentoCake(): Observable<any> {
    const url = `${this.baseUrl}/images/latest/bentocake`;
    return this.http.get<any>(url);
  }
  
  getAllDonut(): Observable<any> {
    const url = `${this.baseUrl}/images/latest/donut`;
    return this.http.get<any>(url);
  }
  getAllTiramisu(): Observable<any> {
    const url = `${this.baseUrl}/images/latest/tiramisu`;
    return this.http.get<any>(url);
  }  
}
