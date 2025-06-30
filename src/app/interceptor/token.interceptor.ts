import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';

const PUBLIC_ROUTES = [
  '/api/usuarios/login',
  '/api/usuarios/refresh',
  '/api/cita-medica/historial',
];

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getToken();

  let requestPath = req.url;
  try {
    requestPath = new URL(req.url).pathname;
  } catch {
    requestPath = req.url.split('?')[0];
  }

  const isPublic = PUBLIC_ROUTES.includes(requestPath);

  const modifiedReq =
    token && !isPublic
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(modifiedReq).pipe(
    catchError((err) => {
      if ([401, 403].includes(err.status)) {
        const currentPath = window.location.pathname;

        if (currentPath !== '/login') {
          localStorageService.logOut();
          console.log('🔐 Token expirado o no autorizado. Redirigiendo al login...');
        } 
      }
      return throwError(() => err);
    })
  );
};
