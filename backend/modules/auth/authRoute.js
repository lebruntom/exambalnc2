import express from "express";
import { signinController, signupController } from "./authController.js";

const authRoute = express.Router();

authRoute.post("/api/signup", signupController);
authRoute.post("/api/signin", signinController);

export default authRoute;
