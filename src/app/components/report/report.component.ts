  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup } from '@angular/forms';
  import { ReportService } from '../../services/reportservice.service';

  import { Report } from '../../models/report';
  import { Order } from '../../models/order';

  @Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
  })
  export class ReportComponent implements OnInit {
    reports: Report[] = [];
    orders: Order[] = [];
    searchForm: FormGroup;
    isLoading = false;
    isError = false;

    constructor(private reportService: ReportService, private fb: FormBuilder) {
      this.searchForm = this.fb.group({
        searchTerm: ['']
      });
    }

    ngOnInit(): void {
      this.fetchAllReports();
    }

    fetchAllReports(): void {
      this.isLoading = true;
      this.isError = false;
      this.reportService.getAllReports().subscribe({
        next: (data) => {
          this.reports = data;
          this.orders = data.map(report => report.orderData).flat();
          this.orders = this.orders.map(order => ({
            ...order,
            time: undefined
          }));
          console.log('Orders:', this.orders);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching reports:', error);
          this.isError = true;
          this.isLoading = false;
        }
      });
    }


    searchOrders(): void {
      const searchTerm = this.searchForm.value.searchTerm;
      if (!searchTerm) {
        this.fetchAllReports();
        return;
      }

      this.isLoading = true;
      this.isError = false;

      this.reportService.searchOrders(searchTerm).subscribe({
        next: (data) => {
          if (!data || data.length === 0) {
            this.isError = true;
            this.isLoading = false;
            return;
          }
          this.orders = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching orders:', error);
          this.isError = true;
          this.isLoading = false;
        },
      });
    }

    restartOrders(): void {
      this.searchForm.reset();
      this.fetchAllReports();
    }
  }
