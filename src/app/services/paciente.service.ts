import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PacienteDTO } from '../DTO/paciente.interface';
import { lastValueFrom } from 'rxjs';
import { API, PACIENTES } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private http: HttpClient) { }
   
     listarPacientes(): Promise<PacienteDTO[]> {
       return lastValueFrom(this.http.get<PacienteDTO[]>(`${API}/${PACIENTES}`));
     }
}
