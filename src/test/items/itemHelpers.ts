import supertest from "supertest";
import app from "../../app";

let superTest = supertest(app);

export let addItem = ({item,token}: {item: string,token:string }, data: { quantity: number, expiry: number }) => superTest
    .post(`/items/${item}/add?token=${token}`).send(data)
export let sellItem = ({item,token}: {item: string,token:string }, data: { quantity: number }) => superTest
    .post(`/items/${item}/sell?token=${token}`).send(data)
export let getItem = ({item,token}: {item: string,token:string }) => superTest
    .get(`/items/${item}/quantity?token=${token}`)
