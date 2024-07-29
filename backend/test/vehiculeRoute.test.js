import jwt from "jsonwebtoken";
import app from "../server.js";
import request from "supertest";

describe("GET /api/vehicule/list", () => {
  //génération d'un token pour la requete
  const token = jwt.sign({ id: 1 }, "OEKFNEZKkF78EZFH93023NOEAF", {
    expiresIn: 86400,
  });

  it("return 200", async () => {
    const response = await request(app)
      .get("/api/vehicule/list")
      .set("Cookie", [`token=${token}`])
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
  });
});

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

describe("DELETE /product/:id", () => {
  let vehiculeId;
  let csrfToken;

  const token = jwt.sign({ id: 1 }, "OEKFNEZKkF78EZFH93023NOEAF", {
    expiresIn: 86400,
  });

  // Avant chaque test, créer un produit à supprimer et récupérer un jeton CSRF
  beforeAll(async () => {
    // Créer un véhicule fictif à supprimer
    const vehiculeData = {
      annee: 2020,
      immat: "AB-123-CD",
      marque: "Peugeot",
      modele: "208",
      id_client: 1,
    };

    // Récupérer un jeton CSRF
    const csrfResponse = await request(app)
      .get("/api/csrf-token")
      .set("Accept", "application/json");
    csrfToken = csrfResponse.body.csrfToken;

    // Créer le produit fictif
    const createVehiculeResponse = await request(app)
      .post("/api/vehicule")
      .send(vehiculeData)
      .set("Cookie", [`token=${token}`])
      .set("Content-Type", "application/json")
      .set("csrf", csrfToken);
    vehiculeId = createVehiculeResponse.body.insertId;
    console.debug("Product created:", createVehiculeResponse.body.insertId); // Message de débogage
  });

  it('responds with JSON containing a status "ok"', async () => {
    console.debug("Vehicule to delete:", vehiculeId); // Message de débogage
    const response = await request(app)
      .delete(`/api/vehicule/${vehiculeId}`)
      .set("Cookie", [`token=${token}`])
      .set("Content-Type", "application/json")
      .set("csrf", csrfToken); // Ajoute le jeton CSRF à la requête

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: `${vehiculeId}` });
  });
});
