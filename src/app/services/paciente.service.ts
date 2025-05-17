import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PacienteDTO } from '../DTO/paciente.DTO';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';
import { API, CITA_MEDICA, ENDPOINTS_CITAS, PACIENTES } from '../utils/constants_API';
import { PacienteActualizacionDTO } from '../DTO/PacienteActualizacion.DTO';
import { DetalleCitaAtendidaDTO } from '../DTO/DetalleCitaAtendida.DTO';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private http: HttpClient) { }

  listarPacientes(): Promise<PacienteDTO[]> {
    return lastValueFrom(this.http.get<PacienteDTO[]>(`${API}/${PACIENTES}`).pipe(
      catchError(error => throwError(() => error))
    ));
  }

  actualizarPaciente(idUsuario: number, paciente: PacienteActualizacionDTO): Promise<{ success: boolean; message: string }> {
    return lastValueFrom(
      this.http.put<{ success: boolean; message: string }>(`${API}/${PACIENTES}/${idUsuario}`, paciente).pipe(
        catchError(error => throwError(() => error))
      )
    );
  }

  verDetallesDeCitaAtendidaPorpaciente(idPaciente: number): Promise<DetalleCitaAtendidaDTO[]> {
    return lastValueFrom(this.http.get<DetalleCitaAtendidaDTO[]>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.HISTORIAL_PACIENTE}/${idPaciente}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ))
  }

}
