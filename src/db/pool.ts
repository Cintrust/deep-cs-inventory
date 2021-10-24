import type mysql from "mysql";
import Query from "./query";
import Connection from "./connection";

class Pool extends Query {

    #pool: mysql.Pool
    #interval: NodeJS.Timer;

    constructor(pool: mysql.Pool) {
        super(pool);
        this.#pool = pool;
        this.#interval = setInterval(async () => {
            await this.query("delete from items where id in  (select id from items where expires_at < now()) ")
        }, 1000 * 3600)
    }

    getConnection() {
        return new Promise<Connection>((resolve, reject) => {

            this.#pool.getConnection((err, connection) => {

                if (err) {
                    return reject(err)
                }

                return resolve(new Connection(connection))
            })

        })
    };

    end() {
        return new Promise<true>((resolve, reject) => {
            clearInterval(this.#interval)
            this.#pool.end(function (errnoError) {
                if (errnoError) {
                    return reject(errnoError)
                } else {
                    resolve(true)
                }
            })
        })

    }


}

export default Pool
