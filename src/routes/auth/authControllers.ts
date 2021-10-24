import type express from "express";
import bcrypt from "bcrypt";
import db from "../../db";
import jwt from "jsonwebtoken";

let jwt_secret = process.env.JWT_SECRET || "jwt_secret"

const saltRounds = 10;

 async function registerUserController (req: express.Request, res: express.Response, _next:express.NextFunction) {


    try {
        const password = await bcrypt.hash(req.body.password, saltRounds)
        const username = req.body.username
        const name = req.body.name
        /*  let {results} =*/
        await db.query("insert into users (`password`,`username`,`name`) value (?,?,?)", [password, username, name])

        res.status(201).json({})
    } catch (e) {
        return res.status(400).json({error: "user registration failed", code: e.code})
        // return  next(e);
    }

}


async function loginUserController(req: express.Request, res: express.Response, _next:express.NextFunction) {


    try {
        const {results} = await db.query("select id,password from users where username=?", [req.body.username])

        if (!results.length || !await bcrypt.compare(req.body.password, results[0].password)) {
            return res.status(401).json({error: "login failed",r:results})

        }

        const token = jwt.sign({
            id: results[0].id,
            username: req.body.username,
        }, jwt_secret, {expiresIn: 60 * 60000000});


        res.status(200).json({auth: token})
    } catch (e) {
        return res.status(400).json({error: "login failed", code: e.message})
        // return  next(e);
    }

}


export {loginUserController,registerUserController};
