import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser);
router.get("/me", auth(Role.admin, Role.user), userController.getMyProfile);

export const userRoute = router;