import {checkSchema} from "express-validator";

export const addItemValidation = checkSchema({
    item:{
        in:["params"],
        trim: true,
        isLength: {
            options: {min: 3, max: 30}
        }
    },
    quantity:{
        in:["body"],
        isInt:{
            bail:true,
            options:{
                min:0,
                max:Number.MAX_SAFE_INTEGER
            }
        }
    },
    expiry:{
        in:["body"],
        isInt:{
            bail:true,
            options:{
                min:0,
                max:8640000000000000
            }
        },
    }
})
export const sellItemValidation = checkSchema({
    item:{
        in:["params"],
        trim: true,
        isLength: {
            options: {min: 3, max: 30}
        }
    },
    quantity:{
        in:["body"],
        isInt:{
            bail:true,
            options:{
                min:0,
                max:Number.MAX_SAFE_INTEGER
            }
        }
    },

})
export const getItemValidation = checkSchema({
    item:{
        in:["params"],
        trim: true,
        isLength: {
            options: {min: 3, max: 30}
        }
    },

})
