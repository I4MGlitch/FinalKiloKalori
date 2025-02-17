import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonutService {

  //private baseUrl = 'http://localhost:5000'
  private baseUrl = 'https://kilokalori.vercel.app/api';

  constructor(private  http: HttpClient) {}

  getAllDonuts(): Observable<any> {
    const url = `${this.baseUrl}/donuts`;
    return this.http.get<any>(url);
  }
  
  getDonutById(id: string): Observable<any> {
    const url = `${this.baseUrl}donuts/${id}`;
    return this.http.get<any>(url);
  }
  
  createDonut(donutData: any): Observable<any> {
    const url = `${this.baseUrl}/donuts`;
    return this.http.post<any>(url, donutData);
  }
  
  deleteDonut(id: string): Observable<any> {
    const url = `${this.baseUrl}/donuts/${id}`;
    return this.http.delete<any>(url);
  }
  
  getLatestThreeDonuts(): Observable<any> {
    const url = `${this.baseUrl}/latest`;
    return this.http.get<any>(url);
  }
  
}
