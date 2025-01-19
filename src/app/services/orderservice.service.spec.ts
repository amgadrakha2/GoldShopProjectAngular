import { TestBed } from '@angular/core/testing';

import { OrderService } from './orderservice.service';

describe('OrderserviceService', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
