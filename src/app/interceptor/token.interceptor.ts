import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const PUBLIC_ROUTES = [
  '/api/usuarios/login',
  '/api/usuarios/refresh',
  '/api/cita-medica/historial',
];

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

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
      // if ([401, 403].includes(err.status)) {
      //   console.warn('🔐 Sesión expirada. Redirigiendo al login...');
      //   localStorage.removeItem('token');
      //    window.location.href = '/login';
      // }
      return throwError(() => err);
    })
  );
};
