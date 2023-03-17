import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from 'src/assets/definitions';

@Injectable()
export class ExpenseService {
  constructor(private http: HttpClient) { }
  getExpenses() {
      return this.http.get<Array<Expense>>("/api/expenses");
  }
}
