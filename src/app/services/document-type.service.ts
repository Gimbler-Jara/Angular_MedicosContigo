import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Document_Type, DocumentResponse } from '../interface/DocumentType.interface';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { API, DOCUMENT_TYPE } from '../utils/constants_API';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  constructor(private http: HttpClient) { }

  listarTiposDeDocumentos(): Promise<DocumentResponse> {
    return lastValueFrom(this.http.get<DocumentResponse>(`${API}/${DOCUMENT_TYPE}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    ));
  }
}
