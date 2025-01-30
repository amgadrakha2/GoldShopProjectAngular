import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settingsservice.service';
import { Settings } from '../../models/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settings: Settings[] = [];
  isLoading = true;

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.getAllSettings();
  }

  /**
   * Fetch all settings from the API.
   */
  getAllSettings(): void {
    this.settingsService.getAllSettings().subscribe({
      next: (data) => {
        this.settings = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load settings.', error);
        this.isLoading = false;
      },
    });
  }

  /**
   * Handle input change for purity price.
   * @param event The input event.
   * @param index The index of the setting in the array.
   */
  onInputChange(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    const value = parseFloat(inputElement.value);
    this.settings[index].purityPrice = value;
  }

  /**
   * Update a setting.
   * @param setting The setting object to update.
   * @param index The index of the setting in the array.
   */
  updateSetting(setting: Settings, index: number): void {
    setting.purityPrice = parseFloat(setting.purityPrice.toFixed(2)); 
    this.settingsService.updateSetting(setting.id, setting).subscribe({
      next: () => {
        alert('Setting updated successfully!');
      },
      error: (error) => {
        console.error('Failed to update setting.', error);
        alert('Failed to update setting.');
      },
    });
  }
}
