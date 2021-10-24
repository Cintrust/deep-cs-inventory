import supertest from "supertest";
import app from "../../app";

let superTest = supertest(app);

export let registerUser = (data?: any) => superTest.post("/auth/register")
    .send(data);
export let loginUser = (data?: any) => superTest.post("/auth/login")
    .send(data);
