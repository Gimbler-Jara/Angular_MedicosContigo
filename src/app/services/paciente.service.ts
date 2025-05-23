import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente, PacienteDTO } from '../DTO/paciente.DTO';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';
import { API, CITA_MEDICA, ENDPOINTS_CITAS, PACIENTES } from '../utils/constants_API';
import { PacienteActualizacionDTO } from '../DTO/PacienteActualizacion.DTO';
import { DetalleCitaAtendida, DetalleCitaAtendidaPorIdPacienteDTO } from '../DTO/DetalleCitaAtendida.DTO';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private http: HttpClient) { }

  listarPacientes(): Promise<PacienteDTO> {
    return lastValueFrom(this.http.get<PacienteDTO>(`${API}/${PACIENTES}`).pipe(
      catchError(error => throwError(() => error))
    ));
  }

  actualizarPaciente(idUsuario: number, paciente: PacienteActualizacionDTO): Promise<{ httpStatus: number; mensaje: string }> {
    return lastValueFrom(
      this.http.put<{ httpStatus: number; mensaje: string }>(`${API}/${PACIENTES}/${idUsuario}`, paciente).pipe(
        catchError(error => throwError(() => error))
      ) 
    );
  }

  verDetallesDeCitaAtendidaPorpaciente(idPaciente: number): Promise<DetalleCitaAtendidaPorIdPacienteDTO> {
    return lastValueFrom(this.http.get<DetalleCitaAtendidaPorIdPacienteDTO>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.HISTORIAL_PACIENTE}/${idPaciente}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ))
  }

}
