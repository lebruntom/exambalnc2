import {
  createVehicule,
  deleteVehicule,
  listVehicule,
  oneVehicule,
  updateVehicule,
} from "./vehiculeService.js";

export async function listVehiculeController(req, res) {
  const results = await listVehicule();

  res.status(200).json({ vehicules: results });
}

export async function oneVehiculeController(req, res) {
  const id = req.params.id;

  const results = await oneVehicule(id);
  res.status(200).json({ vehicule: results });
}

export async function deleteVehiculeController(req, res) {
  const id = req.params.id;

  await deleteVehicule(id);

  res.status(200).json({ id });
}

export async function updateVehiculeController(req, res) {
  const id = req.params.id;
  const { annee, immat, marque, modele, client_id } = req.body;

  const id_client = client_id === "" ? null : client_id;

  await updateVehicule(id, annee, immat, marque, modele, id_client);

  res.status(200).json({ id });
}

export async function createVehiculeController(req, res) {
  const { annee, immat, marque, modele, client_id } = req.body;

  const id_client = client_id === "" ? null : client_id;

  const result = await createVehicule(annee, immat, marque, modele, id_client);

  res.status(200).json(result);
}
