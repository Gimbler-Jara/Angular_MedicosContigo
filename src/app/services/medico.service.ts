import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { API, ENDPOINTS_CITAS, MEDICOS, CITA_MEDICA, ENDPOINTS_MEDICO } from '../utils/constants';
import { MedicoDTO } from '../DTO/medico.interface';
import { DisponibilidadesResponse } from '../DTO/DisponibilidadesCitasResponse.interface';
import { CambiarEstadoDisponibilidadDTO } from '../DTO/CambiarEstadoDisponibilidad.interface';
import { MedicosPorEspecialidadDTO } from '../DTO/MedicosPorEspecialidad.interface';
import { HorasDispiniblesDTO } from '../DTO/HorasDispinibles.interface';
import { DiaSemana } from '../interface/DiaSemana.interface';
import { Especialidad } from '../interface/Especialidad.interface';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

  listarMedicos(): Promise<MedicoDTO[]> {
    return lastValueFrom(this.http.get<MedicoDTO[]>(`${API}/${MEDICOS}`));
  }

  listarPorMedico(idMedico: number): Promise<DisponibilidadesResponse> {
    return lastValueFrom(this.http.get<DisponibilidadesResponse>(`${API}/${MEDICOS}/${ENDPOINTS_MEDICO.HORARIO_TRABAJO_MEDICO}/${idMedico}`));
  }


  cambiarEstadoCita(data: CambiarEstadoDisponibilidadDTO): Promise<void> {
    return lastValueFrom(
      this.http.put<void>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.CAMBIAR_ESTADO_DISPONIBILIDAD}`, data)
        .pipe(
          catchError(error => throwError(() => error))
        )
    );
  }


   // 6. Listar médicos por especialidad
    listarMedicosPorEspecialidad(idEspecialidad: number): Promise<MedicosPorEspecialidadDTO[]> {
      return lastValueFrom(
        this.http.get<MedicosPorEspecialidadDTO[]>(`${API}/${MEDICOS}/${ENDPOINTS_MEDICO.MEDICOS_POR_ESPECIALIDAD}/${idEspecialidad}`)
          .pipe(
            catchError(error => throwError(() => error))
          )
      );
    }
  
    // 7. Listar días disponibles por médico
    listarDiasDisponibles(idMedico: number): Promise<DiaSemana[]> {
      return lastValueFrom(
        this.http.get<DiaSemana[]>(`${API}/${MEDICOS}/${ENDPOINTS_MEDICO.DIAS_DISPONIBLES}/${idMedico}`)
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
        this.http.get<HorasDispiniblesDTO[]>(`${API}/${MEDICOS}/${ENDPOINTS_MEDICO.HORAS_DISPONIBLES}`, { params })
          .pipe(
            catchError(error => throwError(() => error))
          )
      );
    }

    obtenerEspecialidadPorIdMedico(idMedico: number): Promise<Especialidad> {
      return lastValueFrom(
        this.http.get<Especialidad>(`${API}/${MEDICOS}/${ENDPOINTS_MEDICO.ESPECIALIDAD_POR_ID_MEDICO}/${idMedico}`)
          .pipe(
            catchError(error => throwError(() => error))
          )
      );
    }
  
}
