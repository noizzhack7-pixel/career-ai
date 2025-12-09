import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment configuration - can be moved to environment files later
const API_CONFIG = {
  baseUrl: 'http://localhost:8001',
  apiVersion: 'v1',
};

export interface RequestOptions {
  headers?: HttpHeaders | { [key: string]: string };
  params?: HttpParams | { [key: string]: string };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // Base API URL
  private readonly baseUrl = `${API_CONFIG.baseUrl}/api/${API_CONFIG.apiVersion}`;

  // =====================
  // URL Builders
  // =====================

  /**
   * Build full URL for an endpoint
   */
  private buildUrl(endpoint: string): string {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  // =====================
  // Generic HTTP Methods
  // =====================

  /**
   * GET request
   */
  get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), options);
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), body, options);
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), body, options);
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.patch<T>(this.buildUrl(endpoint), body, options);
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), options);
  }

  // =====================
  // Endpoint Constants
  // =====================

  static readonly ENDPOINTS = {
    // Employees
    EMPLOYEES: {
      BASE: 'employees',
      ME: 'employees/me',
      PROFILE: (id: string) => `employees/profile/${id}`,
      BY_ID: (id: string) => `employees/${id}`,
    },
    // Positions
    POSITIONS: {
      BASE: 'positions',
      MATCHING: 'positions/matching',
      MATCHING_BY_ID: (id: string) => `positions/matching/${id}`,
      BY_ID: (id: string) => `positions/${id}`,
    },
    // Assessment
    ASSESSMENT: {
      QUESTIONS: 'assessment/questions',
      QUESTIONS_TEST: 'assessment/questions/test',
      SUBMIT: 'assessment/submit',
      SUBMIT_TEST: 'assessment/submit/test',
      RESULTS: 'assessment/results',
    },
    // Skills
    SKILLS: {
      BASE: 'skills',
    },
  } as const;
}

