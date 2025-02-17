import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  //private baseUrl = 'http://localhost:5000'
  private baseUrl = 'http://kilokalori.vercel.app';

  constructor(private  http: HttpClient) {}

  getAllArticles(): Observable<any> {
    const url = `${this.baseUrl}/articles`;
    return this.http.get<any>(url);
  }

  getEveryArticles(): Observable<any> {
    const url = `${this.baseUrl}/articles/all`;
    return this.http.get<any>(url);
  }
  
  getArticleById(id: string): Observable<any> {
    const url = `${this.baseUrl}/articles/${id}`;
    return this.http.get<any>(url);
  }
  
  createArticle(articleData: any): Observable<any> {
    const url = `${this.baseUrl}/articles`;
    return this.http.post<any>(url, articleData);
  }
  
  deleteArticle(id: string): Observable<any> {
    const url = `${this.baseUrl}/articles/${id}`;
    return this.http.delete<any>(url);
  }
  
  getLatestThreeArticles(): Observable<any> {
    const url = `${this.baseUrl}/articles/latest`;
    return this.http.get<any>(url);
  }
  
  getArticles(page: number, pageSize: number = 6): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/articles?page=${page}&pageSize=${pageSize}`);
  }
}
