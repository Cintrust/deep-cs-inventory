import {Router} from "express";
import {validateRequest} from "../../utility";
import {addItemValidation, getItemValidation, sellItemValidation} from "./itemsValidation";
import {addItemController, getItemController, sellItemController} from "./itemController";

const router = Router()

router.post("/:item/add",validateRequest(addItemValidation),addItemController)
router.post("/:item/sell",validateRequest(sellItemValidation),sellItemController)
router.get("/:item/quantity",validateRequest(getItemValidation),getItemController)


export default router
