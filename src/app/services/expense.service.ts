import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ExpenseService {
  constructor(private http: HttpClient) { }
  getExpenses() {
      return this.http.get<string>("/api/expenses");
  }
}
