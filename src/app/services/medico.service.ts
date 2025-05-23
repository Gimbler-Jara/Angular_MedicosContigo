import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';
import { API, ENDPOINTS_CITAS, MEDICOS, CITA_MEDICA, ENDPOINTS_MEDICO } from '../utils/constants_API';
import { MedicoDTO, MedicoPorIdResponse, MedicoResponse } from '../DTO/medico.DTO';
import { DisponibilidadesResponse } from '../DTO/DisponibilidadesCitasResponse.DTO';
import { CambiarEstadoDisponibilidadDTO } from '../DTO/CambiarEstadoDisponibilidad.DTO';
import { MedicosPorEspecialidad, MedicosPorEspecialidadDTO } from '../DTO/MedicosPorEspecialidad.DTO';
import { HorasDispinibles, HorasDispiniblesDTO } from '../DTO/HorasDispinibles.DTO';
import { DiaSemana, DiaSemanaResponse } from '../interface/DiaSemana.interface';
import { Especialidad, EspecialidadPorMedicoResponse } from '../interface/Especialidad.interface';
import { MedicoActualizacionDTO } from '../DTO/MedicoActualizacion.DTO';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

  listarMedicos(): Promise<MedicoResponse> {
    return lastValueFrom(this.http.get<MedicoResponse>(`${API}/${MEDICOS}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ));
  }

  obtenerMedico(idMedico: number): Promise<MedicoPorIdResponse> {
    return lastValueFrom(this.http.get<MedicoPorIdResponse>(`${API}/${MEDICOS}/${idMedico}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ));
  }

  listarHorariosDeTrabajoPorMedico(idMedico: number): Promise<DisponibilidadesResponse> {
    return lastValueFrom(this.http.get<DisponibilidadesResponse>(`${API}/${MEDICOS}/${ENDPOINTS_MEDICO.HORARIO_TRABAJO_MEDICO}/${idMedico}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ));
  }


  cambiarEstadoCita(data: CambiarEstadoDisponibilidadDTO): Promise<any> {
    return lastValueFrom(
      this.http.put<any>(`${API}/${CITA_MEDICA}/${ENDPOINTS_CITAS.CAMBIAR_ESTADO_DISPONIBILIDAD}`, data)
        .pipe(
          catchError(error => {
            return throwError(() => error);
          })
        )
    );
  }


  // actualizarMedico(idUsuario: number, medico: MedicoActualizacionDTO): Promise<{ success: boolean; message: string }> {
  //   return lastValueFrom(
  //     this.http.put<{ success: boolean; message: string }>(`${API}/${MEDICOS}/${idUsuario}`, medico)
  //   );
  // }

  actualizarMedicoConArchivo(id: number, medico: MedicoActualizacionDTO, archivo?: File): Promise<{ httpStatus: number; mensaje: string }> {
    const formData = new FormData();
    formData.append('datos', JSON.stringify(medico));

    if (archivo) {
      formData.append('archivoFirmaDigital', archivo);
    }

    return lastValueFrom(
      this.http.put<{ httpStatus: number; mensaje: string }>(`${API}/${MEDICOS}/${id}`, formData).pipe(
        catchError(error => {
          return throwError(() => error);
        })
      )
    );
  }


  listarMedicosPorEspecialidad(idEspecialidad: number): Promise<MedicosPorEspecialidad> {
    return lastValueFrom(
      this.http.get<MedicosPorEspecialidad>(`${API}/${MEDICOS}/${ENDPOINTS_MEDICO.MEDICOS_POR_ESPECIALIDAD}/${idEspecialidad}`)
        .pipe(
          catchError(error => {
            return throwError(() => error);
          })
        )
    );
  }

  listarDiasDisponibles(idMedico: number): Promise<DiaSemanaResponse> {
    return lastValueFrom(
      this.http.get<DiaSemanaResponse>(`${API}/${MEDICOS}/${ENDPOINTS_MEDICO.DIAS_DISPONIBLES}/${idMedico}`)
        .pipe(
          catchError(error => {
            return throwError(() => error);
          })
        )
    );
  }

  listarHorasDisponibles(idMedico: number, fecha: string): Promise<HorasDispiniblesDTO> {
    let params = new HttpParams()
      .set('idMedico', idMedico)
      .set('fecha', fecha);
    return lastValueFrom(
      this.http.get<HorasDispiniblesDTO>(`${API}/${MEDICOS}/${ENDPOINTS_MEDICO.HORAS_DISPONIBLES}`, { params })
        .pipe(
          catchError(error => {
            return throwError(() => error);
          })
        )
    );
  }

  obtenerEspecialidadPorIdMedico(idMedico: number): Promise<EspecialidadPorMedicoResponse> {
    return lastValueFrom(
      this.http.get<EspecialidadPorMedicoResponse>(`${API}/${MEDICOS}/${ENDPOINTS_MEDICO.ESPECIALIDAD_POR_ID_MEDICO}/${idMedico}`)
        .pipe(
          catchError(error => {
            return throwError(() => error);
          })
        )
    );
  }

  obtenerUrlFirmaDigital(path: string): Promise<any> {
    let params = new HttpParams().set('path', path)
    return lastValueFrom(this.http.get<any>(`${API}/${MEDICOS}/${ENDPOINTS_MEDICO.OBTENER_FIRMA}`, {
      params,
      responseType: 'text' as 'json'
    })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      )
    );
  }

}
