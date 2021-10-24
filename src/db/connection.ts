import type {PoolConnection} from "mysql";
import Query from "./query";


class Connection extends Query {

    #connection: PoolConnection

    constructor(connection: PoolConnection) {
        super(connection);
        this.#connection = connection
    }

    async beginTransaction() {

        return new Promise<true>((resolve, reject) => {
            this.#connection.beginTransaction(err => {
                if (err) {
                    return reject(err)
                }
                return resolve(true)
            })
        })
    }

    async rollback() {
        return new Promise<true>((resolve, reject) => {
            this.#connection.rollback(err => {
                if (err) {
                    return reject(err)
                }
                return resolve(true)
            })
        })
    }

    async commit() {
        return new Promise<true>((resolve, reject) => {
            this.#connection.commit(err => {
                if (err) {
                    return reject(err)
                }
                return resolve(true)
            })
        })
    }

    release(){
        this.#connection.release();
    }
}

export default Connection
