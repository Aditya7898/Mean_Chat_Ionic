import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TokenProvider } from './token/token';
import { Storage } from '@ionic/storage';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class TokenIntercepter implements HttpInterceptor {
  constructor(private storage: Storage, private tokenProvider: TokenProvider) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return fromPromise(this.tokenProvider.GetToken()).pipe(
      switchMap(token => {
        console.log(token);
        const headersConfig = {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        };
        if (token) {
          headersConfig['Authorization'] = `beader ${token}`;
        }
        const _req = req.clone({ setHeaders: headersConfig });
        return next.handle(_req);
      })
    );
  }
}
