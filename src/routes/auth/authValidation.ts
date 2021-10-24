import {checkSchema} from "express-validator";


export const registerUserValidation = checkSchema({
    "username": {
        in: ['body'],
        trim: true,
        isLength: {
            options: {min: 3, max: 30}
        }
    },
    name: {
        in: ['body'],
        trim: true,
        isLength: {
            options: {min: 3, max: 30}
        }
    },
    password: {
        in: ['body'],
        isLength: {
            options: {min: 6, max: 30}
        }
    }
});


export const loginUserValidation = checkSchema({
    "username": {
        in: ['body'],
        trim: true,
        isLength: {
            options: {min: 3, max: 30}
        }
    },
    password: {
        in: ['body'],
        isLength: {
            options: {min: 6, max: 30}
        }
    }
})
