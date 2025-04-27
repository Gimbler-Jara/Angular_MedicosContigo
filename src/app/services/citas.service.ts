import { inject, Injectable } from '@angular/core';
import { Especialidad } from '../interface/Especialidad.interface';
import { AgendarCitaMedicaDTO } from '../DTO/CitaMedica.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { API, CITAS_RESERVADAS_PORPACIENTE, DIAS_DISPONIBLES, ENDPOINTS_CITAS, ESPECIALIDAD_POR_ID_MEDICO, MEDICO_POR_ESPECIALIDAD, PROCEDIMIENTOS } from '../utils/constants';
import { CitasAgendadasResponseDTO } from '../DTO/CitasAgendada.response.interface';
import { MedicosPorEspecialidadDTO } from '../DTO/MedicosPorEspecialidad.interface';
import { DiasDisponiblesPorMedicoDTO } from '../DTO/DiasDisponiblesPorMedico.interface';
import { HorasDispiniblesDTO } from '../DTO/HorasDispinibles.interface';
import { CitasReservadasPorPacienteResponseDTO } from '../DTO/CitasReservadasPorPaciente.interface';
import { RegistrarDisponibilidadCitaDTO } from '../DTO/RegistrarDisponibilidad.interface';


export interface CambiarEstadoDisponibilidadRequest {
  idMedico: number;
  idDiaSemana: number;
  idHora: number;
  activo: boolean;
}

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
    6: '14:00',
    7: '15:00',
    8: '16:00'
  };

  getHoraById(id: number): string {
    return this.horasCatalogo[id] || 'Hora no encontrada';
  }


  // 1. Listar citas agendadas por médico
  listarCitasAgendadas(idMedico: number): Promise<CitasAgendadasResponseDTO[]> {
    return lastValueFrom(this.http.get<CitasAgendadasResponseDTO[]>(`${API}/${PROCEDIMIENTOS}/${ENDPOINTS_CITAS.CITAS_AGENDADAS}/${idMedico}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ))
  }

  // 2. Registrar disponibilidad
  registrarDisponibilidad(req: RegistrarDisponibilidadCitaDTO): Promise<void> {
    console.log(`${API}/${PROCEDIMIENTOS}/${ENDPOINTS_CITAS.REGISTRAR_DISPONIBILIDAD}`);
    return lastValueFrom(
     
      
      this.http.post<void>(`${API}/${PROCEDIMIENTOS}/${ENDPOINTS_CITAS.REGISTRAR_DISPONIBILIDAD}`, req)
        .pipe(
          catchError(error => throwError(() => error))
        )
    );
  }

  // 3. Cambiar estado de disponibilidad
  cambiarEstadoDisponibilidadMedico(req: CambiarEstadoDisponibilidadRequest): Promise<void> {
    return lastValueFrom(
      this.http.put<void>(`${API}/${ENDPOINTS_CITAS.CAMBIAR_ESTADO_DISPONIBILIDAd}`, req)
        .pipe(
          catchError(error => throwError(() => error))
        )
    );
  }

  // 4. Agendar cita
  agendarCita(req: AgendarCitaMedicaDTO): Promise<void> {
    return lastValueFrom(
      this.http.post<void>(`${API}/${PROCEDIMIENTOS}/${ENDPOINTS_CITAS.AGENDAR_CITA}`, req)
        .pipe(
          catchError(error => throwError(() => error))
        )
    );
  }

  // 5. Listar especialidades
  // listarEspecialidades(): Promise<Especialidad[]> {
  //   return lastValueFrom(
  //     this.http.get<Especialidad[]>(`${API}/especialidades`)
  //       .pipe(
  //         catchError(error => throwError(() => error))
  //       )
  //   );
  // }

  // 6. Listar médicos por especialidad
  listarMedicosPorEspecialidad(idEspecialidad: number): Promise<MedicosPorEspecialidadDTO[]> {
    return lastValueFrom(
      this.http.get<MedicosPorEspecialidadDTO[]>(`${API}/${PROCEDIMIENTOS}/${MEDICO_POR_ESPECIALIDAD}/${idEspecialidad}`)
        .pipe(
          catchError(error => throwError(() => error))
        )
    );
  }

  // 7. Listar días disponibles por médico
  listarDiasDisponibles(idMedico: number): Promise<DiasDisponiblesPorMedicoDTO[]> {
    return lastValueFrom(
      this.http.get<DiasDisponiblesPorMedicoDTO[]>(`${API}/${PROCEDIMIENTOS}/${DIAS_DISPONIBLES}/${idMedico}`)
        .pipe(
          catchError(error => throwError(() => error))
        )
    );
  }

  // 8. Listar horas disponibles (usa params)
  listarHorasDisponibles(idMedico: number, fecha: string): Promise<HorasDispiniblesDTO[]> {
    let params = new HttpParams()
      .set('idMedico', idMedico)
      .set('fecha', fecha);
    return lastValueFrom(
      this.http.get<HorasDispiniblesDTO[]>(`${API}/${PROCEDIMIENTOS}/${ENDPOINTS_CITAS.HORAS_DISPONIBLES}`, { params })
        .pipe(
          catchError(error => throwError(() => error))
        )
    );
  }

  // 9. Cambiar estado de cita a reservado (descomenta si lo usas)
  // cambiarEstadoCita(idCita: number): Promise<void> {
  //   let params = new HttpParams().set('idCita', idCita);
  //   return lastValueFrom(
  //     this.http.put<void>(`${this.apiUrl}/${ENDPOINTS_CITAS.CAMBIAR_ESTADO_CITA}`, null, { params })
  //       .pipe(
  //         catchError(error => throwError(() => error))
  //       )
  //   );
  // }

  // 10. Eliminar cita reservada (descomenta si lo usas)
  // eliminarCitaReservado(idCita: number): Promise<void> {
  //   return lastValueFrom(
  //     this.http.delete<void>(`${this.apiUrl}/${ENDPOINTS_CITAS.ELIMINAR_CITA}/${idCita}`)
  //       .pipe(
  //         catchError(error => throwError(() => error))
  //       )
  //   );
  // }

  // 11. Listar citas reservadas por paciente
  listarCitasReservadasPorPaciente(idPaciente: number): Promise<CitasReservadasPorPacienteResponseDTO[]> {
    return lastValueFrom(
      this.http.get<CitasReservadasPorPacienteResponseDTO[]>(`${API}/${PROCEDIMIENTOS}/${CITAS_RESERVADAS_PORPACIENTE}/${idPaciente}`)
        .pipe(
          catchError(error => throwError(() => error))
        )
    );
  }

  obtenerEspecialidadPorIdMedico(idMedico: number): Promise<Especialidad> {
    return lastValueFrom(
      this.http.get<Especialidad>(`${API}/${PROCEDIMIENTOS}/${ESPECIALIDAD_POR_ID_MEDICO}/${idMedico}`)
        .pipe(
          catchError(error => throwError(() => error))
        )
    );
  }
}
