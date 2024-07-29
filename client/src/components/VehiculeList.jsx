import React, { useEffect, useState } from 'react';
const baseURI = import.meta.env.VITE_API_BASE_URL
import {useNavigate } from 'react-router-dom';
import './VehiculeList.css';

const VehiculeList = () => {

    const navigate = useNavigate('')
const [vehicules, setVehicules] = useState([])


const [csrfToken, setCsrfToken] = useState("")

useEffect(() => {

  fetch(baseURI + 'api/csrf-token', {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json', 
    },
  })
  .then(response => response.json()) 
  .then(data => {
    setCsrfToken(data.csrfToken)
  })
  .catch(error => {
    console.error('Erreur lors de la récupération du CSRF token:', error);
  });
}, []);



    useEffect(() => {

        fetch(baseURI + 'api/vehicule/list', {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        .then(response => response.json()) 
        .then(data => {
            console.log(data);
            setVehicules(data.vehicules);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des vehicules:', error);
        });

    }, []);


const handleGoToUpdate = (id) => {
    navigate(`/dashboard/vehicule/${id}`)
}


const handleDeleteVehicule = (id)=> {

  const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?");

  // Si l'utilisateur confirme, procéder à la suppression
  if (isConfirmed) {
    fetch(baseURI + `api/vehicule/${id}`, {
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json', 
        CSRF: csrfToken
      },
      credentials: 'include'
    })
    .then(response => response.json()) 
    .then(data => {
      console.log(data);
      setVehicules((ps)=> ([...ps.filter((el)=> el.id_vehicule !== parseInt(data.id))]))
    })
    .catch(error => {
      console.error('Erreur lors de la récupération du CSRF token:', error);
    });
  }
}



    return (
      <table className="vehicule-table">
      <thead>
        <tr>
          <th>Marque</th>
          <th>Modèle</th>
          <th>Année</th>
          <th>Immat</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Modifier</th>
          <th>Supprimer</th>
        </tr>
      </thead>
      <tbody>
        {vehicules.map((vehicule)=> {
                return (
                  <tr key={vehicule.id_vehicule}>
                  <td>{vehicule.marque}</td>
                  <td>{vehicule.modele}</td>
                  <td>{vehicule.annee}</td>
                  <td>{vehicule.immat}</td>
                  <td>{vehicule.lastname}</td>
                  <td>{vehicule.firstname}</td>
                  <td onClick={() => handleGoToUpdate(vehicule.id_vehicule)} className="action-link">modifier</td>
                  <td onClick={() => handleDeleteVehicule(vehicule.id_vehicule)} className="action-link">supprimer</td>
                </tr>
                )
            })}
      </tbody>
      </table>    );
};

export default VehiculeList;