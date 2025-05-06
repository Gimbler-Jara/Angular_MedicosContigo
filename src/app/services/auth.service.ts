import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UsuarioMedicoRequest, UsuarioPacienteRequest, UsuarioResponse } from '../interface/Usuario/Usuario.interface';
import { lastValueFrom } from 'rxjs';
import { API, USUARIO, MEDICOS, PACIENTES, ENDPOINTS_USUARIO } from '../utils/constants';
import { LoginDTO } from '../DTO/Login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)

  logOut() {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  cambiarEstadoUsuario(id: number): Promise<{ success: boolean; message: string }> {
    var url = `${API}/${USUARIO}/${ENDPOINTS_USUARIO.CAMBIAR_ESTADO}/${id}`;
    console.log(url);

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

  login(user: LoginDTO): Promise<UsuarioResponse> {
    return lastValueFrom(this.http.post<UsuarioResponse>(`${API}/${USUARIO}/login`, user));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('usuario');
  }

}
