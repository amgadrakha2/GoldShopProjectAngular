import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../../components/logoutdialogt/logout-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router, private dialog: MatDialog) {}

  confirmLogout(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent);

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed === true) {
        this.logout();
      }
    });
  }


  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']); 
  }
}
