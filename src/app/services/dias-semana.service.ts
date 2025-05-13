import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { DiaSemana } from '../interface/DiaSemana.interface';
import { API, CITA_MEDICA, DIAS_SEMANA } from '../utils/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiasSemanaService {

  constructor(private http: HttpClient) { }

  listarDiasSemana(): Promise<DiaSemana[]> {
      return lastValueFrom(this.http.get<DiaSemana[]>(`${API}/${DIAS_SEMANA}`).pipe(
        catchError(error => {
          return throwError(() => error);
        })
      ))
    }
}
