import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/orderservice.service';
import { ClientService } from '../../services/clientservice.service';
import { ItemService } from '../../services/itemservice.service';
import { Order } from '../../models/order';
import { Item } from '../../models/item';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit , OnDestroy {
  orderForm: FormGroup;
  allItems: Item[] = [];
  filteredItems: Item[][] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private clientService: ClientService,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,

  ) {

    this.orderForm = this.fb.group({
      client: this.fb.group({
        name: ['', Validators.required],
        address: [''],
        phoneNumber: [''],
        date: [new Date().toISOString().split('T')[0], Validators.required],
        time: [new Date().toISOString().split('T')[1].slice(0, 8), Validators.required],
      }),
      orderType: ['Standard', Validators.required],
      employeeName: ['', Validators.required],
      delay: [''],
      totalWeight: [0],
      totalPrice: [0],
      items: this.fb.array([])
    });


    this.fetchItems();
  }

  ngOnInit(): void {
    console.log(this.orderForm.value);
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      name: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0.01)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      purity: [0, [Validators.required, Validators.min(0.01)]],
      autoBarcode: ['']
    });

    this.items.push(itemGroup);
    this.filteredItems.push([...this.allItems]);

    this.subscribeToItemChanges(itemGroup);
  }

  subscribeToItemChanges(itemGroup: FormGroup): void {
    itemGroup.get('weight')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateTotals());
    itemGroup.get('price')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateTotals());
  }

  updateTotals(): void {
    const items = this.items.value as Item[];
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    this.orderForm.patchValue({
      totalWeight,
      totalPrice
    });
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.filteredItems.splice(index, 1);
    this.updateTotals();
  }

  fetchItems(): void {
    this.isLoading = true;
    this.itemService.getAllItems().pipe(takeUntil(this.destroy$)).subscribe(
      (items: Item[]) => {
        this.allItems = items;
        this.filteredItems = this.items.controls.map(() => [...items]);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching items:', error);
        this.isLoading = false;
      }
    );
  }

  filterItems(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement?.value || '';
    this.filteredItems[index] = this.allItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  onItemNameSelected(selectedName: string, index: number): void {
    const selectedItem = this.allItems.find(item => item.name === selectedName);
    if (selectedItem) {
      const itemFormGroup = this.items.at(index);
      if (itemFormGroup) {
        itemFormGroup.patchValue({
          weight: selectedItem.weight,
          price: selectedItem.price,
          purity: selectedItem.purity,
          autoBarcode: selectedItem.autoBarcode
        });
      }
    }
  }

  onClientNameBlur(): void {
    const clientName = this.orderForm.get('client.name')?.value;
    if (clientName) {
      this.clientService.getClientByName(clientName).pipe(takeUntil(this.destroy$)).subscribe(
        (client) => {
          if (client) {
            this.orderForm.patchValue({
              client: {
                address: client.address || '',
                phoneNumber: client.phoneNumber || '',
              }
            });
          }
        },
        (error) => {
          console.error('Error fetching client details:', error);
        }
      );
    }
  }

  resetForm(): void {
    this.orderForm.reset({
      client: {
        name: '',
        address: '',
        phoneNumber: ''
      },
      orderType: 'Standard',
      employeeName: '',
      delay: '',
      totalWeight: 0,
      totalPrice: 0,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toISOString().split('T')[1].slice(0, 8),
      items: []
    });

    this.items.clear();
    this.filteredItems = [];
    this.orderForm.markAsPristine();
    this.orderForm.markAsUntouched();
    this.orderForm.updateValueAndValidity();
  }

  onSubmit(): void {
    this.updateTotals();

    if (this.orderForm.invalid) {
      return;
    }

    const order: Order = this.orderForm.value;
    this.isLoading = true;

    this.orderService.createOrder(order).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        console.log('Order created successfully!', response);
        this.isLoading = false;

        // Show success snackbar
        this.snackBar.open('Order created successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.isLoading = false;

        // Show error snackbar
        this.snackBar.open('Failed to create order. Please try again.', 'Close', { duration: 3000 });
      },
      complete: () => {
        console.log('Order creation request completed.');
      }
    });
  }

  onNewOrder(): void {
    this.resetForm();
  }

}
