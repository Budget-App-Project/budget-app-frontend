import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent {
  constructor(private expenseService: ExpenseService) {}
  getExpenseList() {
    console.log("clicked");
    this.expenseService.getExpenses().subscribe((val) => console.log(val));
  }
}
