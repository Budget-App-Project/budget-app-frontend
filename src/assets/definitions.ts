interface User {
    idToken: string;
    expiresIn: number;
}

interface SignUpUser extends User {
    userExists: boolean;
}

interface Expense {
    id: number;
    price: number;
    whatFor: string;
    whatTime: Date;
    necessary: boolean;
    userId: number;
}

interface SuccessResponseModel {
    success: string;
}

interface TotalSpendingByExpense {
    [index: string]: number;
  }
  
  interface FilterValues {
    totalSpending: number;
    totalSpendingByExpense: TotalSpendingByExpense;
    necessarySpending: number;
  }

export {User, SignUpUser, Expense, SuccessResponseModel, TotalSpendingByExpense, FilterValues}
