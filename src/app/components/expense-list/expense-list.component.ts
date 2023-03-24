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
    this.expenseViewForm = this.fb.group({
      price: ['', Validators.required],
      whatFor: ['', Validators.required],
      whatTime: [new Date(), Validators.required],
      necessary: [true, Validators.required],
    })
    this.editGroup = this.expenseViewForm;
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
      this.expenseService.getExpenses(0, new Date(referenceYear, referenceMonth, 0, 0, 0, 0, 0), new Date(referenceMonth == 11 ? referenceYear + 1 : referenceYear, referenceMonth === 11 ? 0 : referenceMonth + 1, 0, 0, 0, 0, 0)).subscribe((val) => this.expenses = val);
  }

  getExpenseList() {
      this.expenseService.getExpenses(0, new Date(2023, 3, 0), new Date(2023, 3, 28)).subscribe();
  }

  submitForm() {
    if (this.originalStart == this.form.value.startDate && this.originalEnd == this.form.value.endDate) {
      console.log("same start and end")
      // the date range has changed, query the backend, but you can probably set it to only do that if one of the dates is outside of the original range.
    } else {
      // the date range has not changed, simply filter the results on the front end
      console.log("different start and end")
      this.originalStart = this.form.value.startDate;
      this.originalEnd = this.form.value.endDate;
    }
    this.showFilters = false;
  }

  triggerModal(expense: { price: number; whatFor: string; whatTime: Date; necessary: boolean; }) {
    this.expenseViewForm = this.fb.group({
      price: [expense.price.toFixed(2), Validators.required],
      whatFor: [expense.whatFor, Validators.required],
      whatTime: [new Date(expense.whatTime), Validators.required],
      necessary: [expense.necessary, Validators.required],
    })
    this.expenseViewForm.controls['price'].disable();
    this.expenseViewForm.controls['whatFor'].disable();
    this.expenseViewForm.controls['whatTime'].disable();
    this.expenseViewForm.controls['necessary'].disable();
    this.showModal = true;
  }

  editFields() {
    this.edit = true;
    this.editGroup.controls['price'].setValue(this.expenseViewForm.value.price);
    this.editGroup.controls['whatFor'].setValue(this.expenseViewForm.value.whatFor);
    this.editGroup.controls['whatTime'].setValue(this.expenseViewForm.value.whatTime);
    this.editGroup.controls['necessary'].setValue(this.expenseViewForm.value.necessary);
    this.expenseViewForm.controls['price'].enable();
    this.expenseViewForm.controls['whatFor'].enable();
    this.expenseViewForm.controls['whatTime'].enable();
    this.expenseViewForm.controls['necessary'].enable();
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

  }
}
