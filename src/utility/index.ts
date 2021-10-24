"use strict"

import mysql from 'mysql';
import {checkSchema, validationResult} from 'express-validator';
import type express from "express";


function sleep(ms: number) {

    return new Promise<number>((resolve, _reject) => {
        setTimeout(() => resolve(ms), ms)
    })
}

function validateParams<T extends object>(params: T) {

    for (const paramsKey in params) {

        if (params.hasOwnProperty(paramsKey) && params[paramsKey] === undefined) {
            throw new Error(`param "${paramsKey}" is required`);
        }
    }
    return params;
}

type CreatePool = {
    connectionLimit: number,
    host: string,
    user: string,
    password: string,
    database: string,
    port?: number
}


function createPool(option: CreatePool | string) {

    let config = option;

    if (typeof option !== "string") {
        const {
            connectionLimit,
            host,
            user,
            password,
            database,
            ...options
        } = option
        config = validateParams({connectionLimit, host, user, password, database, ...options});
    }


    const pool = mysql.createPool(config);
    pool.query('SELECT 1 + 1 AS solution', function (error, results, _fields) {
        if (error) {
            pool.end(function (errnoError) {
                console.trace(errnoError);
            });
            throw error;
        }
        // console.log('The solution is: ', results[0].solution);
    });

    return pool;
}


function validateRequest(...validations: ReturnType<typeof checkSchema>[]) {
    return async function (req: express.Request, res: express.Response, next: express.NextFunction) {

        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);

        if (errors.isEmpty()) {
            return next();
        }

        res.status(422).json({errors: errors.array()})
    }
}


export {createPool, validateParams, validateRequest, sleep}
