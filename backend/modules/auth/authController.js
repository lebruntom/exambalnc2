import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { checkUserExists, signupUser } from "./authService.js";

export async function signupController(req, res) {
  const { lastname, firstname, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  const result = await signupUser(lastname, firstname, email, hashedPassword);
  if (result) {
    res.status(201).send("User registered");
  } else {
    res.status(500).send("Server error");
  }
}

export async function signinController(req, res) {
  const { email, password } = req.body;

  const results = await checkUserExists(email);

  if (results.length === 0) {
    res.status(404).send("User not found");
    return;
  }

  const user = results[0];
  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    res.status(401).send("Invalid password");
    return;
  }

  const token = jwt.sign({ id: user.id }, "OEKFNEZKkF78EZFH93023NOEAF", {
    expiresIn: 86400,
  });
  res.cookie("token", token, { httpOnly: true, maxAge: 86400000 }); // 86400000 ms = 24 heures

  res.status(200).send({ auth: true, role: user.role });
}
