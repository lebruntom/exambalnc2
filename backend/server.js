import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";
import jwt from "jsonwebtoken";

import cors from "cors";
import { resolve } from "path";

import cookieParser from "cookie-parser";
import authRoute from "./modules/auth/authRoute.js";
import helmet from "helmet";
import csrf from "csrf";
import vehiculeRoute from "./modules/vehicules/vehiculeRoute.js";

const tokens = new csrf();
const secret = tokens.secretSync();

const app = express();
const port = 3000;
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  const { csrf } = req.headers;
  if (req.method !== "GET" && !tokens.verify(secret, csrf)) {
    return res.status(403).json({ error: "Jeton CSRF invalide !" });
  }
  next();
});

// MySQL Connection
export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "garage",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database");
});

export const verifyTokenAndRole = (req, res, next) => {
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
// Routes

app.use(authRoute);
app.use(vehiculeRoute);
app.get(
  "/api/clients/count",
  (req, _res, next) => {
    req.requiredroles = ["admin"];
    next();
  },
  verifyTokenAndRole,
  (req, res) => {
    const sql = "SELECT COUNT(*) AS count FROM users WHERE role = ?";
    db.query(sql, ["client"], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Server error");
        return;
      }

      res.status(200).json(results[0]);
    });
  }
);

app.get(
  "/api/clients",
  (req, _res, next) => {
    req.requiredroles = ["admin"];
    next();
  },
  verifyTokenAndRole,
  (req, res) => {
    const sql = "SELECT * FROM users WHERE role = ?";
    db.query(sql, ["client"], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Server error");
        return;
      }
      res.status(200).json(results);
    });
  }
);

const __dirname = process.cwd();

app.get("/api/csrf-token", (req, res) => {
  // Générer un jeton CSRF
  const csrfToken = tokens.create(secret);
  // Renvoyer le jeton CSRF dans la réponse
  res.json({ csrfToken });
});
app.use(express.static(resolve(__dirname, "./client/dist")));
app.get("*", (_, res) => {
  res.sendFile(resolve(__dirname, "./client/dist/index.html"));
});
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
