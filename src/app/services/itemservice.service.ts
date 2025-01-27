import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Item } from '../models/item';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = `${environment.apiUrl}/Items`;

  constructor(private http: HttpClient) {}

  // Add a new item
  addItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item).pipe(
      catchError(this.handleError)
    );
  }

  // Get an item by ID
  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get an item by name
  getItemByName(itemName: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/getByName/${itemName}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get all items
  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing item
  updateItem(id: number, item: Item): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, item).pipe(
      catchError(this.handleError)
    );
  }

  // Delete an item by ID
  deleteItem(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error fetching data:', error);
    return throwError(() => new Error('Error fetching data. Please try again later.'));
  }
}
