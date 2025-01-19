import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/Clients`;

  constructor(private http: HttpClient) {}

  // Get all clients
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}`);
  }

  // Get client by ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  // Get client by name
  getClientByName(clientName: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/getByName/${clientName}`);
  }

  // Add a new client
  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/add`, client);
  }

  // Update an existing client
  updateClient(id: number, client: Client): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, client, { responseType: 'text' });
}


  // Delete a client by ID
  deleteClient(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
}
