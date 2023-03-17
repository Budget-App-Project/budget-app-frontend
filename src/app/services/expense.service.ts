import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense, SuccessResponseModel } from 'src/assets/definitions';

@Injectable()
export class ExpenseService {
  constructor(private http: HttpClient) { }

  getExpenses() {
      return this.http.get<Array<Expense>>("/api/expenses");
  }

  addExpense(price: string, whatFor: string, whatTime: Object, necessary: boolean) {
    return this.http.post<SuccessResponseModel>("/api/expenses/add", {price, whatFor, whatTime, necessary});
  }

  validateExpense(price: string, whatFor: string, whatTime: Object) {
    // if pass return true otherwise false
    if (price.length > 0 && whatFor.length > 0 && whatTime.toString().length > 0) {
      return true
    } else {
      return false;
    }
  }

}