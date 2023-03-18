import { Component, OnInit } from '@angular/core';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit{
  referenceDate = new Date();
  referenceYear = this.referenceDate.getFullYear();
  referenceMonth = this.referenceDate.getMonth();
  constructor(private expenseService: ExpenseService) {}
  ngOnInit(): void {
      // make call to the backend for unsorted and no parameters list of expenses except page 1 for pagination I thinking 15-20 expenses per page? will see.
      // need to create the call to the backend in the expense service and subscribe to it here
      console.log(this.referenceYear);
      console.log(this.referenceMonth);
  }
  getExpenseList() {
      this.expenseService.getExpenses().subscribe();
  }
}
