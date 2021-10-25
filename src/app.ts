import dotenv from "dotenv";
let result = dotenv.config();
if (result.error && !process.env.JAWSDB_MARIA_URL) {
    throw result.error
}

import express from "express"
import logger from "morgan";
import authRouter from "./routes/auth"
import itemsRouter from "./routes/items"
// import jwtMiddleware from "express-jwt"



// let jwt_secret = process.env.JWT_SECRET || "jwt_secret"
// let jwt_middleware = jwtMiddleware({
//     secret: jwt_secret,
//     algorithms: ['HS256'], requestProperty: 'user',
//     getToken: function fromHeaderOrQuerystring(req) {
//         if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//             return req.headers.authorization.split(' ')[1];
//         } else if (req.query && req.query.token) {
//             return req.query.token;
//         }
//         return null;
//     }
// })

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use('/auth', authRouter);

// app.use('/items', jwt_middleware, itemsRouter);
app.use('/items', function (req: express.Request, res: express.Response, next: express.NextFunction) {
    req.user={
        id:1
    };

    next();
}, itemsRouter);

app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({error: err.message, code: err.code, err, query: req.query});
    }
    return next(err)
});

// app.use(function (err: any, req: express.Request, res: express.Response) {
//
//     console.log({err})
//     // res.status(500).send({error: err.message})
//
// })
export default app
