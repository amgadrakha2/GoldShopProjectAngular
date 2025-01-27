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
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-add-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit , OnDestroy {
  orderForm: FormGroup;
  allEmployees: any[] = [];
  allItems: Item[] = [];
  filteredItems: Item[][] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();
  private timeInterval: any;

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
        date: [this.getCurrentDate(), Validators.required],
        time: [this.getCurrentTimeWithOffset(), Validators.required],
      }),
      orderType: ['Standard', Validators.required],
      employeeName: ['', Validators.required],
      delay: [''],
      totalWeight: [0],
      totalPrice: [0],
      items: this.fb.array([], this.minLengthArray(1)) // Custom validator to ensure at least one item
    });

    this.fetchEmployeeNames();
    this.fetchItems();
  }

  ngOnInit(): void {
    // Start interval to update the time every second
    this.timeInterval = setInterval(() => {
      this.orderForm.get('client.time')?.setValue(this.getCurrentTimeWithOffset());
    }, 1000);
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clear interval to avoid memory leaks
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  fetchEmployeeNames(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        // Extract unique employee names from orders
        const names = orders.map(order => order.employeeName);
        this.allEmployees = Array.from(new Set(names)); // Remove duplicates
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }
  minLengthArray(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const array = control as FormArray;
      return array.length >= min ? null : { minLength: true };
    };
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getCurrentTimeWithOffset(): string {
    const now = new Date();
    now.setHours(now.getHours()); // Add 3 hours to current time
    return now.toTimeString().split(' ')[0]; // Return HH:mm:ss
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
    this.itemService.getAllItems().pipe(takeUntil(this.destroy$)).subscribe({
      next: (items: Item[]) => {
        this.allItems = items;
        this.filteredItems = this.items.controls.map(() => [...items]);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching items:', error);
        this.isLoading = false;
      },
    });
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
    // Clear the items FormArray
    while (this.items.length !== 0) {
      this.items.removeAt(0);
    }

    // Reset the form values
    this.orderForm.reset({
      client: {
        name: '',
        address: '',
        phoneNumber: '',
        date: this.getCurrentDate(), // Reset date to current date
        time: this.getCurrentTimeWithOffset() // Reset time to current time
      },
      orderType: '',
      employeeName: '',
      delay: '',
      totalWeight: 0,
      totalPrice: 0,
      items: []
    });

    // Clear the filteredItems array
    this.filteredItems = [];

    // Mark the form as pristine and untouched
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
