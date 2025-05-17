import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');

    const isPublic = [
        '/api/usuarios/login',
        '/api/usuarios/refresh',
        '/api/cita-medica/historial/**',
    ].some(path => req.url.includes(path));

    const modifiedReq = (token && !isPublic)
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(modifiedReq).pipe(
        catchError((err) => {
            if (err.status === 401 || err.status === 403) {
                // console.warn('🔐 Sesión expirada. Redirigiendo al login...');
                // localStorage.removeItem('token');
                // window.location.href = '/login';
            }
            return throwError(() => err);
        })
    );
};
