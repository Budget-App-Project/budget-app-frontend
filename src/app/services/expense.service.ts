import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ExpenseService {
  constructor(private http: HttpClient) { }
  getExpenses() {
    return this.http.get<string>("/api/expenses");
  }
}
