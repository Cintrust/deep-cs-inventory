import assert from 'assert'

import db from "../../db"
import {loginUser, registerUser} from "./authHelpers";


before(async function () {
    await db.query("truncate table `users` ")
    // runs once before the first test in this block
});

describe("User Registration:", function () {
    let username = "trust"



    it("Should pass when valid parameters are supplied", async function () {


        await registerUser({
                password: "simple",
                username: username,
                name: "simple trust"
            }).expect(201)



        describe("Registering the same user again", function () {

            it("Should fail", async function () {
                await registerUser({
                    password: "simple",
                    username: username,
                    name: "simple trust"
                }).expect(400,{
                    error:"user registration failed",
                    code:"ER_DUP_ENTRY"
                })

            })
        })
        describe("Authenticating the same user ", function () {

            it("Should pass", async function () {
          await loginUser({
                    password: "simple",
                    username: username,
                }).expect(200)

            })
        })


    });
    it("Should fail when invalid parameters are supplied", async function () {
        assert.equal(true, true)
        let res = await registerUser({
                password: "",
                username: "",
                name: ""
            }).expect(422)


        assert.equal(res.body.errors.length, 3)

    });


});



