import express from "express";
import UserRouter from "./user.router.js";
import Test from "./test.js";

const router = express.Router();

router.use("/user", UserRouter);
router.use("/test", Test);

export default router;