import express from "express";
import UserRouter from "./user.router.js";
import PetRouter from "./pet.router.js";

const router = express.Router();

router.use("/user", UserRouter);
router.use("/pet", PetRouter);

export default router;
