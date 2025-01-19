import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Import throwError
import { Settings } from '../models/settings';
import { catchError, map } from 'rxjs/operators'; // Ensure map is also imported
import { environment } from '../..//environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/settings`;

  constructor(private http: HttpClient) {}

  /**
   * Get all settings.
   */
  getAllSettings(): Observable<Settings[]> {
    return this.http.get<Settings[]>(this.apiUrl);
  }

  /**
   * Get a setting by its ID.
   * @param id The ID of the setting.
   */
  getSettingById(id: number): Observable<Settings> {
    return this.http.get<Settings>(`${this.apiUrl}/${id}`);
  }

  /**
   * Generate a new setting.
   * @param setting The setting to be created.
   */
  generateSetting(setting: Settings): Observable<string> {
    return this.http.post<string>(this.apiUrl, setting);
  }

  /**
   * Update an existing setting.
   * @param id The ID of the setting to update.
   * @param setting The updated setting data.
   */
  updateSetting(id: number, setting: Settings): Observable<string> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, setting).pipe(
      map((response) => response.message), // Extract the "message" property
      catchError((error) => throwError(() => error)) // Handle errors
    );
  }

  /**
   * Delete a setting by its ID.
   * @param id The ID of the setting to delete.
   */
  deleteSetting(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
}
