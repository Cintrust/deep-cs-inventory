import type express from "express";
import db from "../../db";

async function addItemController(req: express.Request, res: express.Response, _next: express.NextFunction) {


    try {
        // @ts-ignore
        const user_id = req.user.id
        let date = req.body.expiry;
        // let date = new Date(req.body.expiry);
        // date.setMilliseconds(0);
        await db.query("insert into items (`name`,`quantity`,`expires_at`,user_id) value (?,?,?,?)",

            [req.params.item, req.body.quantity, +date, user_id])

        res.status(201).json({})
    } catch (e) {
        return res.status(400).json({error: "invalid request", code: e.code})
    }


}

async function sellItemController(req: express.Request, res: express.Response, _next: express.NextFunction) {
    let connection = await db.getConnection();
    try {
        let date = + new Date()
        let sql = `select it.*
                   from items it
                   where it.user_id = ?
                     and it.name = ?
                     and it.expires_at > ?
                     and quantity > 0
                     and it.expires_at <=
                         (
                             select t.expires_at
                             from (select expires_at,
#                                           user_id,
#                                           name,
                                          sum(quantity) over (PARTITION BY name,name order by expires_at) as \`cumulative\`
                                   from items
                                   where user_id = ?
                                     and name = ?
                                     and expires_at > ?
                                     and quantity > 0
                                   order by cumulative
                                       for
                                   update
                                  ) t
                             where t.cumulative >= ?
                             limit 1
                         )
                   order by it.expires_at
                       for
                   update
        `;

        // @ts-ignore
        const user_id = req.user.id
        await connection.beginTransaction()
        let {results} = await connection.query(sql, [user_id, req.params.item,date, user_id, req.params.item,date, req.body.quantity])
        let soldOut = [];

        if (!results.length) {
            await connection.rollback()
            connection.release();
            return res.status(400).json({error: "could not be processed"})
        }

        let quantity = req.body.quantity;
        for (let i = 0; i < results.length - 1; ++i) {
            quantity -= results[i].quantity
            soldOut.push(results[i].id)
        }

        if (soldOut.length) {
            await connection.query(`update items
                                    set quantity=0
                                    where user_id = ?
                                      and name = ?
                                      and id in (?)`, [user_id, req.params.item, soldOut])
        }
        const last = results[results.length - 1];
        if (last) {
            await connection.query(`update items
                                    set quantity = quantity - ?
                                    where user_id = ?
                                      and name = ?
                                      and id = ?`, [quantity, user_id, req.params.item, last.id])

        }

        await connection.commit()
        connection.release();

        // return res.status(200).json({results})
        return res.status(200).json({})

    } catch (e) {
        await connection.rollback()
        connection.release();
        console.log(e)
        return res.status(400).json({error: "invalid request", code: e.code})
    }


}

async function getItemController(req: express.Request, res: express.Response, _next: express.NextFunction) {

    try {
        let date =  +new Date()
        // @ts-ignore
        const user_id = req.user.id
        const {results} = await db.query("select quantity,expires_at from items where expires_at > ? and quantity > 0 and user_id=? and name= ? order by expires_at ",
            [date,user_id, req.params.item])


        let response = {
            quantity: 0,
            validTill: results[0]?.expires_at??null
            // validTill: Date.parse(results[0]?.expires_at)
        }

        for (const result of results) {
            response.quantity += result.quantity
        }

        return res.status(200).json(response)
    } catch (e) {
        return res.status(400).json({error: "invalid request", code: e.code})
    }


}


export {addItemController, sellItemController, getItemController};
