import express from "express";
import UserRouter from "./user.router.js";

// import PetRouter from "./pet.router.js";
import TagRouter from "./tag.router.js";
// import Test from "./testrouter.js";

const router = express.Router();

router.use("/user", UserRouter);

// router.use("/pet", PetRouter);
router.use("/tag", TagRouter);
// router.use("/test", Test);

export default router;
