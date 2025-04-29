import { Injectable } from '@angular/core';
import { UsuarioResponse } from '../interface/Usuario/Usuario.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private usuarioSubject = new BehaviorSubject<UsuarioResponse | null>(this.getUsuarioStorage());

  usuario$ = this.usuarioSubject.asObservable();

  constructor() { }


   getUsuarioStorage(): UsuarioResponse | null {
      const usuarioStr = localStorage.getItem('usuario');
      return usuarioStr ? JSON.parse(usuarioStr) : null;
    }
  
    setUsuario(usuario: UsuarioResponse | null) {
      if (usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
      } else {
        localStorage.removeItem('usuario');
      }
      this.usuarioSubject.next(usuario);
    }
  
}
