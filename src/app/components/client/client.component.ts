import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/clientservice.service';
import { Client } from '../../models/client';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  clients: Client[] = [];
  searchName: string = '';
  errorMessage: string = '';
  addClientForm: FormGroup;
  editingClientId: number | null = null;
  editingClient: Partial<Client> = {};

  constructor(private clientService: ClientService, private fb: FormBuilder) {
    this.addClientForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  ngOnInit(): void {
    this.getClients();
  }

  getClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => (this.clients = data),
      error: (err) => {
        this.errorMessage = `Error fetching clients: ${err.message}`;
        console.error(err);
      },
    });
  }

  addClient(): void {
    const newClient: Client = this.addClientForm.value;
    this.clientService.addClient(newClient).subscribe({
      next: (response) => {
        alert(response);
        this.getClients();
        this.addClientForm.reset();
      },
      error: (err) => {
        this.errorMessage = `Error adding client: ${err.message}`;
        console.error(err);
      },
    });
  }

  searchClient(): void {
    if (!this.searchName.trim()) {
      alert('Please enter a valid name to search!');
      return;
    }

    this.clientService.getClientByName(this.searchName).subscribe({
      next: (client) => {
        this.clients = [client];
      },
      error: (err) => {
        this.errorMessage = `Error searching client: ${err.message}`;
        console.error(err);
        alert('No client found with the given name.');
      },
    });
  }

  resetClients(): void {
    this.searchName = '';
    this.getClients();
  }

  editClientStart(clientId: number): void {
    this.editingClientId = clientId;
    const client = this.clients.find((c) => c.id === clientId);
    if (client) {
      this.editingClient = { ...client };
    }
    this.resetClients();
  }

  saveClientEdit(): void {
    if (this.editingClientId !== null) {
      const updatedClient = this.editingClient as Client;
      this.clientService.updateClient(updatedClient.id, updatedClient).subscribe({
        next: () => {
          const index = this.clients.findIndex((client) => client.id === this.editingClientId);
          if (index !== -1) {
            this.clients[index] = updatedClient;
          }
          alert('Client updated successfully!');
          this.editingClientId = null;
          this.editingClient = {};
          this.resetClients();
        },
        error: (err) => {
          this.errorMessage = `Error updating client: ${err.message}`;
          console.error(err);
        },
      });
    }
  }

  cancelEdit(): void {
    this.editingClientId = null;
    this.editingClient = {};
  }

  deleteClient(clientId: number): void {
    this.clientService.deleteClient(clientId).subscribe({
      next: () => {
        this.clients = this.clients.filter((client) => client.id !== clientId);
        alert('Client deleted successfully!');
      },
      error: (err) => {
        this.errorMessage = `Error deleting client: ${err.message}`;
        console.error(err);
      },
    });
    this.resetClients();
  }
}
