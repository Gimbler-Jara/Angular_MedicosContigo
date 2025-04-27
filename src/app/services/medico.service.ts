import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { API, MEDICOS } from '../utils/constants';
import { MedicoDTO } from '../DTO/medico.interface';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

 constructor(private http: HttpClient) { }
 
   listarMedicos(): Promise<MedicoDTO[]> {
     return lastValueFrom(this.http.get<MedicoDTO[]>(`${API}/${MEDICOS}`));
   }


}
