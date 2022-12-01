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
export class AuthHandlerInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let accessToken = this.authService.getUserToken();
    if (!accessToken) {
      console.log('auth Interceptor');
      if (this.router.url.includes('mvitals')) {
        this.router.navigateByUrl('/mvitals/login');
      }else {
        this.router.navigateByUrl('/login');
      }
    } else {
      // console.log('auth Interceptor token exists', request);
      if(request?.url.includes("api.ezecheck.in")) {
        console.log("skip token send")
        return next.handle(request);
      }else {
        let tokenizerReq = request.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return next.handle(tokenizerReq);
      }
    }
    return next.handle(request);
  }
}
