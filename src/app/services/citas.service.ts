import { inject, Injectable } from '@angular/core';
import { AgendarCitaMedicaDTO } from '../DTO/CitaMedica.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { API, ENDPOINTS_CITAS, CITA_MEDICA } from '../utils/constants';
import { CitasAgendadasResponseDTO } from '../DTO/CitasAgendada.response.interface';

import { CitasReservadasPorPacienteResponseDTO } from '../DTO/CitasReservadasPorPaciente.interface';
import { RegistrarDisponibilidadCitaDTO } from '../DTO/RegistrarDisponibilidad.interface';
import { EstructuraDisponibilidadCitaResponse } from '../DTO/disponibilidadCitaResponse.interface'
import { DiaSemana } from '../interface/DiaSemana.interface';

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


  // 1. Listar citas agendadas por médico
  listarCitasAgendadas(idMedico: number): Promise<CitasAgendadasResponseDTO[]> {
    return lastValueFrom(this.http.get<CitasAgendadasResponseDTO[]>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.CITAS_AGENDADAS}/${idMedico}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ))
  }

  // 2. Registrar disponibilidad
  registrarDisponibilidad(req: RegistrarDisponibilidadCitaDTO): Promise<EstructuraDisponibilidadCitaResponse> {
    const url = `${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.REGISTRAR_DISPONIBILIDAD}`;
    return lastValueFrom(
      this.http.post<EstructuraDisponibilidadCitaResponse>(url, req).pipe(
        catchError(error => throwError(() => error))
      )
    );
  }

  // 4. Agendar cita
  agendarCita(req: AgendarCitaMedicaDTO): Promise<void> {
    return lastValueFrom(
      this.http.post<void>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.AGENDAR_CITA}`, req)
        .pipe(
          catchError(error => throwError(() => error))
        )
    );
  }

  // 10. Eliminar cita reservada desde perfil de paciente
  eliminarCitaReservado(idCita: number): Promise<void> {
    return lastValueFrom(
      this.http.delete<void>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.ELIMINAR_CITA_RESERVADO}/${idCita}`)
        .pipe(
          catchError(error => throwError(() => error))
        )
    );
  }

  // 11. Listar citas reservadas por paciente
  listarCitasReservadasPorPaciente(idPaciente: number): Promise<CitasReservadasPorPacienteResponseDTO[]> {
    return lastValueFrom(
      this.http.get<CitasReservadasPorPacienteResponseDTO[]>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.CITAS_RESERVADAS_POR_PACIENTE}/${idPaciente}`)
        .pipe(
          catchError(error => throwError(() => error))
        )
    );
  }


}
