import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense, SuccessResponseModel } from 'src/assets/definitions';

@Injectable()
export class ExpenseService {
  constructor(private http: HttpClient) { }

  getExpenses(page: number, startDate: Date, endDate: Date) {
      return this.http.get<Array<Expense>>("/api/expenses", {
        params: {
          page,
          startDate: startDate.valueOf(),
          endDate: endDate.valueOf()
        }
      });
  }

  addExpense(price: number, whatFor: string, whatTime: Date, necessary: boolean) {
    return this.http.post<SuccessResponseModel>("/api/expenses/add", { price, whatFor, whatTime, necessary });
  }

  validateExpense(price: number, whatFor: string, whatTime: Date) {
    // if pass return true otherwise false
    if (typeof price == 'number' && whatFor.length > 0 && whatTime.toString().length > 0) {
      return true
    } else {
      return false;
    }
  }

  updateExpense(price: number, whatFor: string, whatTime: Date, necessary: boolean, expenseId: number) {
    return this.http.put<SuccessResponseModel>('api/expenses/update', { price, whatFor, whatTime, necessary, expenseId })
  }

  deleteExpense(expenseId: number) {
    return this.http.delete<SuccessResponseModel>('/api/expenses/delete', {
      params: {
        expenseId
      }
    })
  }

}
