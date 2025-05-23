import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PerfilResponse, UsiarioPacienteResponse,  UsuarioPacienteRequest } from '../interface/Usuario/Usuario.interface';
import { catchError, lastValueFrom, map, Observable, throwError } from 'rxjs';
import { API, USUARIO, MEDICOS, PACIENTES, ENDPOINTS_USUARIO } from '../utils/constants_API';
import { LoginDTO } from '../DTO/Login.interface.DTO';
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

  cambiarEstadoUsuario(id: number): Promise<{ httpStatus: number; mensaje: string }> {
    var url = `${API}/${USUARIO}/${ENDPOINTS_USUARIO.CAMBIAR_ESTADO}/${id}`;

    return lastValueFrom(this.http.put<{ httpStatus: number; mensaje: string }>(url, id).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    )
    );
  }


  registrarPaciente(usuario: UsuarioPacienteRequest): Promise<UsiarioPacienteResponse> {
    return lastValueFrom(this.http.post<UsiarioPacienteResponse>(`${API}/${PACIENTES}`, usuario).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ));
  }


  // registrarMedico(usuario: UsuarioMedicoRequest): Promise<UsuarioMedicoRequest> {
  //   return lastValueFrom(this.http.post<UsuarioMedicoRequest>(`${API}/${MEDICOS}`, usuario));
  // }

  registrarMedico(formData: FormData): Promise<any> {
    return lastValueFrom(this.http.post(`${API}/${MEDICOS}`, formData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    )
    );
  }


  async login(user: LoginDTO): Promise<PerfilResponse> {
    return lastValueFrom(this.http.post<any>(`${API}/${USUARIO}/login`, user)).then(res => {
      localStorage.setItem('token', res.token);
      this.localStorageService.setUsuario(res.usuario);
      return res;
    });
  }


  renovarToken(): Observable<string> {
    return this.http.get<{ token: string }>(`${API}/usuarios/refresh`).pipe(
      map(res => res.token)
    );
  }



  getPerfilUsuario(): Observable<PerfilResponse> {
    return this.http.get<PerfilResponse>(`${API}/${USUARIO}/me`);
  }

  getUserById(id: number): Promise<PerfilResponse> {
    return lastValueFrom(this.http.get<PerfilResponse>(`${API}/${USUARIO}/${id}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ));
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
