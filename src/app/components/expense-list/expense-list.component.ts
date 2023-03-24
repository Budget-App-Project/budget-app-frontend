import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from 'src/app/services/expense.service';
import { Expense } from 'src/assets/definitions';
import { firstValueFrom } from 'rxjs';

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
  expenseViewForm: FormGroup;
  editGroup: FormGroup;
  referenceDate: Date = new Date();
  selectedValue: string;
  showFilters: boolean = false;
  showModal: boolean = false;
  edit: boolean = false;
  originalStart: Date;
  originalEnd: Date;
  filters: string[] = [
    'Newest',
    'Oldest',
    'Price: High to Low',
    'Price: Low to High'
  ];
  expenses: Expense[] = [];
  originalExpenses: Expense[] = [];

  constructor(private expenseService: ExpenseService, private fb: FormBuilder) {
    this.form = this.fb.group({
      startDate: [new Date(this.referenceDate.getFullYear(), this.referenceDate.getMonth()), Validators.required],
      endDate: [new Date(this.referenceDate.getFullYear(), this.referenceDate.getMonth() + 1, 0), Validators.required],
      includeUnnecessary: [true],
      minValue: [''],
      maxValue: [''],
      sortBy: ['']
    });
    this.expenseViewForm = this.fb.group({
      price: ['', Validators.required],
      whatFor: ['', Validators.required],
      whatTime: [new Date(), Validators.required],
      necessary: [true, Validators.required],
      expenseId: ['']
    })
    this.editGroup = this.fb.group({
      price: ['', Validators.required],
      whatFor: ['', Validators.required],
      whatTime: [new Date(), Validators.required],
      necessary: [true, Validators.required],
      expenseId: ['']
    })
    this.selectedValue = this.filters[0];
    this.originalStart = this.form.value.startDate;
    this.originalEnd = this.form.value.endDate;
  }

  ngOnInit(): void {
      // make call to the backend for unsorted and no parameters list of expenses except page 1 for pagination I thinking 15-20 expenses per page? will see.
      // need to create the call to the backend in the expense service and subscribe to it here
      const referenceDate = new Date();
      const referenceYear = referenceDate.getFullYear();
      const referenceMonth = referenceDate.getMonth();
      this.expenseService.getExpenses(0, new Date(referenceYear, referenceMonth), new Date(referenceYear, referenceMonth + 1, 0, 23, 59, 59)).subscribe((val) => { this.expenses = val; this.originalExpenses = val });
  }

  async submitForm() {
    const {startDate, endDate, includeUnnecessary, minValue, maxValue, sortBy} = this.form.value;
    if (this.originalStart.valueOf() <= startDate.valueOf() && this.originalEnd.valueOf() >= endDate.valueOf()) {
      this.expenses = this.originalExpenses.filter((expense) => (new Date(expense.whatTime)).valueOf() >= startDate.valueOf() && (new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)).valueOf() >= (new Date(expense.whatTime)).valueOf());
      // the date range has either not changed or the start and end dates are within the original range, no need to query backend
    } else {
      // the date range has changed and either the start, end, or both are outside the original range, query the backend
      this.originalExpenses = await firstValueFrom(this.expenseService.getExpenses(0, startDate, new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)));
      this.expenses = this.originalExpenses;
    }
    if (!includeUnnecessary) {
      this.expenses = this.expenses.filter((expense) => expense.necessary)
    }
    if (minValue) {
      this.expenses = this.expenses.filter((expense) => expense.price > minValue);
    }
    if (maxValue) {
      this.expenses = this.expenses.filter((expense) => expense.price < maxValue);
    }
    switch(sortBy) {
      case 'Newest':
        this.expenses.sort((exp1, exp2) => exp1.whatTime.valueOf() > exp2.whatTime.valueOf() ? -1 : exp1.whatTime.valueOf() < exp2.whatTime.valueOf() ? 1 : 0);
        break;
      case 'Oldest':
        this.expenses.sort((exp1, exp2) => exp1.whatTime.valueOf() > exp2.whatTime.valueOf() ? 1 : exp1.whatTime.valueOf() < exp2.whatTime.valueOf() ? -1 : 0);
        break;
      case 'Price: High to Low':
        this.expenses.sort((exp1, exp2) => exp1.price > exp2.price ? -1 : exp2.price > exp1.price ? 1 : 0);
        break;
      case 'Price: Low to High':
        this.expenses.sort((exp1, exp2) => exp1.price < exp2.price ? -1 : exp2.price < exp1.price ? 1 : 0);
        break;
    }
    this.showFilters = false;
  }

  triggerModal(expense: { price: number; whatFor: string; whatTime: Date; necessary: boolean; id: number }) {
    this.expenseViewForm = this.fb.group({
      price: [expense.price.toFixed(2), Validators.required],
      whatFor: [expense.whatFor, Validators.required],
      whatTime: [new Date(expense.whatTime), Validators.required],
      necessary: [expense.necessary, Validators.required],
      expenseId: [expense.id]
    })
    this.editGroup = this.fb.group({
      price: [expense.price.toFixed(2), Validators.required],
      whatFor: [expense.whatFor, Validators.required],
      whatTime: [new Date(expense.whatTime), Validators.required],
      necessary: [expense.necessary, Validators.required],
      expenseId: [expense.id]
    })
    this.expenseViewForm.controls['price'].disable();
    this.expenseViewForm.controls['whatFor'].disable();
    this.expenseViewForm.controls['whatTime'].disable();
    this.expenseViewForm.controls['necessary'].disable();
    this.showModal = true;
  }

  editFields() {
    console.log(this.editGroup.value.price);
    this.expenseViewForm.controls['price'].enable();
    this.expenseViewForm.controls['whatFor'].enable();
    this.expenseViewForm.controls['whatTime'].enable();
    this.expenseViewForm.controls['necessary'].enable();
    this.edit = true;
  }

  cancelEdit() {
    this.edit = false;
    this.expenseViewForm.controls['price'].setValue(this.editGroup.value.price);
    this.expenseViewForm.controls['whatFor'].setValue(this.editGroup.value.whatFor);
    this.expenseViewForm.controls['whatTime'].setValue(this.editGroup.value.whatTime);
    this.expenseViewForm.controls['necessary'].setValue(this.editGroup.value.necessary);
    this.expenseViewForm.controls['price'].disable();
    this.expenseViewForm.controls['whatFor'].disable();
    this.expenseViewForm.controls['whatTime'].disable();
    this.expenseViewForm.controls['necessary'].disable();
  }

  submitChanges() {
    const { price, whatTime, whatFor, necessary, expenseId } = this.expenseViewForm.value;
    console.log(typeof expenseId);
    if (this.expenseService.validateExpense(Number(price), whatFor, whatTime) && expenseId != null && typeof expenseId == 'number') {
      this.expenseService.updateExpense(Number(price), whatFor, whatTime, necessary, expenseId).subscribe(() => window.location.reload())
    } else {
      alert("Error validating fields, please try again later");
    }
  }
}
