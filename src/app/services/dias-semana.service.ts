import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import {  DiaSemanaResponse } from '../interface/DiaSemana.interface';
import { API,  DIAS_SEMANA } from '../utils/constants_API';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiasSemanaService {

  constructor(private http: HttpClient) { }

  listarDiasSemana(): Promise<DiaSemanaResponse> {
      return lastValueFrom(this.http.get<DiaSemanaResponse>(`${API}/${DIAS_SEMANA}`).pipe(
        catchError(error => {
          return throwError(() => error);
        })
      ))
    }
}
