import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../services/itemservice.service';
import { Item } from '../../models/item';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  items: Item[] = [];
  searchName: string = '';
  errorMessage: string = '';
  addItemForm: FormGroup;
  editingItemId: number | null = null;
  editingItem: Partial<Item> = {};

  constructor(private itemService: ItemService, private fb: FormBuilder) {
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      purity: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      autoBarcode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getItems();
  }

  // Fetch all items
  getItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (data) => (this.items = data),
      error: (err) => {
        this.errorMessage = `Error fetching items: ${err.message}`;
        console.error(err);
      },
    });
  }

  // Add a new item
  addItem(): void {
    const newItem: Item = this.addItemForm.value;
    this.itemService.addItem(newItem).subscribe({
      next: (addedItem) => {
        this.items.push(addedItem);
        this.addItemForm.reset();
        alert('Item added successfully!');
      },
      error: (err) => {
        this.errorMessage = `Error adding item: ${err.message}`;
        console.error(err);
      },
    });
  }

  // Search items by name
  searchItem(): void {
    if (!this.searchName.trim()) {
      alert('Please enter a valid name to search!');
      return;
    }

    this.itemService.getItemByName(this.searchName).subscribe({
      next: (item) => {
        this.items = [item]; // Replace the list with the found item
      },
      error: (err) => {
        this.errorMessage = `Error searching item: ${err.message}`;
        console.error(err);
        alert('No item found with the given name.');
      },
    });
  }

  // Reset items to show all items
  resetItems(): void {
    this.searchName = '';
    this.getItems(); // Fetch all items again
  }

  // Start editing an item
  editItemStart(itemId: number): void {
    this.editingItemId = itemId;
    const item = this.items.find((i) => i.id === itemId);
    if (item) {
      this.editingItem = { ...item }; // Clone the item for editing
    }
  }

  saveItemEdit(): void {
    if (this.editingItemId !== null) {
      const updatedItem = this.editingItem as Item;
      this.itemService.updateItem(updatedItem.id, updatedItem).subscribe({
        next: () => {
          const index = this.items.findIndex((item) => item.id === this.editingItemId);
          if (index !== -1) {
            this.items[index] = updatedItem; // Update the local list
          }
          alert('Item updated successfully!');
          this.editingItemId = null;
          this.editingItem = {};

          // Call resetItems() after the item is saved
          this.resetItems(); // Reset search and fetch all items again
        },
        error: (err) => {
          this.errorMessage = `Error updating item: ${err.message}`;
          console.error(err);
        },
      });
    }
  }


  // Cancel editing
  cancelEdit(): void {
    this.editingItemId = null;
    this.editingItem = {};
  }

  // Delete an item
  deleteItem(itemId: number): void {
    this.itemService.deleteItem(itemId).subscribe({
      next: () => {
        this.items = this.items.filter((item) => item.id !== itemId);
        alert('Item deleted successfully!');
      },
      error: (err) => {
        this.errorMessage = `Error deleting item: ${err.message}`;
        console.error(err);
      },
    });
  }
}
