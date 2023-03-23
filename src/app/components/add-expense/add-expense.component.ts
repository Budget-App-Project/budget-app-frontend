import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent {
  form: FormGroup;
  success = false;
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
    console.log(typeof price);
    if (this.expenseService.validateExpense(price, whatFor, whatTime)) {
      this.expenseService.addExpense(price, whatFor, whatTime, necessary).subscribe((val) => val.success ? this.success = true : alert("There was a problem processing your request"))
    } else {
      alert("Error validating fields, please try again later");
    }
  }
}
