import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  displayedColumns: string[] = ['purityPrice', 'actions']; // Define table columns

  constructor(
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

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
        this.snackBar.open('Failed to load settings.', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  /**
   * Update a setting.
   * @param setting The setting object to update.
   */
  updateSetting(setting: Settings): void {
    setting.purityPrice = parseFloat(setting.purityPrice.toFixed(2)); // Ensure 2 decimals
    this.settingsService.updateSetting(setting.id, setting).subscribe({
      next: () => {
        this.snackBar.open('Setting updated successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to update setting.', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
