import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) {}

  // Get an order by ID
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // Get all orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`);
  }

  // Get overdue orders
  getOverdueOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/overdue`);
  }

  // Create a new order
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}`, order);
  }

  // Update an existing order
  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
  }

  // Delete an order by ID
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
