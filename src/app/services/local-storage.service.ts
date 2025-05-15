import { Injectable } from '@angular/core';
import { UsuarioResponse } from '../interface/Usuario/Usuario.interface';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { UsuarioStorage } from '../DTO/UsuarioStorage.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private usuarioSubject = new BehaviorSubject<UsuarioStorage | null>(this.getUsuario());

  usuario$ = this.usuarioSubject.asObservable();

  getUsuario(): UsuarioStorage | null {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  setUsuario(usuario: UsuarioStorage) {
    if (usuario) {
      var u: UsuarioStorage = {
        id: usuario.id,
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        middleName: usuario.middleName!,
        email: usuario.email!,
        telefono: usuario.telefono!
      }

      localStorage.setItem('usuario', JSON.stringify(u));
      this.usuarioSubject.next(u);
    }
  }

  logOut() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token')
    this.usuarioSubject.next(null);
  }

  // setToken(token: string) {
  //   localStorage.setItem('token', token);
  // }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
