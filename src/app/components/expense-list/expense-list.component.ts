import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from 'src/app/services/expense.service';
import { Expense } from 'src/assets/definitions';

interface Filters {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit{
  form: FormGroup;
  referenceDate: Date = new Date();
  selectedValue: string;
  showFilters: boolean = false;
  filters: string[] = [
    'Price',
    'Date'
  ];
  expenses: Expense[] = [];

  constructor(private expenseService: ExpenseService, private fb: FormBuilder) {
    this.form = this.fb.group({
      price: ['', Validators.required],
      whatFor: ['', Validators.required],
      startDate: [new Date(this.referenceDate.getFullYear(), this.referenceDate.getMonth()), Validators.required],
      endDate: [new Date(this.referenceDate.getFullYear(), this.referenceDate.getMonth() + 1, 0), Validators.required],
      necessary: [true, Validators.required],
    });
    this.selectedValue = this.filters[0];
  }

  ngOnInit(): void {
      // make call to the backend for unsorted and no parameters list of expenses except page 1 for pagination I thinking 15-20 expenses per page? will see.
      // need to create the call to the backend in the expense service and subscribe to it here
      const referenceDate = new Date();
      const referenceYear = referenceDate.getFullYear();
      const referenceMonth = referenceDate.getMonth();
      this.expenseService.getExpenses(0, new Date(referenceYear, referenceMonth, 0, 0, 0, 0, 0), new Date(referenceMonth == 11 ? referenceYear + 1 : referenceYear, referenceMonth === 11 ? 0 : referenceMonth + 1, 0, 0, 0, 0, 0)).subscribe((val) => this.expenses = val);
  }

  getExpenseList() {
      this.expenseService.getExpenses(0, new Date(2023, 3, 0), new Date(2023, 3, 28)).subscribe();
  }

  submitForm() {
    console.log(this.expenses);
    this.showFilters = false;
  }
}
