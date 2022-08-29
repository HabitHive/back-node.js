import express from "express";
import UserRouter from "./user.router.js"
import TagRouter from "./tag.router.js"

const router = express.Router();

router.use("/user", UserRouter);
router.use("/tag", TagRouter);

export default router;