import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userservice.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  message: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) => (this.message = `Error fetching users: ${err.error || err.message}`)
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: (response) => {
        this.message = 'User deleted successfully!';
        this.getUsers();
      },
      error: (err) => (this.message = `Error deleting user: ${err.error || err.message}`)
    });
  }

  updateUser(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: (response) => {
          this.message = 'User updated successfully!';
          this.getUsers();
        },
        error: (err) => (this.message = `Error updating user: ${err.error || err.message}`)
      });
    }
  }

  selectUser(user: User): void {
    this.selectedUser = { ...user };
  }
}
