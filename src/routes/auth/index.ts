import {Router} from "express";
import {validateRequest} from "../../utility";
import {loginUserValidation, registerUserValidation} from "./authValidation";
import {loginUserController, registerUserController} from "./authControllers";

const router = Router()


router.post("/register", validateRequest(registerUserValidation), registerUserController)
router.post("/login", validateRequest(loginUserValidation), loginUserController)


export default router
