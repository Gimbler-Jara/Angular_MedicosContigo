import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UsuarioRequest, UsuarioResponse } from '../interface/Usuario/Usuario.interface';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { API, ENDPOINTS_CITAS } from '../utils/constants';
import { LoginDTO } from '../DTO/Login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)

  private usuarioSubject = new BehaviorSubject<UsuarioResponse | null>(this.getUsuarioStorage());

  usuario$ = this.usuarioSubject.asObservable();

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

  logOut() {
    this.setUsuario(null);
  }

  // listarUsuarios(): Promise<Usuario[]> {
  //   return lastValueFrom(this.http.get<Usuario[]>(API));
  // }

  // obtenerUsuarioPorId(id: number): Promise<Usuario | null> {
  //   return lastValueFrom(this.http.get<Usuario>(`${API}/${id}`));
  // }

  agregarUsuario(usuario: UsuarioRequest): Promise<UsuarioRequest> {
    return lastValueFrom(this.http.post<UsuarioRequest>(`${API}/${ENDPOINTS_CITAS.USUARIO}`, usuario));
  }

  // actualizarUsuario(id: number, usuario: Usuario): Promise<Usuario> {
  //   return lastValueFrom(this.http.put<Usuario>(`${API}/${id}`, usuario));
  // }

  // eliminarUsuario(id: number): Promise<void> {
  //   return lastValueFrom(this.http.delete<void>(`${API}/${id}`));
  // }

  login(user: LoginDTO): Promise<UsuarioResponse> {
    return lastValueFrom(this.http.post<UsuarioResponse>(`${API}/${ENDPOINTS_CITAS.USUARIO}/login`, user));
  }

}
