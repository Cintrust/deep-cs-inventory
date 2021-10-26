import db from "../../db";
import {registerUser} from "../auth/authHelpers";
import {addItem, getItem} from "./itemHelpers";

describe("Adding Items:", function () {
    let token = "token"
    let password = "simple"
    let username = "trust"
    let item = "cake"
    beforeEach(async function () {
        this.timeout(5000)
        await db.query("truncate table `users` ")
        await db.query("truncate table `items` ")
        await registerUser({
            password: password,
            username: username,
            name: `${password} ${username}`
        }).expect(201)

        // let res = await loginUser({username, password}).expect(200)
        // token = res.body.auth;
        // runs once before the first test in this block
    });
    it("Should fail when invalid parameters are supplied", async function () {

        let date = new Date();
        // date.setMilliseconds(0);
        let expires = +date;
        // console.log({expires})
        //invalid Token
        // await addItem({item, token:"rubbish"}, {expiry: expires, quantity: -2}).expect(401)

        //nagetive values
        await addItem({item, token}, {expiry: -expires, quantity: -2}).expect(422)

        // overflows
        await addItem({item, token}, {
            expiry: Number.MAX_SAFE_INTEGER,
            quantity: Number.MAX_SAFE_INTEGER + 2000
        }).expect(422)

        //missing values
        await getItem({item: "fake", token}).expect(200, {quantity: 0, validTill: null})

    })
    it("Should pass when valid parameters are supplied", async function () {

        let date = new Date();
        // date.setMilliseconds(0);
        let expires = +date;
        await addItem({item, token}, {expiry: expires + 20000, quantity: 20}).expect(201, {})
        await addItem({item, token}, {expiry: expires + 10000, quantity: 10}).expect(201, {})
        await addItem({item, token}, {expiry: expires + 50000, quantity: 30}).expect(201, {})
        await getItem({item, token}).expect(200, {quantity: 60, validTill: expires + 10000})

    })


})
