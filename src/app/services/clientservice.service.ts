import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Client } from '../models/client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/Clients`;

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getClientByName(clientName: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/getByName/${clientName}`).pipe(
      catchError(this.handleError)
    );
  }

  addClient(client: Client): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/add`, client, { responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }

  updateClient(id: number, client: Client): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}`, client, { responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }

  deleteClient(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error in ClientService:', error);
    return throwError(() => new Error('An error occurred. Please try again later.'));
  }
}
