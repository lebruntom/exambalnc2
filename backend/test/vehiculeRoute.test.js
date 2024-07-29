import jwt from "jsonwebtoken";
import app from "../server.js";
import request from "supertest";

describe("POST /api/vehicule", () => {
  //génération d'un token pour la requete
  const token = jwt.sign({ id: 1 }, "OEKFNEZKkF78EZFH93023NOEAF", {
    expiresIn: 86400,
  });

  let csrfToken;

  // Avant chaque test, récupérer un jeton CSRF
  beforeAll(async () => {
    const csrfResponse = await request(app)
      .get("/api/csrf-token")
      .set("Accept", "application/json");

    csrfToken = csrfResponse.body.csrfToken;
  });

  it("return 200", async () => {
    const vehiculeData = {
      annee: 2020,
      immat: "AB-123-CD",
      marque: "Peugeot",
      modele: "208",
      id_client: 1,
    };

    const response = await request(app)
      .post("/api/vehicule")
      .set("Cookie", [`token=${token}`])
      .set("Content-Type", "application/json")
      .set("csrf", csrfToken)
      .send(vehiculeData);

    expect(response.status).toBe(200);

    //Supprime le produit a la fin du test
    await request(app)
      .delete(`/api/vehicule/${response.body.insertId}`)
      .set("Accept", "application/json")
      .set("Cookie", [`token=${token}`])
      .set("Content-Type", "application/json")
      .set("csrf", csrfToken);
  });
});
