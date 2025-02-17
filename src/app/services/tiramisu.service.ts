import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiramisuService {

  //private baseUrl = 'http://localhost:5000'
  private baseUrl = 'https://kilokalori.vercel.app/api';

  constructor(private  http: HttpClient) {}

  getAllTiramisu(): Observable<any> {
    const url = `${this.baseUrl}/tiramisu`;
    return this.http.get<any>(url);
  }
  
  getTiramisuById(id: string): Observable<any> {
    const url = `${this.baseUrl}/tiramisu/${id}`;
    return this.http.get<any>(url);
  }
  
  createTiramisu(tiramisuData: any): Observable<any> {
    const url = `${this.baseUrl}/tiramisu`;
    return this.http.post<any>(url, tiramisuData);
  }
  
  deleteTiramisu(id: string): Observable<any> {
    const url = `${this.baseUrl}/tiramisu/${id}`;
    return this.http.delete<any>(url);
  }
  
  getLatestThreeTiramisu(): Observable<any> {
    const url = `${this.baseUrl}/latest`;
    return this.http.get<any>(url);
  }
  
}
