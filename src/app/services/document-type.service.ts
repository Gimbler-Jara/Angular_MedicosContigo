import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Document_Type } from '../interface/DocumentType.interface';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { API, DOCUMENT_TYPE } from '../utils/constants_API';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  constructor(private http: HttpClient) { }

  listarTiposDeDocumentos(): Promise<Document_Type[]> {
    return lastValueFrom(this.http.get<Document_Type[]>(`${API}/${DOCUMENT_TYPE}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ));
  }
}
