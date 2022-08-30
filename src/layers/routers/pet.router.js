import express from "express";
const petRouter = express.Router();

import PetController from "../controllers/pet.controller.js";
const petController = new PetController();

import responseMiddle from "../middlewares/response.middleware.js";

petRouter.route("/list").get(petController.getPetList);
petRouter
  .route("/")
  .get(petController.getPetInfo)
  .post(petController.buyingPetExp);

petRouter.use("/", responseMiddle);

export default petRouter;
