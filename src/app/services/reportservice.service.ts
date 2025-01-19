import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report } from '../models/report';
import { Order } from '../models/order';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/Reports`;

  constructor(private http: HttpClient) {}

  // Get all reports
  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}`);
  }

  // Get reports by criteria
  getReportsByCriteria(startDate?: Date, endDate?: Date): Observable<Report[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());

    return this.http.get<Report[]>(`${this.apiUrl}/criteria`, { params });
  }

  // Get report by ID
  getReportById(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/${id}`);
  }

  // Get orders by report ID
  getOrdersByReportId(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/${id}/orders`);
  }

  // Search orders
  searchOrders(searchTerm?: string): Observable<Order[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('searchTerm', searchTerm);

    return this.http.get<Order[]>(`${this.apiUrl}/search`, { params });
  }


  // Add a new report
  addReport(report: Report): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}`, report);
  }

  // Update an existing report
  updateReport(id: number, report: Report): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}`, report);
  }

  // Delete a report by ID
  deleteReport(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
}
