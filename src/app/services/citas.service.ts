import { inject, Injectable } from '@angular/core';
import { AgendarCitaMedicaDTO } from '../DTO/CitaMedica.DTO';
import { HttpClient } from '@angular/common/http';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { API, ENDPOINTS_CITAS, CITA_MEDICA } from '../utils/constants_API';
import { CitasAgendadasResponse, CitasAgendadasResponseDTO } from '../DTO/CitasAgendada.response.DTO';

import { CitasReservadasPorPacienteResponse, CitasReservadasPorPacienteResponseDTO } from '../DTO/CitasReservadasPorPaciente.DTO';
import { RegistrarDisponibilidadCitaDTO } from '../DTO/RegistrarDisponibilidad.DTO';
import { EstructuraDisponibilidadCitaResponse } from '../DTO/disponibilidadCitaResponse.DTO'
import { DiagnosticoRequestDTO } from '../DTO/DiagnosticoRequest.DTO';
import { DetalleCitaAtendida, DetalleCitaAtendidaDTO } from '../DTO/DetalleCitaAtendida.DTO';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  http = inject(HttpClient);

  private horasCatalogo: { [id: number]: string } = {
    1: '08:00',
    2: '09:00',
    3: '10:00',
    4: '11:00',
    5: '12:00',
    6: '13:00',
    7: '14:00',
    8: '15:00',
    9: '16:00',
    10: '17:00',
    11: '18:00',
  };

  getHoraById(id: number): string {
    return this.horasCatalogo[id] || 'Hora no encontrada';
  }


  listarCitasAgendadas(idMedico: number): Promise<CitasAgendadasResponseDTO> {
    return lastValueFrom(this.http.get<CitasAgendadasResponseDTO>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.CITAS_AGENDADAS}/${idMedico}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ))
  }

  registrarDisponibilidad(req: RegistrarDisponibilidadCitaDTO): Promise<EstructuraDisponibilidadCitaResponse> {
    const url = `${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.REGISTRAR_DISPONIBILIDAD}`;
    return lastValueFrom(
      this.http.post<EstructuraDisponibilidadCitaResponse>(url, req).pipe(
        catchError(error => {
          return throwError(() => error);
        })
      )
    );
  }


  agendarCita(req: AgendarCitaMedicaDTO): Promise<any> {
    return lastValueFrom(
      this.http.post<any>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.AGENDAR_CITA}`, req).pipe(
        catchError(error => {
          return throwError(() => error);
        })
      )
    );
  }

  eliminarCitaReservado(idCita: number): Promise<any> {
    return lastValueFrom(
      this.http.delete<any>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.ELIMINAR_CITA_RESERVADO}/${idCita}`).pipe(
        catchError(error => {
          return throwError(() => error);
        })
      )
    );
  }

  listarCitasReservadasPorPaciente(idPaciente: number): Promise<CitasReservadasPorPacienteResponseDTO> {
    return lastValueFrom(
      this.http.get<CitasReservadasPorPacienteResponseDTO>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.CITAS_RESERVADAS_POR_PACIENTE}/${idPaciente}`).pipe(
        catchError(error => {
          return throwError(() => error);
        })
      )
    );
  }


  marcarcitaComoAtendido(idCita: number, request: DiagnosticoRequestDTO): Promise<any> {
    return lastValueFrom(
      this.http.post<any>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.CAMBIAR_ESTADO_CITA_RESERVADO_ATENDIDO}/${idCita}`, request).pipe(
        catchError(error => {
          return throwError(() => error);
        })
      )
    );
  }

  verDetallesDeCitaAtendida(idcita: number): Promise<DetalleCitaAtendidaDTO> {
    return lastValueFrom(this.http.get<DetalleCitaAtendidaDTO>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.HISTORIAL}/${idcita}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ))
  }

}
