import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { catchError, throwError, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/Users`;

  constructor(private http: HttpClient) {}

  /**
   * Register a new user.
   * @param user The user to register.
   * @returns An Observable containing the registration status.
   */
  // Updated register method with headers
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }


  /**
   * Login a user and get a JWT token.
   * @param userName The username of the user.
   * @param password The password of the user.
   * @returns An Observable containing the JWT token.
   */
  login(userName: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { userName, password });
  }

  /**
   * Get all users.
   * @returns An Observable containing the list of all users.
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Get a user by ID.
   * @param id The ID of the user.
   * @returns An Observable containing the user data.
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update a user.
   * @param id The ID of the user to update.
   * @param user The updated user data.
   * @returns An Observable containing the update status.
   */
  updateUser(id: number, user: User): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}`, user);
  }

  /**
   * Delete a user.
   * @param id The ID of the user to delete.
   * @returns An Observable containing the delete status.
   */
  deleteUser(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
}
