import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private authentication: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var currentUser = this.authentication.authenticatedUser;
    if (currentUser && currentUser.token) {
      req = req.clone({
        setHeaders: {
          Authorization: `${currentUser.type} ${currentUser.token}}`
        }
      });
    }
    return next.handle(req);
  }
}
