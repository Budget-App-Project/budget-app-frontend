interface User {
    idToken: string;
    expiresIn: number;
}

interface SignUpUser extends User {
    userExists: boolean;
}

interface Expense {
    id: number;
    price: string;
    whatFor: string;
    whatTime: Object;
    necessary: boolean;
    user_id: number;
}

interface SuccessResponseModel {
    success: string;
}

export {User, SignUpUser, Expense, SuccessResponseModel}
