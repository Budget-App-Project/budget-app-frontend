import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from 'src/app/services/expense.service';
import { Expense, TotalSpendingByExpense } from 'definitions';
import { firstValueFrom } from 'rxjs';
import { ChartOptions } from 'chart.js';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit{
  // formGroup vairables
  form: FormGroup;
  expenseViewForm: FormGroup;
  editGroup: FormGroup;
  // reference variable
  referenceDate: Date = new Date();
  // modal and filter values
  selectedValue: string;
  showFilters: boolean = false;
  showModal: boolean = false;
  edit: boolean = false;
  originalStart: string;
  originalEnd: string;
  filters: string[] = [
    'Newest',
    'Oldest',
    'Price: High to Low',
    'Price: Low to High'
  ];
  loadChartTwo: boolean = true;
  // expense variables
  expenses: Expense[] = [];
  originalExpenses: Expense[] = [];
  // change these with information and expense changes as they will be used to load the chart data. Also only load the necessary vs unnecessary if includeUnnecessary is true.
  totalSpending: number = 0;
  totalSpendingByExpense: TotalSpendingByExpense = {};
  necessarySpending: number = 0;
  unnecessarySpending: number = 0;
  orderedExpenses: Array<Array<any>> = [];
  // pie chart variables
  //top three chart
  topThreeChartOptions: ChartOptions<'pie'> = {
    responsive: false,
    color: 'black',
    plugins: {
      title: {
        display: true,
        text: 'Top Expenses',
        color: 'black'
      }
    },
  };
  topThreeChartLabels = [ [''] ];
  topThreeChartDatasets = [ {
    data: [ 0, 0, 0, 0 ],
    backgroundColor: ['blue', 'purple', 'darkred', 'darkgray'],
  } ];
  // necessary vs unnecessary chart
  necVsUnnecChartOptions: ChartOptions<'pie'> = {
    responsive: false,
    color: 'black',
    plugins: {
      title: {
        display: true,
        text: 'Necessary Vs Unnecessary',
        color: 'black'
      }
    },
  };
  necVsUnnecChartLabels = [ ['Necessary'], ['Unnecessary'] ];
  necVsUnnecChartDatasets = [ {
    data: [ 0, 0 ],
    backgroundColor: ['#3a8940', '#c30900' ]
  } ];
  


  constructor(private expenseService: ExpenseService, private fb: FormBuilder) {
    this.form = this.fb.group({
      startDate: [new Date(this.referenceDate.getFullYear(), this.referenceDate.getMonth()), Validators.required],
      endDate: [new Date(this.referenceDate.getFullYear(), this.referenceDate.getMonth() + 1, 0, 23, 59, 59) , Validators.required],
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
    this.originalStart = this.form.value.startDate.valueOf();
    this.originalEnd = this.form.value.endDate.valueOf();
  }

  async ngOnInit(): Promise<void> {
      // make call to the backend for unsorted and no parameters list of expenses except page 1 for pagination I thinking 15-20 expenses per page? will see.
      // need to create the call to the backend in the expense service and subscribe to it here
      await this.setExpenses(new Date(this.referenceDate.getFullYear(), this.referenceDate.getMonth()), new Date(this.referenceDate.getFullYear(), this.referenceDate.getMonth() + 1, 0, 23, 59, 59));
      this.setChartValues();
  }

  async submitForm() {
    const {startDate, endDate, includeUnnecessary, minValue, maxValue, sortBy} = this.form.value;
    if (this.originalStart <= startDate.valueOf() && this.originalEnd >= endDate.valueOf()) {
      this.expenses = this.originalExpenses.filter((expense) => (new Date(expense.whatTime)).valueOf() >= startDate.valueOf() && (new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)).valueOf() >= (new Date(expense.whatTime)).valueOf());
      // the date range has either not changed or the start and end dates are within the original range, no need to query backend
    } else {
      // the date range has changed and either the start, end, or both are outside the original range, query the backend
      await this.setExpenses(startDate, new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59));
    }
    // filter according to the variables that were input
    if (!includeUnnecessary) {
      this.expenses = this.expenses.filter((expense) => expense.necessary);
      this.loadChartTwo = false;
    } else {
      this.loadChartTwo = true;
    }
    if (minValue) {
      this.expenses = this.expenses.filter((expense) => expense.price >= minValue);
    }
    if (maxValue) {
      this.expenses = this.expenses.filter((expense) => expense.price <= maxValue);
    }
    // sort by according to which item is selected
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
    this.setChartValues();
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
    if (this.expenseService.validateExpense(Number(price), whatFor, whatTime) && expenseId != null && typeof expenseId == 'number') {
      this.expenseService.updateExpense(Number(price), whatFor, whatTime, necessary, expenseId).subscribe(() => window.location.reload())
    } else {
      alert("Error validating fields, please try again later");
    }
  }

  deleteExpense() {
    this.expenseService.deleteExpense(this.expenseViewForm.value.expenseId).subscribe(() => window.location.reload())
  }

  async setExpenses(startDate: Date, endDate: Date) {
    this.originalExpenses = await firstValueFrom(this.expenseService.getExpenses(startDate, endDate));
      this.expenses = this.originalExpenses;
  }

  setChartValues() {
    this.totalSpending = 0;
    this.totalSpendingByExpense = {};
    this.necessarySpending = 0;
    this.orderedExpenses = [];
    this.topThreeChartLabels = [];
    this.topThreeChartDatasets = [ {
      data: [],
      backgroundColor: [],
    } ];
    this.expenses.reduce((acc, currVal) => {
      this.totalSpending += currVal.price;
      if (this.totalSpendingByExpense[currVal.whatFor.toLowerCase()] == undefined) {
       this.totalSpendingByExpense[currVal.whatFor.toLowerCase()] = currVal.price;
      } else {
       this.totalSpendingByExpense[currVal.whatFor.toLowerCase()] += currVal.price;
      }
      if (currVal.necessary) {
       this.necessarySpending += currVal.price;
      }
     return null;
   }, null)
   this.unnecessarySpending = this.totalSpending - this.necessarySpending;
   for (let expense in this.totalSpendingByExpense) {
     this.orderedExpenses.push([expense, this.totalSpendingByExpense[expense]])
   }
   this.orderedExpenses = this.orderedExpenses.sort((first, sec) => first[1] > sec[1] ? -1 : first[1] < sec[1] ? 1 : 0).slice(0, 3);
   this.orderedExpenses.forEach((expense, i) => {
    this.topThreeChartDatasets[0].backgroundColor.push(i == 3 ? "darkgray" : i == 2 ? "darkred" : i == 1 ? "purple" : "blue");
    if (i === 3) {
      this.topThreeChartLabels.push(['Other']);
      this.topThreeChartDatasets[0].data.push(this.totalSpending - this.orderedExpenses[0][1] - this.orderedExpenses[1][1] - this.orderedExpenses[2][1]);
      return;
    }
    this.topThreeChartLabels.push([expense[0][0].toUpperCase() + expense[0].slice(1)]);
    this.topThreeChartDatasets[0].data.push(expense[1]);
    console.log('going through');
   });
   this.necVsUnnecChartDatasets[0].data = [ this.necessarySpending, this.unnecessarySpending ];
  }

  downloadFile() {
    const { startDate, endDate, minValue, maxValue, sortBy, includeUnnecessary } = this.form.value;
    this.expenseService.downloadFile(startDate, endDate, minValue || 0, maxValue || -1, sortBy, includeUnnecessary).then(res => {
      const filename = `budget and expenses.csv`;
      let blob = new Blob([res],{type:'text/csv'});
      saveAs(blob, filename);
      },
      err => {
        alert("Error while downloading the file.");
      }
    );
    this.showFilters = false;
  }
}
