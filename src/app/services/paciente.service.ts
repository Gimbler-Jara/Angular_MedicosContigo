import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PacienteDTO } from '../DTO/paciente.interface';
import { lastValueFrom, map } from 'rxjs';
import { API, MEDICOS, PACIENTES } from '../utils/constants';
import { MedicoDTO } from '../DTO/medico.interface';
import { PacienteActualizacionDTO } from '../DTO/PacienteActualizacion.interface';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private http: HttpClient) { }

  listarPacientes(): Promise<PacienteDTO[]> {
    return lastValueFrom(this.http.get<PacienteDTO[]>(`${API}/${PACIENTES}`));
  }

  eliminarPaciente(id: number): Promise<void> {
    return lastValueFrom(
      this.http.delete<{ success: boolean; message: string }>(`${API}/${PACIENTES}/${id}`).pipe(
        map(() => void 0)
      )
    );
  }

  actualizarPaciente(idUsuario: number, paciente: PacienteActualizacionDTO): Promise<{ success: boolean; message: string }> {
    return lastValueFrom(
      this.http.put<{ success: boolean; message: string }>(`${API}/${PACIENTES}/${idUsuario}`, paciente)
    );
  }
}
