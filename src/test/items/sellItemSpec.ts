import db from "../../db";
import {registerUser} from "../auth/authHelpers";
import {addItem, getItem, sellItem} from "./itemHelpers";

describe("Selling Items:", function () {
    let token = "token"
    let password = "simple"
    let username = "trust"
    let item = "cake"
    let date = new Date();
    // date.setMilliseconds(0);
    let expires = +date + 2000000;
    before(async function () {
        this.timeout(5000)

        await db.query("truncate table `users` ")
        await registerUser({
            password: password,
            username: username,
            name: `${password} ${username}`
        }).expect(201)

        // let res = await loginUser({username, password}).expect(200)
        // token = res.body.auth;

    })

    beforeEach(async function () {
        this.timeout(5000)

        await db.query("truncate table `items` ")

        // runs once before the first test in this block


        await addItem({item, token}, {expiry: expires + 20000, quantity: 20}).expect(201, {})
        await addItem({item, token}, {expiry: expires + 10000, quantity: 10}).expect(201, {})
        await addItem({item, token}, {expiry: expires + 50000, quantity: 30}).expect(201, {})
        await addItem({item, token}, {expiry: expires + 30000, quantity: 5}).expect(201, {})
        await getItem({item, token}).expect(200, {quantity: 65, validTill: expires + 10000})

    });

    it("Should pass when valid parameters are supplied", async function () {
        this.timeout(10000)

        await sellItem({item, token}, {quantity: 5}).expect(200)
        await getItem({item, token}).expect(200, {quantity: 60, validTill: expires + 10000})
        await sellItem({item, token}, {quantity: 15}).expect(200)
        await getItem({item, token}).expect(200, {quantity: 45, validTill: expires + 20000})
        await addItem({item, token}, {expiry: expires + 8000, quantity: 5}).expect(201, {})
        await sellItem({item, token}, {quantity: 4}).expect(200)
        await getItem({item, token}).expect(200, {quantity: 46, validTill: expires + 8000})


        //selling more than what is available
        await sellItem({item, token}, {quantity: 400}).expect(400)
        //nothing should change
        await getItem({item, token}).expect(200, {quantity: 46, validTill: expires + 8000})


    });


    it("Should fail when invalid parameters are supplied", async function () {
        this.timeout(5000)


        //invalid Token
        // await sellItem({item, token: "rubbish"}, {quantity: -2}).expect(401)

        // negative
        await sellItem({item, token}, {quantity: -5}).expect(422)

        // overflows
        await sellItem({item, token}, {
            quantity: Number.MAX_SAFE_INTEGER + 2000
        }).expect(422)

    });

    it("Concurrently", async function () {
        this.timeout(5000)

        await getItem({item, token}).expect(200, {quantity: 65, validTill: expires + 10000})

        let test = sellItem({item, token}, {quantity: 40})/*.expect(200)*/;
        let test2 = sellItem({item, token}, {quantity: 40})/*.expect(200)*/;
        await Promise.all([test, test2])
        await getItem({item, token}).expect(200, {quantity: 25, validTill: expires + 50000})


    });


});
