import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  //private baseUrl = 'http://localhost:5000'
  private baseUrl = 'https://kilokalori.vercel.app/api';
  
  constructor(private  http: HttpClient) {}

  getWebsiteData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/website`);
  }

  // Update website data
  updateWebsiteData(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/website`, data);
  }
}
