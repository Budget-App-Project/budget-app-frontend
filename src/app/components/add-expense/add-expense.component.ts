import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent {
  form: FormGroup;
  isNecessary = false;
  constructor(private expenseService: ExpenseService, private fb: FormBuilder) {
    this.form = this.fb.group({
      price: ['', Validators.required],
      whatFor: ['', Validators.required],
      whatTime: ['', Validators.required],
      necessary: [false, Validators.required],
    })
  }
  addExpense() {
    console.log("add expense function")
  }
}
