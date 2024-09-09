export const registerValidationMessages = {
    
    name: 'Name is required.',
    username: 'Username is required and must be unique.',
    email: 'Valid email is required.',
    password: 'Password is required.',
};

export const validateRegister = (field, value) => {

    switch (field) {
        case 'name':
        case 'username':
        case 'email':
        case 'password':
            return value.trim().length > 0;
        default:
            return true;
    }
};