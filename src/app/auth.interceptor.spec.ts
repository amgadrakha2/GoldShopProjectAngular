import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthHttpInterceptor } from './auth.interceptor';

describe('AuthHttpInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthHttpInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should add Authorization header with token if token exists', () => {
    // Set a token in localStorage
    localStorage.setItem('authToken', 'fake-token');

    // Make an HTTP request
    httpClient.get('/test').subscribe();

    // Expect the request to have the Authorization header
    const req = httpTestingController.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');

    // Respond to the request
    req.flush({});
  });

  it('should not add Authorization header if token does not exist', () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken');

    // Make an HTTP request
    httpClient.get('/test').subscribe();

    // Expect the request to NOT have the Authorization header
    const req = httpTestingController.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalsy();

    // Respond to the request
    req.flush({});
  });
});
