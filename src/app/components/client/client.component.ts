import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/clientservice.service'; // updated service name
import { Client } from '../../models/client'; // updated model

@Component({
  selector: 'app-client', // updated selector
  templateUrl: './client.component.html', // updated template
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit { // updated class name
  clients: Client[] = []; // updated array type
  searchName: string = '';
  errorMessage: string = '';
  addClientForm: FormGroup; // updated form group name
  editingClientId: number | null = null;
  editingClient: Partial<Client> = {}; // updated client type

  constructor(private clientService: ClientService, private fb: FormBuilder) { // updated service
    this.addClientForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required], // updated field
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // updated field
    });
  }

  ngOnInit(): void {
    this.getClients(); // fetch clients instead of items
  }

  // Fetch all clients
  getClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => (this.clients = data),
      error: (err) => {
        this.errorMessage = `Error fetching clients: ${err.message}`;
        console.error(err);
      },
    });
  }

  // Add a new client
  addClient(): void {
    const newClient: Client = this.addClientForm.value;
    this.clientService.addClient(newClient).subscribe({
      next: (addedClient) => {
        this.clients.push(addedClient);
        this.addClientForm.reset();
        alert('Client added successfully!');
      },
      error: (err) => {
        this.errorMessage = `Error adding client: ${err.message}`;
        console.error(err);
      },
    });
    this.resetClients();
  }

  // Search clients by name
  searchClient(): void {
    if (!this.searchName.trim()) {
      alert('Please enter a valid name to search!');
      return;
    }

    this.clientService.getClientByName(this.searchName).subscribe({
      next: (client) => {
        this.clients = [client]; // Replace the list with the found client
      },
      error: (err) => {
        this.errorMessage = `Error searching client: ${err.message}`;
        console.error(err);
        alert('No client found with the given name.');
      },
    });
  }

  // Reset clients to show all clients
  resetClients(): void {
    this.searchName = '';
    this.getClients();
  }

  // Start editing a client
  editClientStart(clientId: number): void {
    this.editingClientId = clientId;
    const client = this.clients.find((c) => c.id === clientId);
    if (client) {
      this.editingClient = { ...client }; // Clone the client for editing
    }
    this.resetClients();
  }

  // Save edited client
  saveClientEdit(): void {
    if (this.editingClientId !== null) {
      const updatedClient = this.editingClient as Client;
      this.clientService.updateClient(updatedClient.id, updatedClient).subscribe({
        next: () => {
          const index = this.clients.findIndex((client) => client.id === this.editingClientId);
          if (index !== -1) {
            this.clients[index] = updatedClient; // Update the local list
          }
          alert('Client updated successfully!');
          this.editingClientId = null;
          this.editingClient = {};
          this.resetClients(); // Reset search and fetch all items again

        } ,

        error: (err) => {
          this.errorMessage = `Error updating client: ${err.message}`;
          console.error(err);
        },
      });
    }
  }

  // Cancel editing
  cancelEdit(): void {
    this.editingClientId = null;
    this.editingClient = {};
  }

  // Delete a client
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
