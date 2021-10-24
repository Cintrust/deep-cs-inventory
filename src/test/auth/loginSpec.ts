import db from "../../db";
import {loginUser} from "./authHelpers";


describe("User Authentication:", function () {
    let username = 'trust2'
    let user_id = 1
    // let jwt_secret = process.env.JWT_SECRET || "jwt_secret"
    before(async function () {
        await db.query("truncate table `users` ")

        await db.query(`INSERT INTO users (id, name, username, password)
                        VALUES (${user_id}, 'simple trust', '${username}',
                                '$2b$10$.3/M9GQ3EfTzG9RfZjqsH.oUFkvC7cwJUtBPl69ScMBmyst/a6q56')`)

        // runs once before the first test in this block
    });
    it("Should pass when valid parameters are supplied", async function () {


        await loginUser({
            password: "simple",
            username: username,
        }).expect(200)

    })
    it("Should fail when invalid parameters are supplied", async function () {


        await loginUser({
            password: "simplew",//invalid password
            username: username,
        }).expect(401);
        await loginUser({
            password: "",//missing password
            username: "",//missing username
        }).expect(422);

        await loginUser({
            password: "simple",
            username: "weeeeeee", //invalid username
        }).expect(401)


    })
})


