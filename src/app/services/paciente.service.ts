import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PacienteDTO } from '../DTO/paciente.interface';
import { lastValueFrom, map } from 'rxjs';
import { API, PACIENTES } from '../utils/constants';
import { PacienteActualizacionDTO } from '../DTO/PacienteActualizacion.interface';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private http: HttpClient) { }

  listarPacientes(): Promise<PacienteDTO[]> {
    return lastValueFrom(this.http.get<PacienteDTO[]>(`${API}/${PACIENTES}`));
  }

  actualizarPaciente(idUsuario: number, paciente: PacienteActualizacionDTO): Promise<{ success: boolean; message: string }> {
    return lastValueFrom(
      this.http.put<{ success: boolean; message: string }>(`${API}/${PACIENTES}/${idUsuario}`, paciente)
    );
  }
}
