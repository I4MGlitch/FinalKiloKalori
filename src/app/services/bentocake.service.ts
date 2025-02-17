import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BentocakeService {

  private baseUrl = 'https://kilokalori.vercel.app';
  //private baseUrl = 'http://localhost:5000'
  
  constructor(private  http: HttpClient) {}

  getAllBentoCakes(): Observable<any> {
    const url = `${this.baseUrl}/bentocakes`;
    return this.http.get<any>(url);
  }
  
  getBentoCakeById(id: string): Observable<any> {
    const url = `${this.baseUrl}/bentocakes/${id}`;
    return this.http.get<any>(url);
  }
  
  createBentoCake(bentoCakeData: any): Observable<any> {
    const url = `${this.baseUrl}/bentocakes`;
    return this.http.post<any>(url, bentoCakeData);
  }
  
  deleteBentoCake(id: string): Observable<any> {
    const url = `${this.baseUrl}/bentocakes/${id}`;
    return this.http.delete<any>(url);
  }
  
  getLatestThreeBentoCakes(): Observable<any> {
    const url = `${this.baseUrl}/latest`;
    return this.http.get<any>(url);
  }
}
