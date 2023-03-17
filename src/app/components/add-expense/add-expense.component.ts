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
  isNecessary = true;
  constructor(private expenseService: ExpenseService, private fb: FormBuilder) {
    this.form = this.fb.group({
      price: ['', Validators.required],
      whatFor: ['', Validators.required],
      whatTime: [new Date(), Validators.required],
      necessary: [true, Validators.required],
    })
  }
  addExpense() {
    const {price, whatFor, whatTime, necessary} = this.form.value;
    if (this.expenseService.validateExpense(price.toString(), whatFor, whatTime)) {
      this.expenseService.addExpense(price.toString(), whatFor, whatTime, necessary).subscribe((val) => console.log(val))
    } else {
      alert("Error validating fields, please try again later");
    }
  }
}
