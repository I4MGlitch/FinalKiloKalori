import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WholecakeService {

  //private baseUrl = 'http://localhost:5000'
  private baseUrl = 'https://kilokalori.vercel.app';

  constructor(private  http: HttpClient) {}

  getAllWholeCakes(): Observable<any> {
    const url = `${this.baseUrl}/wholecake`;
    return this.http.get<any>(url);
  }
  
  getWholeCakeById(id: string): Observable<any> {
    const url = `${this.baseUrl}/wholecake/${id}`;
    return this.http.get<any>(url);
  }
  
  createWholeCake(wholeCakeData: any): Observable<any> {
    const url = `${this.baseUrl}/wholecake`;
    return this.http.post<any>(url, wholeCakeData);
  }
  
  deleteWholeCake(id: string): Observable<any> {
    const url = `${this.baseUrl}/wholecake/${id}`;
    return this.http.delete<any>(url);
  }
  
  getLatestThreeWholeCakes(): Observable<any> {
    const url = `${this.baseUrl}/latest`;
    return this.http.get<any>(url);
  }
  
}
