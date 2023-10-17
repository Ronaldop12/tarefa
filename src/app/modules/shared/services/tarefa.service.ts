import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { URL_BACKEND } from '../../../config/config';

const base_url = `${URL_BACKEND}/api/tarefas`;

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  constructor(private http: HttpClient) { }

  getTarefas(): Observable<any> {
    return this.http.get(base_url)
      .pipe(
        catchError(this.handleError)
      );
  }

  saveTarefa(body: any): Observable<any> {
    return this.http.post(base_url, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateTarefa(body: any, id: number): Observable<any> {
    const endpoint = `${base_url}/${id}`;
    return this.http.put(endpoint, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTarefa(id: number): Observable<any> {
    const endpoint = `${base_url}/${id}`;
    return this.http.delete(endpoint)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTarefaById(id: number): Observable<any> {
    return this.http.get<any>(`${base_url}/${id}`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // Erros no lado do cliente
        errorMessage = `Erro: ${error.error.message}`;
    } else {
        // Erros no lado do servidor
        errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.error.message || 'Erro desconhecido'}`;
    }
    return throwError(errorMessage);
  }

  checkIfNameExists(nome: string, id?: number | null): Observable<any> {
    let endpoint = `${base_url}/check-name?nome=${nome}`;
    if (id !== undefined && id !== null) {
        endpoint += `&id=${id}`;
    }
    return this.http.get(endpoint)
      .pipe(
        catchError(this.handleError)
      );
  }

  buscarPorTermo(termo: string): Observable<any> {
    const url = `${base_url}/search?termo=${termo}`;
    return this.http.get<any>(url);
  }
}
