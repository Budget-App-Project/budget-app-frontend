import { Component, OnInit } from '@angular/core';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit{
  constructor(private expenseService: ExpenseService) {}
  ngOnInit(): void {
      // make call to the backend for unsorted and no parameters list of expenses except page 1 for pagination I thinking 15-20 expenses per page? will see.
      // need to create the call to the backend in the expense service and subscribe to it here
      const referenceDate = new Date();
      const referenceYear = referenceDate.getFullYear();
      const referenceMonth = referenceDate.getMonth();
      this.expenseService.getExpenses(0, new Date(referenceYear, referenceMonth, 0, 0, 0, 0, 0), new Date(referenceMonth == 11 ? referenceYear + 1 : referenceYear, referenceMonth === 11 ? 0 : referenceMonth + 1, 0, 0, 0, 0, 0)).subscribe((val) => console.log(val));
  }
  getExpenseList() {
      this.expenseService.getExpenses(0, new Date(2023, 3, 0), new Date(2023, 3, 28)).subscribe();
  }
}
