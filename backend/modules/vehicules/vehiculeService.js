import { db } from "../../server.js";

export async function listVehicule() {
  return new Promise((resolve, reject) => {
    const sql =
      "select v.id as id_vehicule, v.*, u.* from vehicule v LEFT JOIN users u ON v.client_id = u.id";
    db.query(sql, [], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results); // Renvoie la ligne
      }
    });
  });
}

export async function oneVehicule(id) {
  return new Promise((resolve, reject) => {
    const sql =
      "select v.id as id_vehicule, v.*, u.* from vehicule v LEFT JOIN users u ON v.client_id = u.id WHERE v.id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results); // Renvoie la ligne
      }
    });
  });
}

export async function deleteVehicule(id) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM vehicule WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(!!result);
      }
    });
  });
}
export async function updateVehicule(
  id,
  annee,
  immat,
  marque,
  modele,
  id_client
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE vehicule SET marque = ?, modele = ?, annee = ?, client_id = ?, immat = ? WHERE id = ?";
    db.query(
      sql,
      [marque, modele, annee, id_client, immat, id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!result);
        }
      }
    );
  });
}

export async function createVehicule(annee, immat, marque, modele, id_client) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO vehicule (marque, modele, annee, client_id, immat) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [marque, modele, annee, id_client, immat], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
