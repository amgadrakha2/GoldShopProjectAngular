import { TestBed } from '@angular/core/testing';

import { ReportService } from './reportservice.service';

describe('ReportserviceService', () => {
  let service: ReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
