import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, map, Observable } from 'rxjs';
import { ENVIRONMENT } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser') || '{}'));
  }

  login(credentials: object): Observable<any> {
    return this.http.post(ENVIRONMENT.urlRemote + 'api/auth/signin', credentials).pipe(map((data) => {
      sessionStorage.setItem('currentUser', JSON.stringify(data));
      this.currentUserSubject.next(data);
      return data;
    }));
  }

  delete() {
    this.currentUserSubject.next(EMPTY);
  }

  get authenticatedUser() {
    return this.currentUserSubject.value;
  }
}
