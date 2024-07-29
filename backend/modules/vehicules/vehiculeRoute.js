import express from "express";
import {
  createVehiculeController,
  deleteVehiculeController,
  listVehiculeController,
  oneVehiculeController,
  updateVehiculeController,
} from "./vehiculeController.js";
// import { verifyTokenAndRole } from "../../server.js";
import { db } from "../../server.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const verifyTokenAndRole = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Access Denied: No Token Provided!");
  }
  const roles = req.requiredroles || ["admin", "client"];
  try {
    const decoded = jwt.verify(token, "OEKFNEZKkF78EZFH93023NOEAF");
    req.user = decoded;
    const sql = "SELECT role FROM users WHERE id = ?";
    db.query(sql, [req.user.id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }

      if (results.length === 0) {
        return res.status(404).send("User not found");
      }

      const userRole = results[0].role;
      if (!roles.includes(userRole)) {
        return res
          .status(403)
          .send("Access Denied: You do not have the required role!");
      }

      next();
    });
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

const vehiculeRoute = express.Router();

vehiculeRoute.get(
  "/api/vehicule/list",
  (req, res, next) => {
    req.requiredroles = ["admin"];
    next();
  },
  verifyTokenAndRole,
  listVehiculeController
);

vehiculeRoute.get(
  "/api/vehicule/:id",
  (req, res, next) => {
    req.requiredroles = ["admin"];
    next();
  },
  verifyTokenAndRole,
  oneVehiculeController
);

vehiculeRoute.delete(
  "/api/vehicule/:id",
  (req, res, next) => {
    req.requiredroles = ["admin"];
    next();
  },
  verifyTokenAndRole,
  deleteVehiculeController
);

vehiculeRoute.put(
  "/api/vehicule/:id",
  (req, res, next) => {
    req.requiredroles = ["admin"];
    next();
  },
  verifyTokenAndRole,
  updateVehiculeController
);

vehiculeRoute.post(
  "/api/vehicule",
  (req, res, next) => {
    req.requiredroles = ["admin"];
    next();
  },
  verifyTokenAndRole,
  createVehiculeController
);

export default vehiculeRoute;
