import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UsuarioMedicoRequest, UsuarioPacienteRequest, UsuarioResponse } from '../interface/Usuario/Usuario.interface';
import { lastValueFrom, map, Observable } from 'rxjs';
import { API, USUARIO, MEDICOS, PACIENTES, ENDPOINTS_USUARIO } from '../utils/constants';
import { LoginDTO } from '../DTO/Login.interface';
import { LocalStorageService } from './local-storage.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)
  localStorageService = inject(LocalStorageService);

  logOut() {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  cambiarEstadoUsuario(id: number): Promise<{ success: boolean; message: string }> {
    var url = `${API}/${USUARIO}/${ENDPOINTS_USUARIO.CAMBIAR_ESTADO}/${id}`;

    return lastValueFrom(
      this.http.put<{ success: boolean; message: string }>(url, id)
    );
  }


  registrarPaciente(usuario: UsuarioPacienteRequest): Promise<UsuarioPacienteRequest> {
    return lastValueFrom(this.http.post<UsuarioPacienteRequest>(`${API}/${PACIENTES}`, usuario));
  }


  registrarMedico(usuario: UsuarioMedicoRequest): Promise<UsuarioMedicoRequest> {
    return lastValueFrom(this.http.post<UsuarioMedicoRequest>(`${API}/${MEDICOS}`, usuario));
  }

  async login(user: LoginDTO): Promise<UsuarioResponse> {
    return lastValueFrom(this.http.post<any>(`${API}/${USUARIO}/login`, user)).then(res => {
      localStorage.setItem('token', res.token);
      this.localStorageService.setUsuario(res.usuario);
      return res.usuario;
    });
  }


  renovarToken(): Observable<string> {
    return this.http.get<{ token: string }>(`${API}/usuarios/refresh`).pipe(
      map(res => res.token)
    );
  }



  getPerfilUsuario(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${API}/${USUARIO}/me`);
  }


  getToken() {
    return localStorage.getItem('token');
  }


  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp && decoded.exp > now;
    } catch (err) {
      console.error('Token inválido o corrupto', err);
      return false;
    }
  }


  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.rol || null;
    } catch {
      return null;
    }
  }

  getTiempoRestante(): number {
    const token = this.getToken();
    if (!token) return 0;

    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp - now;
  }

}
