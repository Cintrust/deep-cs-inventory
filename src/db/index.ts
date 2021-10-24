import {createPool} from "../utility";
import Pool from "./pool";
import type mysql from "mysql";


let pool = createPool(process.env.JAWSDB_MARIA_URL || {
    connectionLimit: 5,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "deep-consultation"
});


pool.on('connection', function (connection: mysql.PoolConnection) {
    connection.query('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED'/*,function (err,res,field) {
    }*/)
});

export default new Pool(pool)
