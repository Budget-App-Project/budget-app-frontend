interface User {
    idToken: string;
    expiresIn: number;
}

interface SignUpUser extends User {
    userExists: boolean;
}

export {User, SignUpUser}
