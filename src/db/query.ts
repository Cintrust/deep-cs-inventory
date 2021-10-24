import type mysql from "mysql";


declare namespace Query {
    interface QueryResult {
        results: any,
        fields: mysql.FieldInfo[] | undefined
    }

    type QueryObject = mysql.Pool | mysql.PoolConnection

}

class Query {
    #db: Query.QueryObject

    constructor(db: Query.QueryObject) {
        this.#db = db

    }


    async query(query: string, values: any[] = []) {
        return new Promise<Query.QueryResult>((resolve, reject) => {
            return this.#db.query(query, values, function (error, results, fields) {
                if (error) {
                    return reject(error)
                } else {
                    resolve({results, fields})
                }
            })
        })

    }
}


export default Query
