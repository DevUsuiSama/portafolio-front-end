import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from './baseurl';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  private baseUrl = BASE_URL;

  constructor(private http: HttpClient) { }

  getServer(url: string): Observable<any> {
    return this.http.get(this.baseUrl + `${url}`, {
      responseType: 'json',
    }); 
  }

  postServer(url: string, json: object): Observable<any> {
    return this.http.post(this.baseUrl + `${url}`, json, {
      responseType: 'json'
    });
  }

  putServer(url: string, json: object): Observable<any> {
    return this.http.put(this.baseUrl + `${url}`, json, {
      responseType: 'json',
    });
  }

  deleteServer(url: string): Observable<any> {
    return this.http.delete(this.baseUrl + `${url}`, {
      responseType: 'json',
    });
  }

  postServerParams(url: string, param: HttpParams): Observable<any> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    return this.http.post(this.baseUrl + `${url}`, {}, {
      headers: headers,
      params: param,
      responseType: 'json'
    });
  }
}
