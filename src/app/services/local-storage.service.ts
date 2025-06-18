import { Injectable } from '@angular/core';
import { UsuarioResponse } from '../interface/Usuario/Usuario.interface';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { UsuarioStorage } from '../DTO/UsuarioStorage.DTO';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
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
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
