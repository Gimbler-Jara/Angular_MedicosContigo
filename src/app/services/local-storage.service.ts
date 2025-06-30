import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsuarioStorage } from '../DTO/UsuarioStorage.DTO';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private router = inject(Router);

  private usuarioSubject = new BehaviorSubject<UsuarioStorage | null>(
    this.getUsuario()
  );

  usuario$ = this.usuarioSubject.asObservable();

  getUsuario(): UsuarioStorage | null {
    const usuarioStr = sessionStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  setUsuario(usuario: UsuarioStorage) {
    if (usuario) {
      var u: UsuarioStorage = {
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        middleName: usuario.middleName!,
        email: usuario.email!,
        telefono: usuario.telefono!,
      };

      sessionStorage.setItem('usuario', JSON.stringify(u));
      this.usuarioSubject.next(u);
    }
  }

  logOut() {
    sessionStorage.removeItem('usuario');
    localStorage.removeItem('token');

    this.usuarioSubject.next(null);

    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
