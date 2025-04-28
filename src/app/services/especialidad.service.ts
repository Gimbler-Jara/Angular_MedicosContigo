import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Especialidad } from '../interface/Especialidad.interface';
import { lastValueFrom } from 'rxjs';
import { API, ENDPOINT_ESPECIALIDADES } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  constructor(private http: HttpClient) { }

  listarEspecialidades(): Promise<Especialidad[]> {
    return lastValueFrom(this.http.get<Especialidad[]>(`${API}/${ENDPOINT_ESPECIALIDADES.ESPECIALIDADES}`));
  }

  // obtenerPorId(id: number): Promise<Especialidad | null> {
  //   return lastValueFrom(this.http.get<Especialidad>(`${API}/${ENDPOINT_ESPECIALIDAD.ESPECIALIDAD}/${id}`));
  // }
}
