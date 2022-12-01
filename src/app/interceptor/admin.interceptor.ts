import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AdminInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let accessToken = this.authService.getUserToken();
    if (!accessToken) {
      console.log('admin Interceptor');
      if (this.router.url.includes('admin')) {
        this.router.navigateByUrl('/admin/login');
      }
    } else {
      let tokenizerReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return next.handle(tokenizerReq);
    }
    return next.handle(request);
  }
}
