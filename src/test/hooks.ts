import db from "../db";

exports.mochaHooks = {

   async afterAll() {
        // do something before every test
        await db.end();

    }
};
